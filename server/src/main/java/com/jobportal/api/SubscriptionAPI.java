package com.jobportal.api;

import com.jobportal.service.SubscriptionService;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.model.Event;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@CrossOrigin
@RequestMapping("/subscriptions")
public class SubscriptionAPI {

    @Autowired
    private SubscriptionService subscriptionService;

    @Value("${stripe.webhook.secret:whsec_test}")
    private String endpointSecret;

    @PostMapping("/checkout")
    public ResponseEntity<Map<String, String>> createCheckoutSession(@RequestBody Map<String, String> payload) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String email = auth.getName();

            String priceId = payload.get("priceId");
            String successUrl = payload.get("successUrl");
            String cancelUrl = payload.get("cancelUrl");

            if (priceId == null || successUrl == null || cancelUrl == null) {
                return new ResponseEntity<>(Map.of("error", "Missing required parameters: priceId, successUrl, cancelUrl"), HttpStatus.BAD_REQUEST);
            }

            String url = subscriptionService.createCheckoutSession(email, priceId, successUrl, cancelUrl);
            return new ResponseEntity<>(Map.of("url", url), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(Map.of("error", e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/webhook")
    public ResponseEntity<String> handleStripeWebhook(@RequestBody String payload, @RequestHeader(value = "Stripe-Signature", required = false) String sigHeader) {
        Event event;
        try {
            if("whsec_test".equals(endpointSecret) || sigHeader == null) {
                 event = com.stripe.model.Event.GSON.fromJson(payload, com.stripe.model.Event.class);
            } else {
                 event = Webhook.constructEvent(payload, sigHeader, endpointSecret);
            }
        } catch (SignatureVerificationException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid signature");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid payload");
        }

        if ("checkout.session.completed".equals(event.getType())) {
            Session session = (Session) event.getDataObjectDeserializer().getObject().orElse(null);
            if (session != null) {
                subscriptionService.handleCheckoutSessionCompleted(session);
            }
        }

        return new ResponseEntity<>("Success", HttpStatus.OK);
    }

    @PostMapping("/verify")
    public ResponseEntity<String> verifySession(@RequestBody Map<String, String> payload) {
        try {
            String sessionId = payload.get("sessionId");
            if (sessionId == null) {
                return new ResponseEntity<>("Missing sessionId", HttpStatus.BAD_REQUEST);
            }
            subscriptionService.verifySession(sessionId);
            return new ResponseEntity<>("Success", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
