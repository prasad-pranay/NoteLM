import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore.js';
import Layout from './components/Layout.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import DocumentsPage from './pages/DocumentsPage.jsx';
import DocumentViewPage from './pages/DocumentViewPage.jsx';
import ChatPage from './pages/ChatPage.jsx';
import QuizGeneratorPage from './pages/QuizGeneratorPage.jsx';
import QuizzesPage from './pages/QuizzesPage.jsx';
import LiveQuizHost from './pages/LiveQuizHost.jsx';
import LiveQuizParticipant from './pages/LiveQuizParticipant.jsx';
import QuizAttemptPage from './pages/QuizAttemptPage.jsx';
import AnalyticsPage from './pages/AnalyticsPage.jsx';
import LandingPage from './pages/LandingPage.jsx';
import NoteBookPage from './pages/NoteBookPage.jsx';
import SolvePage from './pages/SolvePage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import { useEffect, useState } from 'react';
import SplashScreen from './Splash.jsx';

function ProtectedRoute({ children }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  console.log(isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [splash, setSplash] = useState(true)
  useEffect(() => {
    setTimeout(() => {
      setSplash(false)
    }, 0);
    // }, 4000);
  }, [])

  return (
    <>
      {splash ? <SplashScreen /> : <Routes>
        {
          !isAuthenticated && <>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="*" element={<LandingPage />} />
          </>
        }
        {isAuthenticated &&
          <Route path="/" element={<Layout />}>
            <Route index element={<DashboardPage />} />
            <Route path="notebook" element={<NoteBookPage />} />
            <Route path="solve" element={<SolvePage />} />
            <Route path="documents" element={<DocumentsPage />} />
            <Route path="documents/:id" element={<DocumentViewPage />} />
            <Route path="chat/:documentId" element={<ChatPage />} />
            <Route path="quiz/generate/:documentId?" element={<QuizGeneratorPage />} />
            <Route path="quizzes" element={<QuizzesPage />} />
            <Route path="quiz/:id/attempt" element={<QuizAttemptPage />} />
            <Route path="quiz/live/host/:joinCode" element={<LiveQuizHost />} />
            <Route path="quiz/live/join/:joinCode" element={<LiveQuizParticipant />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>
        }
      </Routes>}
    </>
  );
}
