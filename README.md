# MoreMoney

MoreMoney is a web application built with Next.js to track stock prices and manage user portfolios. The project integrates authentication, a PostgreSQL database, and is hosted using Docker on a Windows server.

## Tech Stack

### **Frontend**

- **Framework:** Next.js (React-based, supports SSR & CSR)
- **Styling:** Tailwind CSS
- **Authentication:** Session-based authentication (potentially NextAuth.js)
- **State Management:** React hooks & context providers
- **Routing:** Next.js app router (`page.tsx` for main pages)
- **UI Components:**
  - `Header.tsx`: Displays user profile in the top right corner
  - `Sidebar.tsx`: Navigation menu for logged-in users
  - `Footer.tsx`: Includes an Impressum link

### **Backend & Database**

- **Server Hosting:** Docker on a Windows Server
- **Database:** PostgreSQL (Enterprise DB hosted on GCP)
- **Tables Implemented:**
  - `User`: Stores user authentication data
  - `stock_prices`: Contains stock symbols, prices, and timestamps
  - (Planned) User-stock relationship table
- **API Backend (Planned):**
  - The backend developer will provide REST or GraphQL APIs for stock price updates and user data management.
  - Communication via `fetch` or `Axios` in the frontend.

### **DevOps & Deployment**

- **Version Control:** GitHub (`moremoneygui` repository)
- **CI/CD:** GitHub Actions with CodeQL for security scanning
- **Hosting:** Vercel (for Next.js frontend)
- **Containerization:** Docker (for backend & database management)

### **Future Plans**

- **Kafka:** For real-time data streaming
- **OpenSearch / Spark:** For analytics and visualization
- **Apache Airflow:** For automated data pipelines

## Getting Started

### Prerequisites

- Node.js & npm
- PostgreSQL database
- Docker (for containerized deployment)

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/Tobias-Bla/moremoneygui.git
   cd moremoneygui
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the development server:
   ```sh
   npm run dev
   ```
4. Open the app in your browser at `http://localhost:3000`

### Environment Variables

Ensure you have the following environment variables set up:

```
DATABASE_URL=your_postgresql_connection_string
NEXTAUTH_SECRET=your_secret_key
```

## Contributing

Feel free to submit issues or pull requests to improve the project.

## License

This project is licensed under the MIT License.

