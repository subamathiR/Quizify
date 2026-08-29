import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Toast from './components/Toast';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import QuizzesPage from './pages/QuizzesPage';
import QuizDetailPage from './pages/QuizDetailPage';
import QuizTakingPage from './pages/QuizTakingPage';
import QuizResultPage from './pages/QuizResultPage';
import AnswerReviewPage from './pages/AnswerReviewPage';
import StudentDashboardPage from './pages/StudentDashboardPage';
import LeaderboardPage from './pages/LeaderboardPage';
import ProfilePage from './pages/ProfilePage';

// Admin Pages
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminQuizzesPage from './pages/AdminQuizzesPage';
import AdminUsersPage from './pages/AdminUsersPage';
import AdminCategoriesPage from './pages/AdminCategoriesPage';

// Global Styles
import './styles/global.css';
import './styles/components.css';

function AppContent() {
  const location = useLocation();
  const isDashboardOrQuiz = 
    location.pathname.startsWith('/dashboard') || 
    location.pathname.startsWith('/admin') || 
    location.pathname.startsWith('/quiz/') ||
    location.pathname.startsWith('/profile');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {!isDashboardOrQuiz && <Navbar />}
      <Toast />
      <div style={{ flex: 1 }}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/quizzes" element={<QuizzesPage />} />
          <Route path="/quizzes/:id" element={<QuizDetailPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />

          {/* Student Protected Routes */}
          <Route path="/quiz/:id/take" element={<ProtectedRoute><QuizTakingPage /></ProtectedRoute>} />
          <Route path="/result/:id" element={<ProtectedRoute><QuizResultPage /></ProtectedRoute>} />
          <Route path="/review/:id" element={<ProtectedRoute><AnswerReviewPage /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><StudentDashboardPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

          {/* Admin Protected Routes */}
          <Route path="/admin" element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />
          <Route path="/admin/quizzes" element={<AdminRoute><AdminQuizzesPage /></AdminRoute>} />
          <Route path="/admin/users" element={<AdminRoute><AdminUsersPage /></AdminRoute>} />
          <Route path="/admin/categories" element={<AdminRoute><AdminCategoriesPage /></AdminRoute>} />
        </Routes>
      </div>
      {!isDashboardOrQuiz && <Footer />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
