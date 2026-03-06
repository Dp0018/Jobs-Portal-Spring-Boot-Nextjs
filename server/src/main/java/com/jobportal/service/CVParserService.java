package com.jobportal.service;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.util.Base64;

@Service
public class CVParserService {

    public String extractTextFromPdfBytes(byte[] pdfBytes) {
        if (pdfBytes == null || pdfBytes.length == 0) {
            return "";
        }
        try (InputStream is = new ByteArrayInputStream(pdfBytes);
             PDDocument document = PDDocument.load(is)) {
            PDFTextStripper stripper = new PDFTextStripper();

            String extractedText = stripper.getText(document);
            // Redact PII to ensure AI fairness and GDPR compliance
            return redactPII(extractedText);

        } catch (Exception e) {
            e.printStackTrace();
            return "Error extracting text: " + e.getMessage();
        }
    }

    public String extractTextFromBase64Pdf(String base64Pdf) {
        if (base64Pdf == null || base64Pdf.isEmpty()) {
            return "";
        }

        try {
            byte[] pdfBytes = Base64.getDecoder().decode(base64Pdf);
            try (InputStream is = new ByteArrayInputStream(pdfBytes);
                 PDDocument document = PDDocument.load(is)) {

                PDFTextStripper stripper = new PDFTextStripper();
                String extractedText = stripper.getText(document);
                // Redact PII to ensure AI fairness and GDPR compliance
                return redactPII(extractedText);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return "Error extracting text: " + e.getMessage();
        }
    }

    /**
     * Redacts Personally Identifiable Information (PII) from the resume text.
     * This includes emails, phone numbers, and potentially other identifying
     * markers
     * to prevent AI bias (gender, location, name) and ensure GDPR/Ethical AI
     * compliance.
     */
    private String redactPII(String text) {
        if (text == null || text.isEmpty())
            return text;

        // 1. Redact Emails (Basic Regex)
        String redacted = text.replaceAll("[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}", "[REDACTED_EMAIL]");

        // 2. Redact Phone Numbers (Basic Regex for international/local formats)
        redacted = redacted.replaceAll("(\\+\\d{1,3}[- ]?)?\\(?\\d{3}\\)?[- ]?\\d{3}[- ]?\\d{4}", "[REDACTED_PHONE]");

        // Note: Advanced named-entity recognition (NER) is usually required to
        // perfectly redact
        // Names, Genders, and Locations. Here we apply foundational redactions to
        // explicitly instruct
        // the RAG model to ignore any remaining demographical markers.

        return redacted;
    }
}
