import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { 
  Calendar, 
  TrendingUp, 
  Clock, 
  User, 
  CheckCircle,
  UserCheck
} from 'lucide-react';
import api from '../services/api';

interface InterviewData {
  id: string;
  topic: string;
  interviewType: string;
  scheduledAt: string;
  duration: number;
  status: string;
  roomId: string;
  candidate?: {
    firstName: string;
    lastName: string;
    email: string;
    profileImage?: string;
  };
  interviewer?: {
    firstName: string;
    lastName: string;
    email: string;
    profileImage?: string;
  };
}

interface DashboardData {
  candidate: {
    upcoming: InterviewData[];
    today: InterviewData[];
    total: number;
    completed: number;
  };
  interviewer: {
    upcoming: InterviewData[];
    today: InterviewData[];
    pendingRequests: InterviewData[]; // Add pending requests
    total: number;
    completed: number;
    averageRating: number;
  };
  stats: {
    totalUpcoming: number;
    totalCompleted: number;
    pendingRequests: number;
    todayTotal: number;
  };
}

export default function DashboardPage() {
  const { user } = useAuthStore();
  // Show only the view for user's role (no toggle)
  const viewMode = user?.role === 'INTERVIEWER' ? 'interviewer' : 'candidate';
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  // Debug logging
  useEffect(() => {
    console.log('=== DASHBOARD DEBUG ===');
    console.log('User object:', user);
    console.log('User email:', user?.email);
    console.log('User role:', user?.role);
    console.log('ViewMode:', viewMode);
    console.log('Is INTERVIEWER?:', user?.role === 'INTERVIEWER');
  }, [user, viewMode]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/dashboard/unified');
      setDashboardData(response.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTimeUntil = (scheduledAt: string) => {
    const now = new Date();
    const scheduled = new Date(scheduledAt);
    const diff = scheduled.getTime() - now.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 0) return 'Started';
    if (minutes < 60) return `${minutes} min`;
    if (hours < 24) return `${hours}h ${minutes % 60}m`;
    return `${days} days`;
  };

  const getUrgencyColor = (scheduledAt: string) => {
    const now = new Date();
    const scheduled = new Date(scheduledAt);
    const diff = scheduled.getTime() - now.getTime();
    const minutes = Math.floor(diff / 60000);

    if (minutes < 30) return 'bg-red-100 text-red-800 border-red-300';
    if (minutes < 240) return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    return 'bg-green-100 text-green-800 border-green-300';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex justify-center items-center">
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-4">
            <div className="absolute inset-0 rounded-full border-4 border-blue-200 animate-ping"></div>
            <div className="relative w-24 h-24 rounded-full border-4 border-t-blue-600 border-r-purple-600 border-b-pink-600 border-l-blue-300 animate-spin"></div>
          </div>
          <p className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Hero Welcome Card with Gradient Border */}
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl blur opacity-30 group-hover:opacity-100 transition duration-1000"></div>
          <div className="relative bg-white rounded-3xl p-8 shadow-xl">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                    Welcome back, {user?.firstName}! 👋
                  </h1>
                  <p className="text-gray-600 text-lg">
                    {user?.role === 'INTERVIEWER' 
                      ? 'Manage your scheduled interviews and help candidates succeed.'
                      : 'Track your interview journey and prepare for success!'}
                  </p>
                  <div className="mt-3">
                    <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold shadow-sm ${
                      user?.role === 'INTERVIEWER' 
                        ? 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border border-purple-200' 
                        : 'bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border border-blue-200'
                    }`}>
                      {user?.role === 'INTERVIEWER' ? '👨‍🏫 Interviewer Mode' : '👤 Candidate Mode'}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4 lg:gap-6">
                <div className="group/card relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl blur-sm opacity-0 group-hover/card:opacity-70 transition-opacity"></div>
                  <div className="relative text-center px-6 py-5 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 hover:shadow-lg transition-all">
                    <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-3xl font-bold bg-gradient-to-br from-blue-600 to-blue-700 bg-clip-text text-transparent">
                      {dashboardData?.stats.totalUpcoming || 0}
                    </div>
                    <div className="text-sm text-gray-600 font-medium mt-1">Upcoming</div>
                  </div>
                </div>
                
                <div className="group/card relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl blur-sm opacity-0 group-hover/card:opacity-70 transition-opacity"></div>
                  <div className="relative text-center px-6 py-5 rounded-2xl bg-gradient-to-br from-green-50 to-green-100 border border-green-200 hover:shadow-lg transition-all">
                    <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <div className="text-3xl font-bold bg-gradient-to-br from-green-600 to-green-700 bg-clip-text text-transparent">
                      {dashboardData?.stats.totalCompleted || 0}
                    </div>
                    <div className="text-sm text-gray-600 font-medium mt-1">Completed</div>
                  </div>
                </div>
                
                <div className="group/card relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl blur-sm opacity-0 group-hover/card:opacity-70 transition-opacity"></div>
                  <div className="relative text-center px-6 py-5 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 hover:shadow-lg transition-all">
                    <Clock className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <div className="text-3xl font-bold bg-gradient-to-br from-purple-600 to-purple-700 bg-clip-text text-transparent">
                      {dashboardData?.stats.todayTotal || 0}
                    </div>
                    <div className="text-sm text-gray-600 font-medium mt-1">Today</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>




      {/* Stats Overview - Role Specific */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">
                {user?.role === 'INTERVIEWER' ? 'Sessions to Conduct' : 'My Interviews'}
              </p>
              <p className="text-3xl font-bold text-gray-900">{dashboardData?.stats.totalUpcoming || 0}</p>
            </div>
            <Calendar className="w-12 h-12 text-primary-600 opacity-20" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">
                {user?.role === 'INTERVIEWER' ? 'Conducted' : 'Completed'}
              </p>
              <p className="text-3xl font-bold text-gray-900">{dashboardData?.stats.totalCompleted || 0}</p>
            </div>
            <CheckCircle className="w-12 h-12 text-green-600 opacity-20" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Today's Sessions</p>
              <p className="text-3xl font-bold text-gray-900">{dashboardData?.stats.todayTotal || 0}</p>
            </div>
            <Clock className="w-12 h-12 text-secondary-600 opacity-20" />
          </div>
        </div>
      </div>

      {/* Resume Tools Section - Only for Candidates */}
      {user?.role === 'CANDIDATE' && (
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Resume Tools</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Link
              to="/resume-maker"
              className="card hover:shadow-lg transition-shadow cursor-pointer group"
            >
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Resume Maker
                  </h3>
                  <p className="text-gray-600">
                    Create a professional resume with our easy-to-use builder. Choose from multiple templates.
                  </p>
                  <span className="inline-block mt-3 text-green-600 font-medium group-hover:underline">
                    Create Resume →
                  </span>
                </div>
              </div>
            </Link>

            <Link
              to="/resume-matcher"
              className="card hover:shadow-lg transition-shadow cursor-pointer group"
            >
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Resume Matcher
                  </h3>
                  <p className="text-gray-600">
                    Upload your resume and get AI-powered analysis with job role matching and improvement suggestions.
                  </p>
                  <span className="inline-block mt-3 text-purple-600 font-medium group-hover:underline">
                    Analyze Resume →
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      )}

      {/* Candidate View */}
      {viewMode === 'candidate' && dashboardData && (
        <div className="space-y-6">
          <div className="card">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <User className="w-6 h-6 mr-2" />
              As Candidate ({dashboardData.candidate.total} total)
            </h2>

            {dashboardData.candidate.today.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">📅 Today's Interviews</h3>
                <div className="space-y-3">
                  {dashboardData.candidate.today.map((interview) => (
                    <div 
                      key={interview.id}
                      className={`border-2 rounded-lg p-4 ${getUrgencyColor(interview.scheduledAt)}`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-lg">{interview.topic}</h4>
                          <p className="text-sm opacity-80">
                            With: {interview.interviewer?.firstName} {interview.interviewer?.lastName}
                          </p>
                          <p className="text-sm mt-1">
                            {new Date(interview.scheduledAt).toLocaleTimeString()} • {interview.duration} min • {interview.interviewType}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-lg">
                            {getTimeUntil(interview.scheduledAt)}
                          </div>
                          <Link
                            to={`/interview-room/${interview.id}`}
                            className="mt-2 inline-block bg-white px-4 py-2 rounded-lg font-semibold shadow-sm hover:shadow-md transition-shadow"
                          >
                            🎥 Join Room
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {dashboardData.candidate.today.length === 0 && (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No interviews scheduled for today.</p>
                <p className="text-gray-500 text-sm mt-2">Visit "Schedule Interview" to view and manage all your interview requests.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Interviewer View */}
      {viewMode === 'interviewer' && dashboardData && (
        <div className="space-y-6">
          <div className="card">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <UserCheck className="w-6 h-6 mr-2" />
              As Interviewer ({dashboardData.interviewer.total} total)
              {dashboardData.interviewer.averageRating > 0 && (
                <span className="ml-auto flex items-center text-lg">
                  <TrendingUp className="w-5 h-5 mr-1 text-green-600" />
                  <span className="font-bold">{dashboardData.interviewer.averageRating.toFixed(1)}</span>
                  <span className="text-gray-500 text-sm ml-1">/5.0</span>
                </span>
              )}
            </h2>

            {dashboardData.interviewer.today.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Today's Interviews to Conduct</h3>
                <div className="space-y-3">
                  {dashboardData.interviewer.today.map((interview) => (
                    <div 
                      key={interview.id}
                      className={`border-2 rounded-lg p-4 ${getUrgencyColor(interview.scheduledAt)}`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-lg">{interview.topic}</h4>
                          <p className="text-sm opacity-80">
                            Candidate: {interview.candidate?.firstName} {interview.candidate?.lastName}
                          </p>
                          <p className="text-sm mt-1">
                            {new Date(interview.scheduledAt).toLocaleTimeString()} • {interview.duration} min • {interview.interviewType}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-lg">
                            {getTimeUntil(interview.scheduledAt)}
                          </div>
                          <Link
                            to={`/interview-room/${interview.id}`}
                            className="mt-2 inline-block bg-white px-4 py-2 rounded-lg font-semibold shadow-sm hover:shadow-md transition-shadow"
                          >
                            🎥 Join Room
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {dashboardData.interviewer.today.length === 0 && (
              <div className="text-center py-12">
                <UserCheck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No interviews scheduled for today.</p>
                <p className="text-gray-500 text-sm mt-2">Check the "Interview Requests" page to review pending requests.</p>
              </div>
            )}
          </div>
        </div>
      )}
      
      </div>
    </div>
  );
}
