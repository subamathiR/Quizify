# 🎯 Quizify — Modern Online Quiz System

Quizify is a modern, responsive, full-stack online quiz platform designed to provide an engaging and interactive learning experience. It enables students to discover quizzes, test their knowledge, track performance, earn achievements, and compete on a global leaderboard. The platform also provides a comprehensive Admin Dashboard for managing quizzes, questions, categories, users, and quiz attempts.

---

## 🚀 Getting Started

### Prerequisites
* [Node.js](https://nodejs.org/) (v16 or higher)
* npm (Node Package Manager)

### Installation

1. Clone or extract the project files to your local directory.
2. In the root directory, run the following command to install all root orchestration dependencies:
   ```bash
   npm install
   ```
3. Install individual client and server dependencies:
   ```bash
   # Install server dependencies
   cd server && npm install
   
   # Install client dependencies
   cd ../client && npm install
   ```

### Running the Application

You can start both the client and server concurrently from the root directory:
```bash
cd ..
npm run dev
```

Alternatively, you can run the server and client separately in separate terminals:
* **Start Backend Server:** `npm run dev --prefix server` (Runs on `http://localhost:5000`)
* **Start Frontend Client:** `npm run dev --prefix client` (Runs on `http://localhost:5173` or similar Vite port)

---

## 🔑 Default Demo Accounts

The database comes pre-populated with default student and admin accounts when started. You can use these to test different user flows:

| Role | Email | Password | Description |
| :--- | :--- | :--- | :--- |
| 🛡️ **Admin** | `admin@quizify.com` | `admin123` | Full dashboard access to manage quizzes, categories, and users |
| 👨‍🎓 **Student** | `john@example.com` | `student123` | Access to student portal, history, and leaderboard |
| 👨‍🎓 **Student** | `sarah@example.com` | `student123` | Access to student portal, history, and leaderboard |

---

## ✨ Key Features

### 👨‍🎓 Student Portal

#### 📊 Interactive Dashboard
- Performance overview
- Quiz attempt statistics
- Accuracy tracking
- Category-wise performance
- Performance history using interactive charts

#### 🔎 Quiz Discovery
- Search quizzes
- Filter by category
- Filter by difficulty
- Sort quizzes
- Pagination support

#### 📝 Interactive Quiz Interface
- Real-time countdown timer
- Visual timer warnings
- Question navigation palette
- Answer selection
- Skip questions
- Clear selected answers
- Exit confirmation protection
- Automatic submission when time expires

#### 📈 Quiz Results
- Animated score display
- Pass/Fail status
- Correct and incorrect answer review
- Detailed answer explanations
- Performance summary

#### 🏆 Gamification
- First Steps
- Perfect Score
- Quiz Enthusiast
- Quiz Master
- Speed Solver
- Knowledge Champion

#### 👤 Profile Management
- Update profile information
- Update profile image/avatar
- Update tagline and personal details
- Manage account credentials

#### 🥇 Global Leaderboard
- Compare performance with other students
- Ranking based on quiz performance

---

### 🛡️ Admin Dashboard

#### 📊 System Overview
- Total users
- Total quizzes
- Total attempts
- Category statistics
- Platform activity

#### 📚 Quiz Management
- Create quizzes
- Edit quizzes
- Delete quizzes
- Configure quiz duration
- Configure passing score
- Set difficulty and category

#### ❓ Question Management
- Add questions
- Edit questions
- Delete questions
- Create four-option multiple-choice questions
- Select the correct answer
- Add detailed explanations

#### 🗂️ Category Management
- Create categories
- Update categories
- Organize quiz topics
- Add category descriptions
- Customize category colors

#### 👥 User Management
- View registered users
- Monitor user activity
- View quiz attempts

#### 📋 Attempt Monitoring
- View all quiz attempts
- Review individual results
- Monitor overall platform performance

---

## 📊 Dashboard Analytics

Quizify uses **Recharts** to provide interactive visual analytics, including:
- 📈 **Area Chart** — Performance History
- 🍩 **Donut Chart** — Overall Accuracy
- 🕸️ **Radar Chart** — Category Mastery
- 📊 **Quiz and Attempt Statistics**

---

## 🛠️ Tech Stack

### Frontend
- React 18
- Vite
- React Router DOM
- Canvas Confetti
- JavaScript (ES6+)
- HTML5 & CSS3
- CSS Variables
- Recharts
- Lucide React
- Framer Motion

### Backend
- Node.js
- Express.js
- JWT Authentication
- BcryptJS
- REST API

### Database
- MongoDB
- Mongoose
- MongoDB Memory Server (Fallback)

### Development
- dotenv
- Concurrently

---

## 🏗️ Project Architecture

```text
Quizify/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── layouts/
│   │   ├── services/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── assets/
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   ├── package.json
│   ├── seed.js
│   └── server.js
│
├── package.json
├── README.md
└── .gitignore
```

---

## ⚡ Zero-Configuration Database Fallback

Quizify supports an in-memory MongoDB fallback for development.

If a local MongoDB connection is unavailable (as defined by `MONGO_URI` in `.env`), the backend automatically starts a **MongoDB Memory Server** and populates it with sample data using `seed.js`.

This allows the application to run instantly without requiring a local MongoDB installation.

> ⚠️ **Note:** For production deployments, use a persistent MongoDB database URI.

---

## 🌐 API Documentation

### 🔐 Authentication

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| POST | `/api/auth/register` | Register a student account |
| POST | `/api/auth/login` | Authenticate a user and return JWT |
| GET | `/api/auth/me` | Get authenticated user details |

### 📚 Quizzes

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| GET | `/api/quizzes` | Public/User | Get quizzes with filtering and pagination |
| GET | `/api/quizzes/:id` | User | Get quiz details |
| POST | `/api/quizzes` | Admin | Create a quiz |
| PUT | `/api/quizzes/:id` | Admin | Update a quiz |
| DELETE | `/api/quizzes/:id` | Admin | Delete a quiz |
| POST | `/api/quizzes/:id/questions` | Admin | Add a question to a quiz |
| PUT | `/api/quizzes/:id/questions/:questionId` | Admin | Update a quiz question |
| DELETE | `/api/quizzes/:id/questions/:questionId` | Admin | Delete a quiz question |

#### Query Parameters (Quiz Discovery)
- `search`: Search quizzes by title or category
- `category`: Filter quizzes by category ID
- `difficulty`: Filter quizzes by difficulty level (`Easy`, `Medium`, `Hard`)
- `sort`: Sort results (`newest`, `oldest`, `popular`, `difficulty-asc`, `difficulty-desc`)
- `page`: Page number for pagination
- `limit`: Number of results per page

### 📝 Attempts

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| POST | `/api/attempts` | User | Submit a completed quiz attempt |
| GET | `/api/attempts/my` | User | Get current user's attempts history |
| GET | `/api/attempts/all` | Admin | Get all attempts across the platform |
| GET | `/api/attempts/:id` | User/Admin | Get detailed results of an attempt |

### 👤 Users

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| PUT | `/api/users/profile` | User | Update profile information |
| GET | `/api/users/dashboard` | User | Get student dashboard analytics |
| GET | `/api/users` | Admin | Get all registered users |

### 🏷️ Categories

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| GET | `/api/categories` | Public/User | Get all active categories |
| POST | `/api/categories` | Admin | Create a category |
| PUT | `/api/categories/:id` | Admin | Update a category |
| DELETE | `/api/categories/:id` | Admin | Delete a category |

### 📊 Admin Stats

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| GET | `/api/admin/stats` | Admin | Get overall platform statistics |

### 🏆 Leaderboard

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| GET | `/api/leaderboard` | User | Get global rankings based on score |

---

## 🔒 Authentication & Security

Quizify uses JWT-based authentication for secure access control.

### Security Features
- 🔐 JWT Authentication
- 🔑 Password Hashing with BcryptJS
- 🛡️ Role-Based Access Control
- 🚫 Protected Admin Routes
- 🔒 Environment-Based Secret Configuration
- 👤 Secure User Sessions

---

## 🎮 Gamification System

The platform awards badges based on performance criteria:

| Badge | Icon | Description | Criteria |
| :--- | :--- | :--- | :--- |
| 🟢 **First Steps** | `Rocket` | Complete your first quiz | Unlocked on 1st completed attempt |
| ⭐ **Perfect Score** | `Target` | Achieve a perfect score | Unlocked on a 100% quiz score |
| 🔥 **Quiz Enthusiast** | `BookOpen` | Complete multiple quizzes | Unlocked on 5 completed attempts |
| 👑 **Quiz Master** | `Trophy` | Demonstrate strong performance | Unlocked on 10 completed attempts |
| ⚡ **Speed Solver** | `Zap` | Complete quizzes efficiently | Score >= 80% with avg. < 15s per question |

---

## 📱 Responsive & UI/UX Highlights
- **Fully Responsive**: Optimized for desktop, laptop, tablet, and mobile displays.
- **Glassmorphism Theme**: Premium gradients, smooth shadow depths, and blur backdrops.
- **Micro-interactions**: Subtle hover scaling, interactive charts, and page transitions powered by Framer Motion.
- **Prevention Measures**: Safe exit prompts to protect users from losing progress during an active quiz.

---

## 📈 Future Enhancements
- 🤖 AI-Generated Quiz Questions
- 🎯 Personalized Quiz Recommendations
- 📧 Email Notifications
- 🌐 Multi-Language Support
- 📄 Certificate Generation
- 📊 Advanced Admin Analytics
- 🔔 Real-Time Notifications
- 🌙 Theme Customization
- 📥 Quiz Import/Export
- 🧠 AI-Powered Performance Insights
- 👨‍🏫 Teacher & Instructor Accounts
