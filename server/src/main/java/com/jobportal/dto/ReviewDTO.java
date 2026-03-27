package com.jobportal.dto;

import com.jobportal.entity.Review;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReviewDTO {
    private Long id;

    @NotNull(message = "Reviewer ID is required")
    private Long reviewerId;

    private String reviewerName;

    @NotNull(message = "Company ID is required")
    private Long companyId;

    @NotNull(message = "Rating is required")
    @Min(value = 1, message = "Rating must be between 1 and 5")
    @Max(value = 5, message = "Rating must be between 1 and 5")
    private Integer rating;

    @NotBlank(message = "Comment cannot be empty")
    private String comment;

    private LocalDateTime createdAt;

    public Review toEntity() {
        return new Review(this.id, this.reviewerId, this.reviewerName, this.companyId, this.rating, this.comment, this.createdAt == null ? LocalDateTime.now() : this.createdAt);
    }
}
