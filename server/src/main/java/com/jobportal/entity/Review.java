package com.jobportal.entity;

import com.jobportal.dto.ReviewDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "reviews")
public class Review {
    @Id
    private Long id;
    private Long reviewerId;
    private String reviewerName;
    private Long companyId;
    private Integer rating;
    private String comment;
    private LocalDateTime createdAt;

    public ReviewDTO toDTO() {
        return new ReviewDTO(this.id, this.reviewerId, this.reviewerName, this.companyId, this.rating, this.comment, this.createdAt);
    }
}
