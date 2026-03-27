# 🚀 Job Portal Platform (Spring Boot & Next.js)

A modern, full-stack Job Portal Application engineered to streamline the hiring process with a robust **Spring Boot** micro-services backend and a highly interactive **Next.js** frontend. This platform leverages advanced **AI Capabilities** using **Spring AI**, **Google GenAI**, and **MongoDB Atlas Vector Search** to automate candidate screening, ensure fairness in hiring, detect fraudulent roles, and smartly match candidates to employers.

---

## ✨ Comprehensive Features & Implementation

### 1. 🏢 Employer Portal
- **Dashboard & Analytics:** Comprehensive overview of posted jobs, applicant statistics, and hiring metrics using `Recharts`.
- **Job Lifecycle Management:** Employers can create, edit, publish, and manage job listings with a rich text editor powered by `Tiptap`.
- **Applicant Tracking System (ATS):** View, filter (by status and match score), and manage job applications seamlessly.
- **Automated Workflow Notifications:** Changing a candidate's status (e.g., to "Interviewing" or "Rejected") automatically dispatches real-time web notifications and beautifully formatted emails via the **Resend API**.

### 2. 👩‍💻 Applicant Portal
- **Profile Generation Builder:** Applicants can build detailed professional profiles including their skills, experiences, and education.
- **Application Funnel Tracking:** Track the real-time status of active and past applications in a centralized dashboard.
- **Company Rating & Review System:** 
  - Applicants can post exactly ***one*** review per company.
  - Features real-time, inline edit and delete functionality for their own reviews within the `ReviewSection`.
  - Reviews are dynamically paginated (5 per page) with a smooth "View More" experience.
  - Job Cards intelligently aggregate these reviews, displaying an average colored Star Rating Badge natively derived from backend caching logic.

### 3. 🛡️ Subscription & Monetization (Stripe)
The platform enforces a scalable SaaS model:
- **Free Tier Restrictions:**
  - **Employers:** Strict limit of posting a maximum of 3 active jobs. Limited to only 5 AI Resume Scans per job.
  - **Applicants:** Strict limit of 10 maximum applications.
- **Pro & Pro Max Upgrades:** Bypasses limits seamlessly through the integrated **Stripe** payment gateway, prompting frontend dialogs identically matched with securely enforced backend checks.

### 4. 🔗 Security & Administration
- **Role-Based Access Control (RBAC):** Strict security boundaries enforced between `APPLICANT`, `EMPLOYER`, and `ADMIN` roles using Spring Security.
- **Stateless Authentication:** Fully robust JWT (JSON Web Tokens) verification system.
- **WhatsApp Triggers & Inngest:** Asynchronous event-driven webhook processing integrated natively to prompt external notifications.

---

## 🧠 Advanced AI Engineering Details

This project pushes beyond simple REST APIs by integrating state-of-the-art Generative AI and Retrieval-Augmented Generation (RAG) directly into its core logic sequence:

- **🤖 Semantic CV Parsing & Resume Matching (RAG):**
  Uses **Apache PDFBox** to extract text from Base64 uploaded PDFs, translating them into high-dimensional vector arrays using **Spring AI**. These vectors are indexed within a **MongoDB Atlas Vector Store** for rapid similarity lookups computing the *Cosine Similarity* mathematically between candidate and job descriptions.

- **📊 Granular Candidate Match Evaluation:**
  Generates an intelligent analysis executing a targeted **Google Gemini** prompt strictly mapped to numerical outputs. It contrasts explicit missing skills against matching skills to generate a reliable `matchScore` ranging from 0-100, combined with a stringified semantic explanation. Actionable rejections will list specifically which skills a candidate lacked right in their rejection email! 

- **⚖️ AI Fairness & Bias Output Check:**
  Ensures ethical hiring practices. A dedicated prompt evaluates the candidate solely based on skills and algorithmic vectors—ignoring demographics—to forcefully output a verifiable `fairnessScore` proving the AI generated an unbiased screening.

- **🚨 Fraud Job Detection Automation:**
  Scans all newly saved jobs through an intelligent AI classification pipeline. It identifies suspicious/fake companies, generic copy-pasted descriptions, too-good-to-be-true salaries, and known scam patterns, flagging them immediately with a localized `fraudScore` and labeling them HIGH/MEDIUM/LOW risk with generated explanations.

- **🎯 AI Predictive Job Recommendations:**
  Dynamically calculates the best jobs for a logged-in user through a combined heuristic:
  - **Content-Based Filtering (70%):** Vectorizing the applicant's title, about, experience, and skills against all active Job Embeddings.
  - **Collaborative Filtering (30%):** Finding users with similar application patterns, boosting roles that similar demographic peers applied for.
  - **Cold Start Fallback:** For brand new candidates, safely bypasses the embedding model mapping and dynamically sorts recommendations based strictly on the newest `postTime`, ensuring they never stare at an empty / random portal.

---

## 🛠️ Technology Stack Breakdown

### Backend (Server)
- **Core Framework:** Java 17, Spring Boot 3
- **Security:** Spring Security, JWT Interceptor Chains
- **AI Tooling:** Spring AI, Google Gemini Embeddings API 
- **Database Architecture:** MongoDB Atlas & Vector Store
- **Key Modules:** Apache PDFBox (Resume Parsing), Resend Java SDK (Transactional Emails)

### Frontend (Client)
- **Core Framework:** Next.js (App Router), React 19
- **Aesthetics & UI:** TailwindCSS, Base UI, Radix UI Primitives, Lucide Icons, Tabler Icons
- **State Management:** Redux Toolkit, Redux Persist, Server-side React Query
- **Internal Ecosystem:** React Hook Form, Zod Validation, Recharts, Tiptap, Axios

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+) & `npm` / `bun`
- Java 17 or higher
- Maven (`mvn`)
- MongoDB (Atlas cluster highly recommended for vector mapping)
- External API Keys: **Google Gemini API**, **Resend**, **Stripe**

### 1. Backend Setup (`/server`)

1. Change strictly into the server directory:
   ```bash
   cd server
   ```
2. Make sure you initialize your local properties configurations using your unique URI/Keys.
3. Build the application dependencies:
   ```bash
   mvn clean compile
   ```
4. Run the Spring Boot instance locally (`http://localhost:8080/`):
   ```bash
   mvn spring-boot:run
   ```

### 2. Frontend Setup (`/client`)

1. Change into the frontend directory:
   ```bash
   cd client
   ```
2. Install dependencies securely:
   ```bash
   npm install
   ```
3. Set your internal `NEXT_PUBLIC_API_URL` to route correctly to the Spring endpoint (`.env`).
4. Boot up the user interface (`http://localhost:3000`):
   ```bash
   npm run dev
   ```

---

## 📝 License & Contact
This project illustrates a mature understanding of microservices, advanced UI design, event asynchronous triggers, integrated SaaS monetization, and complex AI pipeline operations.
