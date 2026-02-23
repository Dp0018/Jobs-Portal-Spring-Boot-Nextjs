package com.jobportal.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import com.google.genai.Client;
import com.google.genai.types.GenerateContentResponse;

@Service
public class AIService {

    @Value("${gemini.api.key:DIAGNOSTIC_PLACEHOLDER_KEY}")
    private String geminiApiKey;

    private final ObjectMapper objectMapper;

    public AIService() {
        this.objectMapper = new ObjectMapper();
    }

    public String analyzeResume(String resumeText, String jobDescription) {
        String prompt = "You are an expert HR Technical Recruiter. Please analyze the following resume against the provided job description.\n\n" +
                "Job Description:\n" + jobDescription + "\n\n" +
                "Resume:\n" + resumeText + "\n\n" +
                "Provide a JSON response STRICTLY in the following exact format without any markdown wrappers (no ```json or backticks):\n" +
                "{\n" +
                "  \"matchScore\": 85,\n" +
                "  \"aiExplanation\": \"The candidate is a strong fit...\",\n" +
                "  \"requiredSkills\": [\"Java\", \"Spring Boot\"],\n" +
                "  \"candidateSkills\": [\"Java\", \"React\"]\n" +
                "}";

        try {
            Client client;
            if (geminiApiKey != null && !geminiApiKey.equals("DIAGNOSTIC_PLACEHOLDER_KEY") && !geminiApiKey.isEmpty()) {
                client = Client.builder().apiKey(geminiApiKey).build();
            } else {
                client = new Client(); // Falls back to GEMINI_API_KEY env var
            }

            GenerateContentResponse response = client.models.generateContent(
                "gemini-2.5-flash",
                prompt,
                null
            );

            String aiResponseText = response.text();

            // Simple validation to ensure it's still clean JSON
            JsonNode rootNode = objectMapper.readTree(aiResponseText);

            String jsonText = rootNode.toString();

            // Defensively clean up any stray markdown wrappers
            if(jsonText.startsWith("```json")) {
                jsonText = jsonText.substring(7);
            }
            if(jsonText.endsWith("```")) {
                jsonText = jsonText.substring(0, jsonText.length() - 3);
            }

            return jsonText.trim();
        } catch (Exception e) {
            e.printStackTrace();
            return "{\"matchScore\": 0, \"aiExplanation\": \"Error analyzing resume via AI: " + e.getMessage() + "\"}";
        }
    }
}
