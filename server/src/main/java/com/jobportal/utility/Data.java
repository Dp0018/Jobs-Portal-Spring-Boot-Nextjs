package com.jobportal.utility;

public class Data {

    public static String getMessageBody(String name, String otp) {
        return """
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <title>Joblify – Verify Your Email</title>
                    <style>
                        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

                        * { margin: 0; padding: 0; box-sizing: border-box; }

                        body {
                            background-color: #f5f4ee;
                            font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
                            -webkit-font-smoothing: antialiased;
                        }

                        .wrapper {
                            width: 100%%;
                            padding: 40px 16px;
                            background-color: #f5f4ee;
                        }

                        .container {
                            max-width: 520px;
                            margin: 0 auto;
                            background-color: #ffffff;
                            border-radius: 16px;
                            overflow: hidden;
                            box-shadow: 0 4px 24px rgba(0,0,0,0.08);
                            border: 1px solid #e8e7e2;
                        }

                        /* ── Header ── */
                        .header {
                            background: linear-gradient(135deg, #c96442 0%%, #d9775a 100%%);
                            padding: 36px 40px 32px;
                            text-align: center;
                            position: relative;
                            overflow: hidden;
                        }

                        .header::before {
                            content: '';
                            position: absolute;
                            top: -40px; right: -40px;
                            width: 160px; height: 160px;
                            background: rgba(255,255,255,0.08);
                            border-radius: 50%%;
                        }

                        .header::after {
                            content: '';
                            position: absolute;
                            bottom: -30px; left: -30px;
                            width: 120px; height: 120px;
                            background: rgba(0,0,0,0.06);
                            border-radius: 50%%;
                        }

                        .logo-row {
                            display: inline-flex;
                            align-items: center;
                            gap: 10px;
                            margin-bottom: 4px;
                            position: relative;
                            z-index: 1;
                        }

                        .logo-icon {
                            width: 36px;
                            height: 36px;
                            background: rgba(255,255,255,0.2);
                            border-radius: 10px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                        }

                        .logo-text {
                            font-size: 24px;
                            font-weight: 700;
                            color: #ffffff;
                            letter-spacing: -0.5px;
                        }

                        .header-tagline {
                            font-size: 13px;
                            color: rgba(255,255,255,0.80);
                            position: relative;
                            z-index: 1;
                            margin-top: 6px;
                        }

                        /* ── Body ── */
                        .body {
                            padding: 40px 40px 32px;
                        }

                        .greeting {
                            font-size: 22px;
                            font-weight: 700;
                            color: #1a1a18;
                            margin-bottom: 12px;
                            letter-spacing: -0.3px;
                        }

                        .intro {
                            font-size: 15px;
                            color: #6b6a63;
                            line-height: 1.65;
                            margin-bottom: 32px;
                        }

                        /* ── OTP Box ── */
                        .otp-section {
                            background: linear-gradient(135deg, #fdf5f2 0%%, #fef9f7 100%%);
                            border: 1.5px solid #f0cfc4;
                            border-radius: 12px;
                            padding: 28px 24px;
                            text-align: center;
                            margin-bottom: 28px;
                            position: relative;
                        }

                        .otp-label {
                            font-size: 12px;
                            font-weight: 600;
                            color: #c96442;
                            text-transform: uppercase;
                            letter-spacing: 1.2px;
                            margin-bottom: 14px;
                        }

                        .otp-code {
                            font-size: 44px;
                            font-weight: 700;
                            color: #1a1a18;
                            letter-spacing: 10px;
                            font-family: ui-monospace, 'Courier New', monospace;
                            line-height: 1;
                            margin-bottom: 16px;
                        }

                        .otp-validity {
                            display: inline-flex;
                            align-items: center;
                            gap: 6px;
                            background: rgba(201,100,66,0.10);
                            border-radius: 20px;
                            padding: 5px 14px;
                            font-size: 12px;
                            font-weight: 500;
                            color: #c96442;
                        }

                        .otp-validity::before {
                            content: '⏱';
                            font-size: 13px;
                        }

                        /* ── Warning Note ── */
                        .note {
                            background-color: #f9f8f5;
                            border-left: 3px solid #c96442;
                            border-radius: 0 8px 8px 0;
                            padding: 14px 16px;
                            margin-bottom: 28px;
                        }

                        .note p {
                            font-size: 13px;
                            color: #6b6a63;
                            line-height: 1.6;
                        }

                        .note strong {
                            color: #3d3929;
                        }

                        /* ── CTA Button ── */
                        .cta-row {
                            text-align: center;
                            margin-bottom: 32px;
                        }

                        .cta-btn {
                            display: inline-block;
                            background: linear-gradient(135deg, #c96442 0%%, #d9775a 100%%);
                            color: #ffffff !important;
                            text-decoration: none;
                            font-size: 15px;
                            font-weight: 600;
                            padding: 14px 36px;
                            border-radius: 10px;
                            letter-spacing: 0.2px;
                        }

                        /* ── Divider ── */
                        .divider {
                            border: none;
                            border-top: 1px solid #ebe9e3;
                            margin: 0 0 24px;
                        }

                        /* ── Steps ── */
                        .steps-title {
                            font-size: 13px;
                            font-weight: 600;
                            color: #3d3929;
                            margin-bottom: 14px;
                        }

                        .steps {
                            list-style: none;
                            display: flex;
                            flex-direction: column;
                            gap: 10px;
                            margin-bottom: 32px;
                        }

                        .step {
                            display: flex;
                            align-items: flex-start;
                            gap: 12px;
                        }

                        .step-num {
                            width: 22px;
                            height: 22px;
                            background: #c96442;
                            color: #ffffff;
                            border-radius: 50%%;
                            font-size: 11px;
                            font-weight: 700;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            flex-shrink: 0;
                            margin-top: 1px;
                        }

                        .step-text {
                            font-size: 13px;
                            color: #6b6a63;
                            line-height: 1.55;
                        }

                        /* ── Footer ── */
                        .footer {
                            background-color: #f9f8f5;
                            border-top: 1px solid #ebe9e3;
                            padding: 24px 40px;
                            text-align: center;
                        }

                        .footer-links {
                            margin-bottom: 12px;
                        }

                        .footer-links a {
                            font-size: 12px;
                            color: #c96442;
                            text-decoration: none;
                            margin: 0 10px;
                        }

                        .footer-copy {
                            font-size: 11px;
                            color: #9b9a94;
                            line-height: 1.6;
                        }

                        /* ── Responsive ── */
                        @media (max-width: 540px) {
                            .body { padding: 28px 24px 24px; }
                            .footer { padding: 20px 24px; }
                            .otp-code { font-size: 34px; letter-spacing: 7px; }
                            .header { padding: 28px 24px; }
                        }
                    </style>
                </head>
                <body>
                    <div class="wrapper">
                        <div class="container">

                            <!-- Header -->
                            <div class="header">
                                <div class="logo-row">
                                    <div class="logo-icon">
                                        <!-- Briefcase SVG icon -->
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                                            <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                                            <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
                                            <line x1="12" y1="12" x2="12" y2="12"/>
                                            <path d="M2 12h20"/>
                                        </svg>
                                    </div>
                                    <span class="logo-text">Joblify</span>
                                </div>
                                <p class="header-tagline">Your career journey starts here</p>
                            </div>

                            <!-- Body -->
                            <div class="body">
                                <h1 class="greeting">Hi, %s 👋</h1>
                                <p class="intro">
                                    We received a request to reset the password for your Joblify account.
                                    Use the verification code below to proceed. If you didn't request this,
                                    you can safely ignore this email.
                                </p>

                                <!-- OTP Box -->
                                <div class="otp-section">
                                    <p class="otp-label">Your Verification Code</p>
                                    <div class="otp-code">%s</div>
                                    <span class="otp-validity">Valid for 10 minutes</span>
                                </div>

                                <!-- Warning -->
                                <div class="note">
                                    <p>
                                        <strong>Never share this code</strong> with anyone — including Joblify support.
                                        Our team will never ask for your OTP via phone, email, or chat.
                                    </p>
                                </div>

                                <!-- CTA -->
                                <div class="cta-row">
                                    <a href="https://joblify.com/login" class="cta-btn">
                                        Go to Joblify →
                                    </a>
                                </div>

                                <hr class="divider" />

                                <!-- Steps -->
                                <p class="steps-title">How to reset your password:</p>
                                <ul class="steps">
                                    <li class="step">
                                        <span class="step-num">1</span>
                                        <span class="step-text">Enter the 6-digit code shown above in the verification field.</span>
                                    </li>
                                    <li class="step">
                                        <span class="step-num">2</span>
                                        <span class="step-text">Create a strong new password with at least 8 characters.</span>
                                    </li>
                                    <li class="step">
                                        <span class="step-num">3</span>
                                        <span class="step-text">Sign in and continue finding your dream career!</span>
                                    </li>
                                </ul>
                            </div>

                            <!-- Footer -->
                            <div class="footer">
                                <div class="footer-links">
                                    <a href="https://joblify.com">Home</a>
                                    <a href="https://joblify.com/privacy">Privacy Policy</a>
                                    <a href="https://joblify.com/support">Support</a>
                                </div>
                                <p class="footer-copy">
                                    © 2025 Joblify. All rights reserved.<br />
                                    You received this email because a password reset was requested for your account.
                                </p>
                            </div>

                        </div>
                    </div>
                </body>
                </html>
                """.formatted(name, otp);
    }
}