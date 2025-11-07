import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { 
  BrainCircuit, 
  Video, 
  Calendar, 
  TrendingUp, 
  Bell, 
  Clock, 
  User, 
  CheckCircle, 
  XCircle,
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

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/api/dashboard/unified');
      setDashboardData(response.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptInterview = async (interviewId: string) => {
    try {
      await api.post(`/api/dashboard/interviewer/requests/${interviewId}/accept`);
      fetchDashboardData(); // Refresh data
      alert('Interview accepted successfully!');
    } catch (error) {
      console.error('Failed to accept interview:', error);
      alert('Failed to accept interview. Please try again.');
    }
  };

  const handleDeclineInterview = async (interviewId: string) => {
    if (!confirm('Are you sure you want to decline this interview?')) return;
    
    try {
      await api.post(`/api/dashboard/interviewer/requests/${interviewId}/decline`);
      fetchDashboardData(); // Refresh data
      alert('Interview declined.');
    } catch (error) {
      console.error('Failed to decline interview:', error);
      alert('Failed to decline interview. Please try again.');
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
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {user?.firstName}! 👋
            </h1>
            <p className="text-gray-600">
              {user?.role === 'INTERVIEWER' 
                ? 'Manage interview requests and conduct sessions with candidates.'
                : user?.role === 'CANDIDATE'
                ? 'Schedule interviews and practice your skills to ace your next job!'
                : 'Manage your interviews and track your progress from both perspectives.'}
            </p>
          </div>
          <div className="text-right">
            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
              user?.role === 'INTERVIEWER' 
                ? 'bg-purple-100 text-purple-800' 
                : 'bg-blue-100 text-blue-800'
            }`}>
              {user?.role === 'INTERVIEWER' ? '👨‍🏫 Interviewer' : '👤 Candidate'}
            </span>
          </div>
        </div>
      </div>



      {/* Stats Overview - Role Specific */}
      <div className="grid md:grid-cols-4 gap-6">
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

        {user?.role === 'INTERVIEWER' ? (
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Pending Requests</p>
                <p className="text-3xl font-bold text-gray-900">{dashboardData?.stats.pendingRequests || 0}</p>
              </div>
              <Bell className="w-12 h-12 text-orange-600 opacity-20" />
            </div>
          </div>
        ) : (
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Awaiting Confirmation</p>
                <p className="text-3xl font-bold text-gray-900">{dashboardData?.stats.pendingRequests || 0}</p>
              </div>
              <Clock className="w-12 h-12 text-yellow-600 opacity-20" />
            </div>
          </div>
        )}

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

      {/* Quick Actions - Role Specific */}
      <div className="grid md:grid-cols-2 gap-6">
        <Link
          to="/ai-interview"
          className="card hover:shadow-lg transition-shadow cursor-pointer group"
        >
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-primary-100 rounded-lg group-hover:bg-primary-200 transition-colors">
              <BrainCircuit className="w-8 h-8 text-primary-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {user?.role === 'INTERVIEWER' ? 'Practice with AI' : 'Start AI Interview'}
              </h3>
              <p className="text-gray-600">
                {user?.role === 'INTERVIEWER' 
                  ? 'Improve your interviewing skills with AI practice sessions.'
                  : 'Practice with our AI interviewer and get instant feedback.'}
              </p>
            </div>
          </div>
        </Link>

        <Link
          to="/live-interview"
          className="card hover:shadow-lg transition-shadow cursor-pointer group"
        >
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-secondary-100 rounded-lg group-hover:bg-secondary-200 transition-colors">
              <Video className="w-8 h-8 text-secondary-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {user?.role === 'INTERVIEWER' ? 'Interview Requests' : 'Schedule Interview'}
              </h3>
              <p className="text-gray-600">
                {user?.role === 'INTERVIEWER'
                  ? 'View and manage pending interview requests from candidates.'
                  : 'Book a session with an experienced interviewer.'}
              </p>
              {user?.role === 'INTERVIEWER' && dashboardData && dashboardData.stats.pendingRequests > 0 && (
                <span className="inline-block mt-2 bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                  {dashboardData.stats.pendingRequests} Pending
                </span>
              )}
            </div>
          </div>
        </Link>
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

            {dashboardData.candidate.upcoming.length > 0 ? (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Upcoming Interviews</h3>
                <div className="space-y-3">
                  {dashboardData.candidate.upcoming.filter(i => !dashboardData.candidate.today.includes(i)).map((interview) => (
                    <div key={interview.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-lg text-gray-900">{interview.topic}</h4>
                          <p className="text-sm text-gray-600">
                            With: {interview.interviewer?.firstName} {interview.interviewer?.lastName}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            {new Date(interview.scheduledAt).toLocaleDateString()} at {new Date(interview.scheduledAt).toLocaleTimeString()} • {interview.duration} min
                          </p>
                        </div>
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                          Confirmed
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No upcoming interviews scheduled.</p>
                <Link to="/live-interview" className="btn btn-primary mt-4 inline-block">
                  Schedule Interview
                </Link>
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

            {dashboardData.interviewer.upcoming.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <Bell className="w-5 h-5 mr-2" />
                  Pending Requests ({dashboardData.interviewer.upcoming.length})
                </h3>
                <div className="space-y-3">
                  {dashboardData.interviewer.upcoming.map((interview) => (
                    <div key={interview.id} className="border-2 border-orange-300 bg-orange-50 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded">NEW</span>
                            <h4 className="font-semibold text-lg text-gray-900">{interview.topic}</h4>
                          </div>
                          <p className="text-sm text-gray-700">
                            From: <span className="font-medium">{interview.candidate?.firstName} {interview.candidate?.lastName}</span>
                            <span className="text-gray-500"> ({interview.candidate?.email})</span>
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            📅 {new Date(interview.scheduledAt).toLocaleDateString()} at {new Date(interview.scheduledAt).toLocaleTimeString()}
                          </p>
                          <p className="text-sm text-gray-600">
                            ⏱️ {interview.duration} minutes • {interview.interviewType}
                          </p>
                        </div>
                        <div className="flex flex-col space-y-2 ml-4">
                          <button
                            onClick={() => handleAcceptInterview(interview.id)}
                            className="flex items-center space-x-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                          >
                            <CheckCircle className="w-4 h-4" />
                            <span>Accept</span>
                          </button>
                          <button
                            onClick={() => handleDeclineInterview(interview.id)}
                            className="flex items-center space-x-1 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                          >
                            <XCircle className="w-4 h-4" />
                            <span>Decline</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

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

            {dashboardData.interviewer.upcoming.length === 0 && dashboardData.interviewer.today.length === 0 && (
              <div className="text-center py-12">
                <UserCheck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No pending interview requests.</p>
                <p className="text-gray-500 text-sm mt-2">You'll be notified when someone schedules an interview with you.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
