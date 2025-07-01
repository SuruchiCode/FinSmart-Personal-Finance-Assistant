# FinSmart – Personal Finance Assistant

FinSmart is a full-stack web application that helps users manage their personal finances, track expenses, and plan savings. The app features user authentication, OTP email verification, and a modern, responsive UI.

##Features

- User registration, login, and secure session management
- Email-based OTP verification for added security
- Dashboard for tracking expenses and savings goals
- Add, edit, and delete expenses and savings entries
- Chat assistant (for Financial Queries)
- Responsive design with EJS and Tailwind CSS
- MongoDB Atlas for cloud data storage

## Tech Stack

- Node.js, Express.js
- MongoDB & Mongoose
- EJS templating
- Tailwind CSS
- Nodemailer (for email/OTP)
- JWT & session authentication

## Getting Started

### Prerequisites

- Node.js & npm
- MongoDB Atlas account (or local MongoDB)
- Gmail account for sending OTP emails

### Installation

1. **Clone the repository:**
   ```
   git clone https://github.com/SuruchiCode/FinSmart-Personal-Finance-Assistant.git
   cd FinSmart-Personal-Finance-Assistant
   ```

2. **Install dependencies:**
   ```
   npm install
   ```

3. **Configure environment variables:**
   - Create a `.env` file in the root directory.
   - Add the following (replace with your own values):

     ```
     PORT=3000
     MONGO_URI=your-mongodb-uri
     SESSION_SECRET=your-session-secret
     JWT_SECRET=your-jwt-secret
     JWT_EXPIRES_IN=7d

     EMAIL_HOST=smtp.gmail.com
     EMAIL_PORT=587
     EMAIL_USER=your-email@gmail.com
     EMAIL_PASS=your-app-password
     EMAIL_FROM=FinSmart <your-email@gmail.com>
     ```

   - **Note:** For Gmail, use an [App Password](https://support.google.com/accounts/answer/185833) if 2FA is enabled.

4. **Run the app locally:**
   ```
   npm run dev
   ```
   Visit [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

You can deploy this app to [Render](https://render.com), Heroku, or any Node.js-friendly cloud platform.

- Push your code to GitHub.
- Create a new Web Service on Render, connect your repo, and add your environment variables.
- Set the build command to `npm install` and the start command to `npm start`.

## License

This project is for educational purposes.

---

**Contributors:**  
- Suruchi Kumari ([SuruchiCode](https://github.com/SuruchiCode))
