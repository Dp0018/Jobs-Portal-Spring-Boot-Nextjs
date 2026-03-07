package com.jobportal.service;

import com.jobportal.dto.*;
import com.jobportal.entity.Applicant;
import com.jobportal.entity.Job;
import com.jobportal.exception.JobPortalExceeption;
import com.jobportal.repository.JobRepository;
import com.jobportal.repository.ProfileRepository;
import com.jobportal.entity.Profile;
import com.jobportal.utility.Utilities;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.Set;
import java.util.HashSet;
import java.util.stream.Collectors;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jobportal.repository.UserRepository;
import com.jobportal.entity.User;
import com.jobportal.utility.Data;

@Service("jobService")
public class JobServiceImpl implements JobService{
    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ResendEmailService resendEmailService;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private CVParserService cvParserService;

    @Autowired
    private AIService aiService;

    @Autowired
    private ProfileRepository profileRepository;

    @Override
    public JobDTO postJob(JobDTO jobDTO) throws JobPortalExceeption {

        if(jobDTO.getId() == null || jobDTO.getId() == 0){
            jobDTO.setId(Utilities.getNextSequence("jobs"));
            jobDTO.setPostTime(LocalDateTime.now());
            NotificationDto notificationDto = new NotificationDto();
            notificationDto.setAction("Job Posted");
            notificationDto.setMessage("Job posted successfully for "+jobDTO.getJobTitle());
            notificationDto.setUserId(jobDTO.getPostedBy()  );
            notificationDto.setRoute("/posted-jobs/"+jobDTO.getId());

            try {
                notificationService.sendNotification(notificationDto);

            } catch (JobPortalExceeption e) {
                throw new RuntimeException(e);
            }}
        else{
            Job job = jobRepository.findById(jobDTO.getId()).orElseThrow(()-> new JobPortalExceeption("JOB_NOT_FOUND"));
            if(job.getJobStatus().equals(JobStatus.DRAFT) || jobDTO.getJobStatus().equals(JobStatus.CLOSED) )
                jobDTO.setPostTime(LocalDateTime.now());
        }

        Job jobToSave = jobDTO.toEntity();

        // Generate Vector Embedding for Vector Search / RAG
        String embedText = jobToSave.getJobTitle() + " " + jobToSave.getDescription() + " " +
                (jobToSave.getSkillsRequired() != null ? String.join(", ", jobToSave.getSkillsRequired()) : "");
        List<Double> embedding = aiService.generateEmbedding(embedText);
        jobToSave.setJobEmbedding(embedding);

        Job savedJob = jobRepository.save(jobToSave);

        // Store in MongoDB Atlas Vector Store for RAG similarity search
        try {
            aiService.storeInVectorStore(
                    "job-" + savedJob.getId(),
                    embedText,
                    java.util.Map.of("type", "job", "jobId", String.valueOf(savedJob.getId()), "title",
                            savedJob.getJobTitle()));
        } catch (Exception e) {
            System.out.println("⚠️ VectorStore indexing failed (non-blocking): " + e.getMessage());
        }

        return savedJob.toDTO();
    }

    @Override
    public List<JobDTO> getAllJobs() {
        return jobRepository.findAll().stream()
                .filter(job -> job.getEndDate() == null || !job.getEndDate().isBefore(LocalDateTime.now()))
                .map(Job::toDTO)
                .toList();
    }

    @Override
    public List<JobDTO> getAllJobsIncludingExpired() {
        return jobRepository.findAll().stream()
                .map(Job::toDTO)
                .toList();
    }

    @Override
    public JobDTO getJob(Long id) throws JobPortalExceeption {
        return jobRepository.findById(id).orElseThrow(()-> new JobPortalExceeption("JOB_NOT_FOUND")).toDTO();
    }

