import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Video, Calendar, Clock, Users, Plus, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import api from '../services/api';

interface LiveInterview {
  id: string;
  interviewType: string;
  topic: string;
  difficulty?: string;
  scheduledAt: string;
  duration: number;
  status: string;
  roomId: string;
  interviewer?: {
    id: string;
    firstName: string;
    lastName: string;
    email?: string;
  };
  candidate?: {
    id: string;
    firstName: string;
    lastName: string;
    email?: string;
  };
}

export default function LiveInterviewPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [interviews, setInterviews] = useState<LiveInterview[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    interviewType: 'TECHNICAL',
    topic: '',
    difficulty: 'MEDIUM',
    scheduledFor: '',
    interviewerEmail: '',
  });
  const [duration, setDuration] = useState(60);
  const [error, setError] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  const isInterviewer = user?.role === 'INTERVIEWER';

  // Domain suggestions based on interview type
  const domainSuggestions: Record<string, string[]> = {
    TECHNICAL: ['Machine Learning', 'DSA', 'Web Development', 'Data Analytics', 'Cloud Computing', 'Cybersecurity'],
    HR: ['Culture Fit', 'Strengths & Weaknesses', 'Career Goals', 'Work-Life Balance'],
    APTITUDE: ['Logical Reasoning', 'Quantitative', 'Verbal Ability', 'Pattern Recognition'],
    BEHAVIORAL: ['Leadership', 'Teamwork', 'Communication', 'Conflict Resolution', 'Problem Solving'],
    DOMAIN_SPECIFIC: ['Machine Learning', 'Web Development', 'Mobile Development', 'DevOps', 'Data Science', 'AI/NLP'],
    CODING: ['DSA', 'Algorithms', 'Data Structures', 'Competitive Programming', 'Problem Solving'],
    SYSTEM_DESIGN: ['Scalability', 'Microservices', 'Databases', 'Caching', 'Load Balancing', 'API Design'],
  };

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      const response = await api.get('/live-interviews');
      // Backend returns { interviews: [...] }
      setInterviews(response.data.interviews || []);
    } catch (err) {
      console.error('Failed to fetch interviews:', err);
      setError('Failed to load interviews. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitLoading(true);

    try {
      // Backend expects: interviewType, topic, scheduledAt (ISO), duration (30-180), interviewerId (optional)
      const payload: any = {
        interviewType: formData.interviewType,
        topic: formData.topic,
        scheduledAt: new Date(formData.scheduledFor).toISOString(),
        duration,
      };

      // Resolve interviewerEmail -> interviewerId if provided
      if (formData.interviewerEmail) {
        try {
          const lookup = await api.get('/users/lookup', { params: { email: formData.interviewerEmail } });
          if (lookup.data?.user?.id) {
            payload.interviewerId = lookup.data.user.id;
          }
        } catch (e) {
          // If lookup fails, proceed without interviewerId
          console.warn('Interviewer lookup failed, proceeding without interviewerId');
        }
      }

      await api.post('/live-interviews', payload);
      setShowForm(false);
      setFormData({
        interviewType: 'TECHNICAL',
        topic: '',
        difficulty: 'MEDIUM',
        scheduledFor: '',
        interviewerEmail: '',
      });
      setDuration(60);
      fetchInterviews();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to schedule interview');
    } finally {
      setSubmitLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SCHEDULED': return 'text-blue-600 bg-blue-50';
      case 'IN_PROGRESS': return 'text-green-600 bg-green-50';
      case 'COMPLETED': return 'text-gray-600 bg-gray-50';
      case 'CANCELLED': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'SCHEDULED': return <AlertCircle className="w-4 h-4" />;
      case 'IN_PROGRESS': return <CheckCircle className="w-4 h-4" />;
      case 'COMPLETED': return <CheckCircle className="w-4 h-4" />;
      case 'CANCELLED': return <XCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header - Role Specific */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Video className="w-8 h-8 text-primary-600" />
            {isInterviewer ? 'Interview Requests' : 'Schedule Live Interview'}
          </h1>
          <p className="text-gray-600 mt-2">
            {isInterviewer 
              ? 'View and manage interview requests from candidates'
              : 'Schedule real-time interviews with professional interviewers'}
          </p>
        </div>
        {/* Only show schedule button for candidates */}
        {!isInterviewer && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn btn-primary flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Schedule Interview
          </button>
        )}
      </div>

      {/* Schedule Form - Only for Candidates */}
      {!isInterviewer && showForm && (
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Schedule New Interview</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">{error}</div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Interview Type
                </label>
                <select
                  value={formData.interviewType}
                  onChange={(e) => setFormData({ ...formData, interviewType: e.target.value })}
                  className="input"
                  required
                >
                  <option value="TECHNICAL">Technical</option>
                  <option value="HR">HR</option>
                  <option value="APTITUDE">Aptitude</option>
                  <option value="BEHAVIORAL">Behavioral</option>
                  <option value="DOMAIN_SPECIFIC">Domain Specific</option>
                  <option value="CODING">Coding</option>
                  <option value="SYSTEM_DESIGN">System Design</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Difficulty
                </label>
                <select
                  value={formData.difficulty}
                  onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                  className="input"
                  required
                >
                  <option value="EASY">Easy</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HARD">Hard</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Domain / Focus Area
              </label>
              <input
                type="text"
                value={formData.topic}
                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                className="input"
                placeholder="e.g., Machine Learning, DSA, Web Development, Data Analytics"
                required
              />
              <div className="mt-2 flex flex-wrap gap-2">
                {domainSuggestions[formData.interviewType]?.map((domain) => (
                  <button
                    key={domain}
                    type="button"
                    onClick={() => setFormData({ ...formData, topic: domain })}
                    className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700 transition-colors"
                  >
                    {domain}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Schedule Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={formData.scheduledFor}
                  onChange={(e) => setFormData({ ...formData, scheduledFor: e.target.value })}
                  className="input"
                  required
                  min={new Date().toISOString().slice(0, 16)}
                />
              </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration (minutes)
                  </label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="input"
                    required
                  >
                    {[30, 60, 90, 120, 180].map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Interviewer Email (Optional)
                </label>
                <input
                  type="email"
                  value={formData.interviewerEmail}
                  onChange={(e) => setFormData({ ...formData, interviewerEmail: e.target.value })}
                  className="input"
                  placeholder="interviewer@example.com"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={submitLoading}
                className="btn btn-primary flex-1"
              >
                {submitLoading ? 'Scheduling...' : 'Schedule Interview'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Interviews List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Your Scheduled Interviews</h2>
        
        {loading ? (
          <div className="card text-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading interviews...</p>
          </div>
        ) : interviews.length === 0 ? (
          <div className="card text-center py-12">
            <Video className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No interviews scheduled yet</p>
            <button
              onClick={() => setShowForm(true)}
              className="btn btn-primary mt-4"
            >
              Schedule Your First Interview
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {interviews.map((interview) => (
              <div key={interview.id} className="card hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {interview.topic}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(interview.status)}`}>
                        {getStatusIcon(interview.status)}
                        {interview.status}
                      </span>
                    </div>

                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(interview.scheduledAt)}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{interview.interviewType} • {interview.duration} min</span>
                        </div>
                        {interview.interviewer && (
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            <span>{interview.interviewer.firstName} {interview.interviewer.lastName}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {interview.status === 'SCHEDULED' && (
                      <button
                        onClick={() => navigate(`/interview-room/${interview.id}`)}
                        className="btn btn-primary"
                      >
                        Join Interview
                      </button>
                    )}
                    {interview.status === 'COMPLETED' && (
                      <button
                        onClick={() => navigate(`/interview-room/${interview.id}`)}
                        className="btn btn-secondary"
                      >
                        View Results
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
