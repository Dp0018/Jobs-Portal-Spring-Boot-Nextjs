package com.jobportal.service;

import com.resend.Resend;
import com.resend.core.exception.ResendException;
import com.resend.services.emails.model.CreateEmailOptions;
import com.resend.services.emails.model.CreateEmailResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class ResendEmailService {

    private final Resend resend;
    private final String fromEmail;

    public ResendEmailService(
            @Value("${resend.api.key}") String apiKey,
            @Value("${resend.from.email}") String fromEmail) {
        this.resend = new Resend(apiKey);
        this.fromEmail = fromEmail;
    }

    /**
     * Send an HTML email using Resend.
     *
     * @param to      recipient email address
     * @param subject email subject
     * @param html    HTML body content
     */
    public void sendEmail(String to, String subject, String html) throws ResendException {
        CreateEmailOptions options = CreateEmailOptions.builder()
                .from(fromEmail)
                .to(to)
                .subject(subject)
                .html(html)
                .build();

        CreateEmailResponse response = resend.emails().send(options);
        System.out.println("Resend email sent successfully. ID: " + response.getId());
    }
}