    @Override
    public void applyJob(Long id, ApplicantDTO applicantDTO) throws JobPortalExceeption {
        Job job = jobRepository.findById(id).orElseThrow(()-> new JobPortalExceeption("JOB_NOT_FOUND"));

        List<Applicant> applicants = job.getApplicants();
        if (applicants == null) applicants = new ArrayList<>();

        if(applicants.stream().filter((x) -> x.getApplicantId() ==applicantDTO.getApplicantId()).toList().size() > 0) throw new JobPortalExceeption("JOB_APPLIED_ALREADY");

        applicantDTO.setApplicationStatus(ApplicationStatus.APPLIED);
        applicantDTO.setMatchScore(null); // Score will be hydrated later via manual AI scan
        applicantDTO.setAiExplanation(null);

        Applicant applicantToSave = applicantDTO.toEntity();

        // Advanced AI: Generate Resume Vector Embeddings upon application (RAG Step)
        String resumeText = cvParserService.extractTextFromBase64Pdf(applicantDTO.getResume());
        if (resumeText != null && !resumeText.trim().isEmpty()) {
            List<Double> resumeEmbedding = aiService.generateEmbedding(resumeText);
            applicantToSave.setResumeEmbedding(resumeEmbedding);

            // Store in MongoDB Atlas Vector Store for RAG similarity search
            try {
                aiService.storeInVectorStore(
                        "resume-" + applicantToSave.getApplicantId() + "-job-" + id,
                        resumeText,
                        java.util.Map.of("type", "resume", "applicantId",
                                String.valueOf(applicantToSave.getApplicantId()), "jobId", String.valueOf(id)));
            } catch (Exception e) {
                System.out.println("⚠️ VectorStore indexing failed (non-blocking): " + e.getMessage());
            }
        }

        applicants.add(applicantToSave);
        job.setApplicants(applicants);
        jobRepository.save(job);

        // Notify Employer
        NotificationDto notificationDto = new NotificationDto();
        notificationDto.setAction("New Applicant");
        notificationDto.setMessage(applicantDTO.getName() + " applied for " + job.getJobTitle());
        notificationDto.setUserId(job.getPostedBy());
        notificationDto.setRoute("/employer/jobs/" + job.getId() + "/analytics");

        try {
            notificationService.sendNotification(notificationDto);
        } catch (JobPortalExceeption e) {
            System.out.println("Error sending application notification: " + e.getMessage());
        }
    }

