package com.jobportal.service;

import com.jobportal.dto.ProfileDto;
import com.jobportal.entity.Profile;
import com.jobportal.exception.JobPortalExceeption;
import com.jobportal.repository.ProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service("profileService")
public class ProfileServiceImpl implements ProfileService{

    @Autowired
    private ProfileRepository profileRepository;

    @Override
    public Long createProfile(String email, String name, Long id) throws JobPortalExceeption {
        Profile profile = new Profile();
        profile.setId(id);
        profile.setEmail(email);
        profile.setSkills(new ArrayList<>());
        profile.setExperiences(new ArrayList<>());
        profile.setCertifications(new ArrayList<>());
        profile.setSavedJobs(new ArrayList<>());
//        profile.setPicture(new Byte());
        profile.setName(name);
        profileRepository.save(profile);
        return profile.getId();
    }

    @Override
    public ProfileDto getProfile(Long id) throws JobPortalExceeption {
        return profileRepository.findById(id).orElseThrow(() -> new JobPortalExceeption("PROFILE_NOT_FOUND")).toDto();
    }

    @Override
    public ProfileDto updateProfile(ProfileDto profileDto) throws JobPortalExceeption {
        profileRepository.findById(profileDto.getId()).orElseThrow(() -> new JobPortalExceeption("PROFILE_NOT_FOUND"));
        getWorkingIsTrueSetEndDate(profileDto.getId(),profileDto);
        profileDto.setTotalExp(calculateTotalExp(profileDto));
        profileRepository.save(profileDto.toEntity());
        return profileDto;
    }

    @Override
    public List<ProfileDto> getAllProfile() {
        return profileRepository.findAll().stream().map((x)-> x.toDto()).toList();
    }

    public void getWorkingIsTrueSetEndDate(Long id, ProfileDto profileDto) throws JobPortalExceeption {
        profileRepository.findById(id).orElseThrow(() -> new JobPortalExceeption("PROFILE_NOT_FOUND"));
        profileRepository.findById(id).ifPresent(profile1 -> {
            if (profile1.getExperiences() != null) {
                profile1.getExperiences().stream()
                    .filter(experience -> Boolean.TRUE.equals(experience.getWorking()) && (experience.getEndDate() == null || !experience.getEndDate().isEqual(LocalDateTime.now())))
                    .forEach(experience -> {
                        if (profileDto.getExperiences() != null) {
                            profileDto.getExperiences().stream()
                                .filter(experience1 -> Boolean.TRUE.equals(experience1.getWorking()))
                                .forEach(experience1 -> experience1.setEndDate(LocalDateTime.now()));
                        }
                    });
            }
        });
    }

    public Long calculateTotalExp(ProfileDto profileDto){
        if (profileDto.getExperiences() == null || profileDto.getExperiences().isEmpty()) {
            return 0L;
        }
        List<Long> months = profileDto.getExperiences().stream()
                .filter(experience -> experience.getStartDate() != null && experience.getEndDate() != null)
                .map(experience -> ChronoUnit.MONTHS.between(experience.getStartDate(), experience.getEndDate()))
                .collect(Collectors.toList());
        Long sum = months.stream().mapToLong(Long::longValue).sum();
        double expYear = Math.round(sum/12);
        return (long) expYear;
    }

}
