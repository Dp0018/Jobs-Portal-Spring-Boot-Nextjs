package com.jobportal.service;

import com.jobportal.entity.User;
import com.jobportal.repository.UserRepository;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.util.Optional;

@Service
public class SubscriptionService {

    @Value("${stripe.api.secretKey}")
    private String stripeSecretKey;

    @Autowired
    private UserRepository userRepository;

    @PostConstruct
    public void init() {
        Stripe.apiKey = stripeSecretKey;
    }

    public com.stripe.model.Balance getStripeBalance() throws StripeException {
        return com.stripe.model.Balance.retrieve();
    }

    public String createCheckoutSession(String email, String priceId, String successUrl, String cancelUrl) throws StripeException {
        SessionCreateParams params = SessionCreateParams.builder()
                .setMode(SessionCreateParams.Mode.SUBSCRIPTION)
                .setCustomerEmail(email)
                .setSuccessUrl(successUrl + "?session_id={CHECKOUT_SESSION_ID}")
                .setCancelUrl(cancelUrl)
                .addLineItem(
                        SessionCreateParams.LineItem.builder()
                                .setQuantity(1L)
                                .setPrice(priceId)
                                .build()
                )
                .build();

        Session session = Session.create(params);
        return session.getUrl();
    }

    public void handleCheckoutSessionCompleted(Session session) {
        String customerEmail = session.getCustomerDetails() != null ? session.getCustomerDetails().getEmail() : session.getCustomerEmail();
        String customerId = session.getCustomer();
        String subscriptionId = session.getSubscription();

        if (customerEmail != null) {
            Optional<User> userOpt = userRepository.findByEmail(customerEmail);
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                user.setSubscriptionPlan("PREMIUM");
                user.setStripeCustomerId(customerId);
                user.setStripeSubscriptionId(subscriptionId);
                userRepository.save(user);
            }
        }
    }

    public void verifySession(String sessionId) throws StripeException {
        Session session = Session.retrieve(sessionId);
        if ("paid".equals(session.getPaymentStatus()) || "complete".equals(session.getStatus())) {
            handleCheckoutSessionCompleted(session);
        }
    }
}