    @Override
    public ApplicantDTO analyzeResume(Long jobId, Long applicantId) throws JobPortalExceeption {
        Job job = jobRepository.findById(jobId).orElseThrow(() -> new JobPortalExceeption("JOB_NOT_FOUND"));

        List<Applicant> applicants = job.getApplicants();
        if (applicants == null || applicants.isEmpty())
            throw new JobPortalExceeption("NO_APPLICANTS_FOUND");

        Applicant targetApplicant = applicants.stream()
                .filter(a -> a.getApplicantId().equals(applicantId))
                .findFirst()
                .orElseThrow(() -> new JobPortalExceeption("APPLICANT_NOT_FOUND"));

        String resumeText = cvParserService.extractTextFromPdfBytes(targetApplicant.getResume());

        // JIT Generation: If the job or applicant was created before Vector Search,
        // generate them now
        boolean embeddingsChanged = false;
        try {
            if (job.getJobEmbedding() == null || job.getJobEmbedding().isEmpty()) {
                String embedText = job.getJobTitle() + " " + job.getDescription() + " " +
                        (job.getSkillsRequired() != null ? String.join(", ", job.getSkillsRequired()) : "");
                List<Double> newJobEmbedding = aiService.generateEmbedding(embedText);
                if (newJobEmbedding.isEmpty()) {
                    throw new RuntimeException(
                            "generateEmbedding(job) returned an empty array! Check Gemini Key or Quota.");
                }
                job.setJobEmbedding(newJobEmbedding);
                embeddingsChanged = true;
            }

            if (targetApplicant.getResumeEmbedding() == null || targetApplicant.getResumeEmbedding().isEmpty()) {
                if (resumeText != null && !resumeText.isEmpty()) {
                    List<Double> newResumeEmbedding = aiService.generateEmbedding(resumeText);
                    if (newResumeEmbedding.isEmpty()) {
                        throw new RuntimeException(
                                "generateEmbedding(resume) returned an empty array! Check Gemini Key or Quota.");
                    }
                    targetApplicant.setResumeEmbedding(newResumeEmbedding);
                    embeddingsChanged = true;
                }
            }
        } catch (Exception e) {
            targetApplicant.setAiExplanation("ERROR DURING VECTOR GENERATION: " + e.getMessage());
            targetApplicant.setMatchScore(0);
            jobRepository.save(job);
            return targetApplicant.toDTO();
        }

        if (embeddingsChanged) {
            jobRepository.save(job);
        }

        // Advanced AI: Retrieve Vectors and Calculate Mathematical Cosine Similarity
        double cosineSim = 0.0;
        if (job.getJobEmbedding() != null && targetApplicant.getResumeEmbedding() != null) {
            cosineSim = aiService.calculateCosineSimilarity(job.getJobEmbedding(),
                    targetApplicant.getResumeEmbedding());
        }

        // ── Step 1: Get accurate match score via a dedicated simple Gemini call ──
        String jobDescriptionFull = job.getJobTitle() + "\\n" + job.getDescription();
        int matchScore = aiService.getMatchScore(resumeText, jobDescriptionFull);

        // ── Step 2: Get explanation, skills, and fairness from the RAG model ──
        String aiResponse = aiService.analyzeResumeAdvanced(resumeText, jobDescriptionFull, cosineSim);

        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode node = mapper.readTree(aiResponse);
            String explanation = node.has("aiExplanation") ? node.get("aiExplanation").asText()
                    : "No explanation provided.";

            int fairnessScore = node.has("fairnessScore") ? node.get("fairnessScore").asInt() : 100;
            String fairnessExplanation = node.has("fairnessExplanation") ? node.get("fairnessExplanation").asText()
                    : "Evaluated objectively based on skills.";

            List<String> reqSkills = new ArrayList<>();
            if (node.has("requiredSkills")) {
                node.get("requiredSkills").forEach(s -> reqSkills.add(s.asText()));
            }

            List<String> candSkills = new ArrayList<>();
            if (node.has("candidateSkills")) {
                node.get("candidateSkills").forEach(s -> candSkills.add(s.asText()));
            }

            // Use the score from the dedicated getMatchScore() call
            targetApplicant.setMatchScore(matchScore);
            targetApplicant.setAiExplanation(explanation);
            targetApplicant.setFairnessScore(fairnessScore);
            targetApplicant.setFairnessExplanation(fairnessExplanation);
            targetApplicant.setRequiredSkills(reqSkills);
            targetApplicant.setCandidateSkills(candSkills);
        } catch (Exception e) {
            targetApplicant.setMatchScore(matchScore); // still use the dedicated score even on parse failure
            targetApplicant.setAiExplanation("Error parsing AI response: " + e.getMessage() + " | Raw: " + aiResponse);
            targetApplicant.setFairnessScore(0);
            targetApplicant.setFairnessExplanation("Error assessing fairness.");
            targetApplicant.setRequiredSkills(new ArrayList<>());
            targetApplicant.setCandidateSkills(new ArrayList<>());
        }

