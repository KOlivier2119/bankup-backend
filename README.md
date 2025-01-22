# Bankup - Microloan App Backend

**Bankup** is a microloan platform designed to simplify access to microloans in Rwanda. This backend service is built using Node.js, Express, TypeScript, and PostgreSQL.

## Core Features
- **User Authentication**: Secure user registration and login with JWT.
- **Loan Management**: Apply for and manage loans.
- **Loan Calculator**: Calculate interest and repayment schedules.
- **User Profiles**: Update and retrieve user information.

## Tech Stack
- **Node.js**
- **Express.js**
- **TypeScript**
- **PostgreSQL** for data storage

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/INNOVLYFE/Back-end-BankUp.git
   ```
2. Navigate to the project directory:
   ```bash
   cd bankup-backend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Set up a `.env` file with:
   ```plaintext
   PORT=5000
   DATABASE_URL=your-database-url
   JWT_SECRET=your-secret-key
   ```
5. Start the server:
   ```bash
   npm run dev
   ```
