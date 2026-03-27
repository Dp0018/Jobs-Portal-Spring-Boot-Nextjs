package com.jobportal.repository;

import com.jobportal.entity.Review;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ReviewRepository extends MongoRepository<Review, Long> {
    List<Review> findByCompanyId(Long companyId);
}