        jobRepository.save(job);
        return targetApplicant.toDTO();
    }

    @Override
    public List<JobDTO> getJobsPostedBy(Long id) {
        return jobRepository.findByPostedBy(id).stream().map((x) -> x.toDTO()).toList();
    }

    @Override
    public void changeAppStatus(Application application) throws JobPortalExceeption {
        Job job = jobRepository.findById(application.getId()).orElseThrow(()-> new JobPortalExceeption("JOB_NOT_FOUND"));

        List<Applicant> applicants = job.getApplicants().stream().map((x) -> {
            if (application.getApplicantId() == x.getApplicantId()) {
                x.setApplicationStatus(application.getApplicationStatus());

                String action = "";
                String message = "";
                String emailMessage = "";

                if(application.getApplicationStatus().equals(ApplicationStatus.INTERVIEWING)) {
                    x.setInterviewTime(application.getInterviewTime());
                    action = "Interview Scheduled";
                    message = "Interview Scheduled for job: " + job.getJobTitle();
                    emailMessage = "Congratulations! You have been selected for an interview for the position of "
                            + job.getJobTitle() + " at " + job.getCompany()
                            + ". We will be in touch shortly with more details.";
                } else if (application.getApplicationStatus().equals(ApplicationStatus.REJECTED)) {
                    action = "Application Update";
                    message = "Your application for " + job.getJobTitle() + " was not selected.";
                    emailMessage = "Thank you for your interest in " + job.getCompany()
                            + ". Unfortunately, we will not be moving forward with your application for the "
                            + job.getJobTitle() + " position at this time. We wish you the best in your job search.";
                } else if (application.getApplicationStatus().equals(ApplicationStatus.OFFERED)) {
                    action = "Offer Received";
                    message = "Congratulations! You received an offer for " + job.getJobTitle();
                    emailMessage = "Congratulations! We are thrilled to offer you the position of " + job.getJobTitle()
                            + " at " + job.getCompany() + ". Welcome to the team!";
                } else if (application.getApplicationStatus().equals(ApplicationStatus.APPLIED)) {
                    action = "Application Status Reset";
                    message = "Your application for " + job.getJobTitle() + " was reset to APPLIED.";
                }

                // Override with custom email message from employer if provided
                if (application.getEmailMessage() != null && !application.getEmailMessage().isBlank()) {
                    emailMessage = application.getEmailMessage();
                }

                if (!action.isEmpty()) {
                    NotificationDto notificationDto = new NotificationDto();
                    notificationDto.setAction(action);
                    notificationDto.setMessage(message);
                    notificationDto.setUserId(application.getApplicantId());
                    notificationDto.setRoute("/jhistory");

                    try {
                        notificationService.sendNotification(notificationDto);

                        // Send Email Notification via Resend
                        User user = userRepository.findById(application.getApplicantId()).orElse(null);
                        if (user != null) {
                            String emailBody = Data.getApplicationStatusBody(
                                    user.getName(),
                                    job.getJobTitle(),
                                    job.getCompany(),
                                    application.getApplicationStatus().name(),
                                    emailMessage,
                                    // Format interview time as readable string
                                    application.getInterviewTime() != null
                                            ? application.getInterviewTime().format(
                                                    java.time.format.DateTimeFormatter
                                                            .ofPattern("EEEE, MMMM d, yyyy 'at' hh:mm a"))
                                            : null,
                                    // Compute missing skills for rejection emails
                                    application.getApplicationStatus().equals(ApplicationStatus.REJECTED)
                                            ? computeMissingSkills(job.getSkillsRequired(), x.getCandidateSkills())
                                            : null);
                            resendEmailService.sendEmail(
                                    user.getEmail(),
                                    action + " - " + job.getCompany(),
                                    emailBody);
                        }

                    } catch (Exception e) {
                        System.out.println("Error sending notification or email: " + e.getMessage());
                    }
                }
            }
            return  x;
        }).toList();
        job.setApplicants(applicants);
        jobRepository.save(job);

    }

    @Override
    public Object getApplicantsFiltered(Long jobId, String status, Integer matchScore, int page, int size)
            throws JobPortalExceeption {
        Job job = jobRepository.findById(jobId).orElseThrow(() -> new JobPortalExceeption("JOB_NOT_FOUND"));

        List<Applicant> applicants = job.getApplicants();
        if (applicants == null) {
            applicants = new ArrayList<>();
        }

        // Apply filters
        List<ApplicantDTO> filtered = applicants.stream()
                .filter(a -> {
                    boolean matchesStatus = true;
                    if (status != null && !status.trim().isEmpty()) {
                        matchesStatus = a.getApplicationStatus().name().equalsIgnoreCase(status);
                    }

                    boolean matchesScore = true;
                    if (matchScore != null) {
                        matchesScore = a.getMatchScore() != null && a.getMatchScore() >= matchScore;
                    }

                    return matchesStatus && matchesScore;
                })
                // Sort by applied date descending (assuming applicantId strictly increments
                // over time as proxy, or we can just reverse since newly applied are added to
                // end of list)
                .sorted((a1, a2) -> a2.getApplicantId().compareTo(a1.getApplicantId()))
                .map(Applicant::toDTO)
                .toList();

        // Apply pagination
        int totalElements = filtered.size();
        int totalPages = (int) Math.ceil((double) totalElements / size);

        int fromIndex = page * size;
        int MathMin = Math.min(fromIndex + size, totalElements);

        List<ApplicantDTO> content = new ArrayList<>();
        if (fromIndex < totalElements) {
            content = filtered.subList(fromIndex, MathMin);
        }

        // Create a custom paginated response map
        java.util.Map<String, Object> response = new java.util.HashMap<>();
        response.put("content", content);
        response.put("page", page);
        response.put("size", size);
        response.put("totalElements", totalElements);
        response.put("totalPages", totalPages);

        return response;
    }

    @Override
    public List<ApplicantDTO> getApplicantsByEmployer(Long employerId, List<String> status) throws JobPortalExceeption {
        List<Job> jobs = jobRepository.findByPostedBy(employerId);
        List<ApplicantDTO> filteredApplicants = new ArrayList<>();

        for (Job job : jobs) {
            if (job.getApplicants() != null) {
                for (Applicant applicant : job.getApplicants()) {
                    // Check if applicant matches the status filter (if provided)
                    boolean matchesStatus = false;
                    if (status == null || status.isEmpty()) {
                        matchesStatus = true; // No filter, include all
                    } else {
                        for (String s : status) {
                            if (applicant.getApplicationStatus().name().equalsIgnoreCase(s)) {
                                matchesStatus = true;
                                break;
                            }
                        }
                    }

                    if (matchesStatus) {
                        ApplicantDTO dto = applicant.toDTO();
                        // Inject job context
                        dto.setJobId(job.getId());
                        dto.setJobTitle(job.getJobTitle());
                        dto.setCompany(job.getCompany());
                        filteredApplicants.add(dto);
                    }
                }
            }
        }

        return filteredApplicants;
    }

    @Override
    public void deleteJob(Long id) throws JobPortalExceeption {
        Job job = jobRepository.findById(id).orElseThrow(() -> new JobPortalExceeption("JOB_NOT_FOUND"));
        jobRepository.delete(job);
    }

    /**
     * Compare required skills for the job vs the candidate's skills.
     * Returns a comma-separated string of skills the candidate is missing.
     */
    private String computeMissingSkills(List<String> requiredSkills, List<String> candidateSkills) {
        if (requiredSkills == null || requiredSkills.isEmpty())
            return null;

        // Build a lowercase set of candidate skills for case-insensitive matching
        java.util.Set<String> candidateSet = new java.util.HashSet<>();
        if (candidateSkills != null) {
            for (String s : candidateSkills) {
                candidateSet.add(s.toLowerCase().trim());
            }
        }

        List<String> missing = new ArrayList<>();
        for (String required : requiredSkills) {
            if (!candidateSet.contains(required.toLowerCase().trim())) {
                missing.add(required);
            }
        }
        return missing.isEmpty() ? null : String.join(", ", missing);
    }

    /*
     * ═══════════════════════════════════════════════════════════════════
     * AI JOB RECOMMENDATION ENGINE
     * Combines content-based filtering (70%) + collaborative filtering (30%)
     * to recommend the most relevant jobs to a candidate.
     * ═══════════════════════════════════════════════════════════════════
     */
    @Override
    public List<JobDTO> getRecommendedJobs(Long userId) throws JobPortalExceeption {
        // 1. Fetch user profile
        Profile profile = profileRepository.findById(userId)
                .orElseThrow(() -> new JobPortalExceeption("PROFILE_NOT_FOUND"));

        // 2. Fetch all active jobs
        List<Job> allJobs = jobRepository.findAll().stream()
                .filter(j -> j.getJobStatus() == JobStatus.ACTIVE)
                .collect(Collectors.toList());

        if (allJobs.isEmpty()) {
            return new ArrayList<>();
        }

        // ── CONTENT-BASED FILTERING ──
        // Build a text profile from user's skills, jobTitle, about, and experience
        StringBuilder profileText = new StringBuilder();
        if (profile.getJobTitle() != null)
            profileText.append(profile.getJobTitle()).append(" ");
        if (profile.getAbout() != null)
            profileText.append(profile.getAbout()).append(" ");
        if (profile.getSkills() != null && !profile.getSkills().isEmpty()) {
            profileText.append(String.join(" ", profile.getSkills())).append(" ");
        }
        if (profile.getExperiences() != null) {
            profile.getExperiences().forEach(exp -> {
                if (exp.getTitle() != null)
                    profileText.append(exp.getTitle()).append(" ");
                if (exp.getCompany() != null)
                    profileText.append(exp.getCompany()).append(" ");
            });
        }

        // Generate embedding for the user's profile
        String profileStr = profileText.toString().trim();
        Map<Long, Double> contentScores = new HashMap<>();

        if (!profileStr.isEmpty()) {
            try {
                List<Double> profileEmbedding = aiService.generateEmbedding(profileStr);

                // Calculate cosine similarity against each job's embedding
                for (Job job : allJobs) {
                    double score = 0.0;
                    if (job.getJobEmbedding() != null && !job.getJobEmbedding().isEmpty()) {
                        score = aiService.calculateCosineSimilarity(profileEmbedding, job.getJobEmbedding());
                    } else {
                        // Job has no embedding yet — generate one on the fly from title + description
                        String jobText = (job.getJobTitle() != null ? job.getJobTitle() : "") + " "
                                + (job.getDescription() != null ? job.getDescription() : "") + " "
                                + (job.getSkillsRequired() != null ? String.join(" ", job.getSkillsRequired()) : "");
                        if (!jobText.trim().isEmpty()) {
                            List<Double> jobEmb = aiService.generateEmbedding(jobText.trim());
                            job.setJobEmbedding(jobEmb);
                            jobRepository.save(job);
                            score = aiService.calculateCosineSimilarity(profileEmbedding, jobEmb);
                        }
                    }
                    contentScores.put(job.getId(), Math.max(0, score));
                }
            } catch (Exception e) {
                System.err.println("⚠️ Recommendation: embedding error — " + e.getMessage());
            }
        }

        // ── COLLABORATIVE FILTERING ──
        // Find jobs the current user has applied to
        Set<Long> userAppliedJobIds = new HashSet<>();
        for (Job job : allJobs) {
            if (job.getApplicants() != null) {
                for (Applicant app : job.getApplicants()) {
                    if (app.getApplicantId() != null && app.getApplicantId().equals(userId)) {
                        userAppliedJobIds.add(job.getId());
                    }
                }
            }
        }

        // Find other users who applied to the same jobs
        Set<Long> similarUserIds = new HashSet<>();
        for (Job job : allJobs) {
            if (userAppliedJobIds.contains(job.getId()) && job.getApplicants() != null) {
                for (Applicant app : job.getApplicants()) {
                    if (app.getApplicantId() != null && !app.getApplicantId().equals(userId)) {
                        similarUserIds.add(app.getApplicantId());
                    }
                }
            }
        }

        // Count how many similar users applied to each job the current user hasn't
        Map<Long, Integer> collaborativeHits = new HashMap<>();
        for (Job job : allJobs) {
            if (!userAppliedJobIds.contains(job.getId()) && job.getApplicants() != null) {
                int hits = 0;
                for (Applicant app : job.getApplicants()) {
                    if (app.getApplicantId() != null && similarUserIds.contains(app.getApplicantId())) {
                        hits++;
                    }
                }
                if (hits > 0) {
                    collaborativeHits.put(job.getId(), hits);
                }
            }
        }
        int maxHits = collaborativeHits.values().stream().mapToInt(Integer::intValue).max().orElse(1);

        // ── COMBINE SCORES ──
        // finalScore = 0.7 * contentScore + 0.3 * collaborativeScore (normalized)
        Map<Long, Double> finalScores = new HashMap<>();
        for (Job job : allJobs) {
            // Skip jobs the user already applied to
            if (userAppliedJobIds.contains(job.getId()))
                continue;

            double content = contentScores.getOrDefault(job.getId(), 0.0);
            double collab = collaborativeHits.containsKey(job.getId())
                    ? (double) collaborativeHits.get(job.getId()) / maxHits
                    : 0.0;
            double finalScore = 0.7 * content + 0.3 * collab;
            finalScores.put(job.getId(), finalScore);
        }

        // Sort by final score descending and return top 6
        return allJobs.stream()
                .filter(j -> finalScores.containsKey(j.getId()))
                .sorted((a, b) -> Double.compare(
                        finalScores.getOrDefault(b.getId(), 0.0),
                        finalScores.getOrDefault(a.getId(), 0.0)))
                .limit(6)
                .map(Job::toDTO)
                .collect(Collectors.toList());
    }
}
