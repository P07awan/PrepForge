import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import AIInterviewPage from './pages/AIInterviewPage';
import LiveInterviewPage from './pages/LiveInterviewPage';
import InterviewRoomPage from './pages/InterviewRoomPage';
import InterviewFeedbackPage from './pages/InterviewFeedbackPage';
import ResumeMakerPage from './pages/ResumeMakerPage';
import ResumeMatcherPage from './pages/ResumeMatcherPage';
import ProfilePage from './pages/ProfilePage';
import PaymentPage from './pages/PaymentPage';
import AdminPage from './pages/AdminPage';

function App() {
  const { isAuthenticated, user } = useAuthStore();

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected routes */}
      <Route
        path="/dashboard"
        element={
          isAuthenticated ? (
            <Layout>
              <DashboardPage />
            </Layout>
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route
        path="/ai-interview"
        element={
          isAuthenticated ? (
            <Layout>
              <AIInterviewPage />
            </Layout>
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route
        path="/live-interview"
        element={
          isAuthenticated ? (
            <Layout>
              <LiveInterviewPage />
            </Layout>
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route
        path="/interview-room/:id"
        element={
          isAuthenticated ? <InterviewRoomPage /> : <Navigate to="/login" />
        }
      />
      <Route
        path="/interview-feedback/:id"
        element={
          isAuthenticated ? (
            <Layout>
              <InterviewFeedbackPage />
            </Layout>
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route
        path="/resume-maker"
        element={
          isAuthenticated ? (
            <Layout>
              <ResumeMakerPage />
            </Layout>
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route
        path="/resume-matcher"
        element={
          isAuthenticated ? (
            <Layout>
              <ResumeMatcherPage />
            </Layout>
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route
        path="/profile"
        element={
          isAuthenticated ? (
            <Layout>
              <ProfilePage />
            </Layout>
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route
        path="/payment"
        element={
          isAuthenticated ? (
            <Layout>
              <PaymentPage />
            </Layout>
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route
        path="/admin"
        element={
          isAuthenticated && user?.role === 'ADMIN' ? (
            <Layout>
              <AdminPage />
            </Layout>
          ) : (
            <Navigate to="/dashboard" />
          )
        }
      />

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
