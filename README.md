Project: MoreMoney
Goal: A Next.js-based website to display stock prices, allow user authentication, and manage stock accounts.

Tech Stack Overview
Frontend (Client)
Framework: Next.js (React-based, SSR & CSR supported)
UI: Custom styling with Tailwind CSS
Authentication: Using a SessionProvider (potentially with NextAuth.js in the future)
State Management: Handled via React hooks and context providers
Routing: Next.js app router (page.tsx for main pages)
Components:
Header.tsx (User profile in the top right corner)
Sidebar.tsx (Navigation for logged-in users)
Footer (Includes Impressum link)
User Pages Implemented:
Home Page (Lists stock prices)
Login & Signup Pages (User authentication flow)
Stock Portfolio Overview (Users can manage their stocks)
Impressum Page (For legal info)
Backend (Server & Database)
Server Hosting: Docker on a Windows Server
Database: PostgreSQL (Enterprise DB hosted in GCP)
Tables Implemented:
User (For authentication)
stock_prices (Stores symbols, prices, timestamps)
(Planned) A table to link users to their selected stocks
API Backend (Planned/External)
The backend developer will likely implement a REST or GraphQL API to handle stock price updates and user data.
Communication between Next.js frontend and the backend API (e.g., via fetch, Axios, or RTK Query).
DevOps & Deployment
Version Control: GitHub (moremoneygui repo)
CI/CD: GitHub Actions for CodeQL security scanning
Hosting: Vercel (for Next.js frontend)
Containerization: Docker (for backend & potentially database)
Additional Technologies
Kafka (Planned): For real-time data streaming and communication
OpenSearch / Spark (Planned): For analytics & visualization
Apache Airflow (Planned): For data pipeline automation
