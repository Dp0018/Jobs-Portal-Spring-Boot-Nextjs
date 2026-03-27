package com.jobportal.service;

import com.jobportal.dto.ReviewDTO;
import com.jobportal.entity.Review;
import com.jobportal.exception.JobPortalExceeption;
import com.jobportal.repository.ReviewRepository;
import com.jobportal.utility.Utilities;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service(value = "reviewService")
public class ReviewServiceImpl implements ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Override
    public ReviewDTO addReview(ReviewDTO reviewDTO) throws Exception {
        // Enforce 1 review per user per company
        List<Review> existingReviews = reviewRepository.findByCompanyId(reviewDTO.getCompanyId());
        boolean alreadyReviewed = existingReviews.stream()
                .anyMatch(r -> r.getReviewerId().equals(reviewDTO.getReviewerId()));
        
        if (alreadyReviewed) {
            throw new JobPortalExceeption("You have already reviewed this company.");
        }

        reviewDTO.setId(Utilities.getNextSequence("reviews"));
        reviewDTO.setCreatedAt(LocalDateTime.now());
        Review review = reviewDTO.toEntity();
        review = reviewRepository.save(review);
        return review.toDTO();
    }

    @Override
    public List<ReviewDTO> getReviewsByCompanyId(Long companyId) throws Exception {
        return reviewRepository.findByCompanyId(companyId).stream()
                .map(Review::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public ReviewDTO updateReview(ReviewDTO reviewDTO) throws Exception {
        Review review = reviewRepository.findById(reviewDTO.getId())
                .orElseThrow(() -> new JobPortalExceeption("Review not found"));
        review.setRating(reviewDTO.getRating());
        review.setComment(reviewDTO.getComment());
        review = reviewRepository.save(review);
        return review.toDTO();
    }

    @Override
    public void deleteReview(Long id) throws Exception {
        reviewRepository.deleteById(id);
    }
}
