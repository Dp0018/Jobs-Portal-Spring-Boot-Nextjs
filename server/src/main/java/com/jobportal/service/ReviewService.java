package com.jobportal.service;

import com.jobportal.dto.ReviewDTO;
import java.util.List;

public interface ReviewService {
    ReviewDTO addReview(ReviewDTO reviewDTO) throws Exception;
    ReviewDTO updateReview(ReviewDTO reviewDTO) throws Exception;
    void deleteReview(Long id) throws Exception;
    List<ReviewDTO> getReviewsByCompanyId(Long companyId) throws Exception;
}
