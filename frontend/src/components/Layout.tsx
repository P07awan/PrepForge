import { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Home, BrainCircuit, Video, User, LogOut, BarChart3 } from 'lucide-react';
import Chatbot from './Chatbot';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <BrainCircuit className="w-8 h-8 text-primary-600" />
              <span className="text-xl font-bold text-gray-900">PrepForge</span>
            </Link>

            <nav className="hidden md:flex space-x-8">
              <Link
                to="/dashboard"
                className="flex items-center space-x-1 text-gray-700 hover:text-primary-600"
              >
                <Home className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>
              <Link
                to="/ai-interview"
                className="flex items-center space-x-1 text-gray-700 hover:text-primary-600"
              >
                <BrainCircuit className="w-4 h-4" />
                <span>AI Interview</span>
              </Link>
              {/* Role-based navigation - Candidates schedule, Interviewers receive requests */}
              {user?.role === 'INTERVIEWER' ? (
                <Link
                  to="/live-interview"
                  className="flex items-center space-x-1 text-gray-700 hover:text-primary-600"
                >
                  <Video className="w-4 h-4" />
                  <span>Interview Requests</span>
                </Link>
              ) : (
                <Link
                  to="/live-interview"
                  className="flex items-center space-x-1 text-gray-700 hover:text-primary-600"
                >
                  <Video className="w-4 h-4" />
                  <span>Schedule Interview</span>
                </Link>
              )}
              {user?.role === 'ADMIN' && (
                <Link
                  to="/admin"
                  className="flex items-center space-x-1 text-gray-700 hover:text-primary-600"
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Admin</span>
                </Link>
              )}
            </nav>

            <div className="flex items-center space-x-4">
              <Link
                to="/profile"
                className="flex items-center space-x-2 text-gray-700 hover:text-primary-600"
              >
                <User className="w-5 h-5" />
                <span className="hidden md:inline">
                  {user?.firstName} {user?.lastName}
                </span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 text-gray-700 hover:text-red-600"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden md:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>

      {/* Chatbot - Only for Candidates */}
      {user?.role === 'CANDIDATE' && <Chatbot />}

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-600 text-sm">
            © 2025 PrepForge. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
