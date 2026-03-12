# 🚀 Job Portal Platform (Spring Boot & Next.js)

A modern, full-stack Job Portal Application built with a robust **Spring Boot** micro-services backend and a highly interactive **Next.js** frontend. This platform features advanced **AI capabilities** leveraging **Spring AI**, **Google GenAI**, and **MongoDB Atlas Vector Search** to automate resume screening, ensure fair hiring, and detect fraudulent job postings.

---

## ✨ Core Features

### 🏢 Employer Portal
- **Dashboard & Analytics:** Comprehensive overview of posted jobs, applicant statistics, and hiring metrics using Recharts.
- **AI Accuracy Dashboard:** Specialized AI insights and analytics for tracking candidate match scores, fairness compliance, and skill gaps across all jobs.
- **Job Management:** Create, edit, publish, and manage job listings with a rich text editor (Tiptap).
- **Applicant Tracking System (ATS):** View, filter, and manage job applications seamlessly.
- **AI-Powered Candidate Matching:** Instantly find the most suitable candidates for a job using semantic vector search.

### 👩‍💻 Applicant Portal
- **Profile Builder:** Create detailed professional profiles, including skills, experience, and education.
- **CV Parsing:** Automated resume data extraction from uploaded PDFs using Apache PDFBox.
- **AI Job Recommendations:** Get personalized, AI-driven job suggestions tailored to your profile skills and experience.
- **Job Discovery & Application:** Search, filter, and apply for jobs seamlessly.
- **Application History:** Track the status of active and past applications in real-time.

### 🛡️ Admin & Security
- **Role-Based Access Control (RBAC):** Secure access segregation for Applicants, Employers, and Administrators.
- **JWT Authentication:** Stateless and secure authentication mechanism via Spring Security.
- **Platform Analytics:** Global view of platform health, user engagement, and job posting metrics.
- **Fraud Monitoring:** Specialized admin dashboard to review and moderate AI-flagged suspicious job listings.

---

## 🧠 Advanced AI Capabilities

This project integrates state-of-the-art Generative AI and Retrieval-Augmented Generation (RAG) directly into the hiring workflow:

- **🤖 Semantic Resume Matching (RAG):**
  Uses **Spring AI** and **MongoDB Atlas Vector Store** to generate high-dimensional embeddings of candidate resumes. It performs semantic vector searches to rank candidates based on true contextual fit rather than simple keyword matching.

- **📊 Comprehensive Applicant Evaluation:**
  Generates an intelligent analysis of a candidate's resume against a specific job description. Powered by **Google GenAI (Gemini)**, it extracts both missing and matching skills, generating a transparent `matchScore` and a detailed textual explanation of the candidate's suitability.

- **⚖️ AI Fairness & Bias Checking:**
  Ensures ethical hiring practices. A dedicated AI evaluation layer analyzes the candidate strictly on skills and experience—ignoring demographic identifiers—to explicitly output a `fairnessScore` and guarantee GDPR-compliant, unbiased screening.

- **🚨 AI-Driven Fraud Job Detection:**
  Automatically scans every newly posted job description using a specialized classification prompt. It detect red flags such as unrealistic salaries, generic/copied descriptions, scam patterns (e.g., upfront payment requests), and suspicious company names, generating a `fraudScore` and `fraudRisk` level for Admin review.

---

## 🛠️ Technology Stack

### Backend (Server)
- **Framework:** Java 17, Spring Boot 3
- **Security:** Spring Security, JWT (JSON Web Tokens)
- **AI & RAG:** Spring AI, Google GenAI (Gemini Models & Embeddings)
- **Database:** MongoDB, MongoDB Atlas Vector Store
- **Utilities:** Apache PDFBox (Resume Parsing), Resend Java SDK (Transactional Emails), Lombok
- **Architecture:** Monolithic / Modular Multi-tenant design

### Frontend (Client)
- **Framework:** Next.js (App Router), React 19
- **Styling:** TailwindCSS, Base UI, Radix UI Primitives, Lucide Icons, Tabler Icons
- **State Management:** Redux Toolkit, Server-side React Query state
- **Form Handling:** React Hook Form, Zod Validation
- **Editor:** Tiptap (Rich Text Editing)
- **Data Visualization:** Recharts
- **Formatting:** Date-fns

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended) & npm / bun
- [Java 17](https://jdk.java.net/17/) or higher
- [Maven](https://maven.apache.org/)
- [MongoDB](https://www.mongodb.com/) (Local or Atlas with Vector Search enabled)
- Accounts/API Keys for: **Google Gemini API**, **Resend**, and **MongoDB Atlas**

### 1. Backend Setup (`/server`)

1. Navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Configure your environment variables. Create an `application.properties` or `.env` equivalent supplying:
   - MongoDB connection URI
   - Google GenAI API Key
   - Resend API Key
   - JWT Secret Key
3. Build and run the Spring Boot application:
   ```bash
   ./mvnw clean install
   ./mvnw spring-boot:run
   ```
   *The backend will typically start on `http://localhost:8080`.*

### 2. Frontend Setup (`/client`)

1. Navigate to the `client` directory:
   ```bash
   cd client
   ```
2. Install dependencies (using your preferred package manager):
   ```bash
   npm install
   # or
   bun install
   ```
3. Set up environment variables. Create a `.env` file in the `client` root:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8080/api
   ```
4. Start the development server:
   ```bash
   npm run dev
   # or
   bun dev
   ```
   *The frontend will run on `http://localhost:3000`.*

---

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

## 📝 License
This project is proprietary or licensed under [Your License Choice].
