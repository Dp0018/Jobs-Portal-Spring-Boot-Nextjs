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
            return stripper.getText(document);
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
                return stripper.getText(document);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return "Error extracting text: " + e.getMessage();
        }
    }
}
