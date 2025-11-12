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
      // Validate interviewer email is provided
      if (!formData.interviewerEmail || !formData.interviewerEmail.trim()) {
        setError('Interviewer email is required');
        setSubmitLoading(false);
        return;
      }

      // Backend expects: interviewType, topic, scheduledAt (ISO), duration (30-180), interviewerId
      const payload: any = {
        interviewType: formData.interviewType,
        topic: formData.topic,
        scheduledAt: new Date(formData.scheduledFor).toISOString(),
        duration,
      };

      // Resolve interviewerEmail -> interviewerId (now required)
      try {
        const lookup = await api.get('/users/lookup', { params: { email: formData.interviewerEmail } });
        if (lookup.data?.user?.id) {
          const interviewerUser = lookup.data.user;
          
          // Verify the user is actually an interviewer
          if (interviewerUser.role !== 'INTERVIEWER') {
            setError('The email provided is not registered as an interviewer. Please use a valid interviewer email.');
            setSubmitLoading(false);
            return;
          }
          
          payload.interviewerId = interviewerUser.id;
        } else {
          setError('Interviewer not found. Please check the email and try again.');
          setSubmitLoading(false);
          return;
        }
      } catch (e: any) {
        console.error('Interviewer lookup failed:', e);
        setError(e.response?.data?.error || 'Failed to find interviewer. Please check the email and try again.');
        setSubmitLoading(false);
        return;
      }

      await api.post('/live-interviews', payload);
      
      alert('Interview scheduled successfully! The interviewer will be notified via email.');
      
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header - Role Specific */}
        <div className="relative overflow-hidden rounded-3xl bg-white/80 backdrop-blur-xl p-8 shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-pink-600/5"></div>
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-lg">
                <Video className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-extrabold text-gray-900">
                  {isInterviewer ? (
                    <>Interview <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Requests</span></>
                  ) : (
                    <>Schedule <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Live Interview</span></>
                  )}
                </h1>
                <p className="text-lg text-gray-600 mt-1">
                  {isInterviewer 
                    ? 'View and manage interview requests from candidates'
                    : 'Schedule real-time interviews with professional interviewers'}
                </p>
              </div>
            </div>
            {/* Only show schedule button for candidates */}
            {!isInterviewer && (
              <button
                onClick={() => setShowForm(!showForm)}
                className="group px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold hover:shadow-xl transform hover:scale-105 transition-all flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Schedule Interview
              </button>
            )}
          </div>
        </div>

        {/* Schedule Form - Only for Candidates */}
        {!isInterviewer && showForm && (
          <div className="relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl blur opacity-10"></div>
            <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                <Calendar className="w-6 h-6 text-purple-600" />
                Schedule New Interview
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-xl text-sm flex items-start gap-3">
                    <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span>{error}</span>
                  </div>
                )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  Interview Type
                </label>
                <div className="relative">
                  <select
                    value={formData.interviewType}
                    onChange={(e) => setFormData({ ...formData, interviewType: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none appearance-none bg-white font-medium text-gray-900"
                    required
                  >
                    <option value="TECHNICAL">💻 Technical</option>
                    <option value="HR">👔 HR</option>
                    <option value="APTITUDE">🧠 Aptitude</option>
                    <option value="BEHAVIORAL">🤝 Behavioral</option>
                    <option value="DOMAIN_SPECIFIC">🎯 Domain Specific</option>
                    <option value="CODING">⚡ Coding</option>
                    <option value="SYSTEM_DESIGN">🏗️ System Design</option>
                  </select>
                  <svg className="absolute right-4 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  Difficulty
                </label>
                <div className="relative">
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none appearance-none bg-white font-medium text-gray-900"
                    required
                  >
                    <option value="EASY">🟢 Easy</option>
                    <option value="MEDIUM">🟡 Medium</option>
                    <option value="HARD">🔴 Hard</option>
                  </select>
                  <svg className="absolute right-4 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">
                Domain / Focus Area
              </label>
              <input
                type="text"
                value={formData.topic}
                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none text-gray-900"
                placeholder="e.g., Machine Learning, DSA, Web Development"
                required
              />
              <div className="mt-3 flex flex-wrap gap-2">
                {domainSuggestions[formData.interviewType]?.map((domain) => (
                  <button
                    key={domain}
                    type="button"
                    onClick={() => setFormData({ ...formData, topic: domain })}
                    className="px-4 py-2 text-sm bg-gradient-to-r from-gray-100 to-gray-50 hover:from-purple-100 hover:to-blue-100 rounded-full text-gray-700 hover:text-purple-900 transition-all font-medium border border-gray-200 hover:border-purple-300"
                  >
                    {domain}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  Schedule Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={formData.scheduledFor}
                  onChange={(e) => setFormData({ ...formData, scheduledFor: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none text-gray-900"
                  required
                  min={new Date().toISOString().slice(0, 16)}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  Duration (minutes)
                </label>
                <div className="relative">
                  <select
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none appearance-none bg-white font-medium text-gray-900"
                    required
                  >
                    {[30, 60, 90, 120, 180].map((d) => (
                      <option key={d} value={d}>{d} minutes</option>
                    ))}
                  </select>
                  <svg className="absolute right-4 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">
                Interviewer Email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={formData.interviewerEmail}
                  onChange={(e) => setFormData({ ...formData, interviewerEmail: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none pr-10 text-gray-900"
                  placeholder="interviewer@example.com"
                  required
                />
                <svg className="absolute right-4 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </div>
              <p className="text-sm text-gray-500 mt-2 bg-blue-50 rounded-lg p-3 border border-blue-200">
                💡 Enter the email of the interviewer you want to schedule with
              </p>
            </div>

            <div className="flex gap-4 pt-2">
              <button
                type="submit"
                disabled={submitLoading}
                className="group relative flex-1 py-3.5 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg hover:shadow-2xl transform hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {submitLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Scheduling...
                    </>
                  ) : (
                    <>
                      <Calendar className="w-5 h-5" />
                      Schedule Interview
                    </>
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-8 py-3.5 rounded-xl bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
        )}

      {/* Interviews List */}
      <div className="space-y-6">
        {!isInterviewer && (
          <>
            {/* Pending Requests Section for Candidates */}
            {interviews.filter(i => i.status === 'PENDING').length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3 mb-4">
                  <AlertCircle className="w-6 h-6 text-orange-600" />
                  Pending Requests
                  <span className="bg-orange-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                    {interviews.filter(i => i.status === 'PENDING').length}
                  </span>
                </h2>
                <div className="grid grid-cols-1 gap-5 mb-8">
                  {interviews.filter(i => i.status === 'PENDING').map((interview) => (
                    <div key={interview.id} className="group relative">
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500 to-pink-500 rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-500"></div>
                      <div className="relative bg-orange-50 border-2 border-orange-300 rounded-2xl p-6 shadow-lg">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 space-y-4">
                            <div className="flex items-center gap-3 flex-wrap">
                              <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                                AWAITING APPROVAL
                              </span>
                              <h3 className="text-xl font-bold text-gray-900">
                                {interview.topic}
                              </h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                              <div className="flex items-center gap-3 text-gray-700">
                                <div className="p-2 bg-orange-200 rounded-lg">
                                  <Calendar className="w-4 h-4 text-orange-700" />
                                </div>
                                <div>
                                  <div className="text-xs text-gray-600 font-medium">Scheduled For</div>
                                  <div className="font-semibold text-gray-900">{formatDate(interview.scheduledAt)}</div>
                                </div>
                              </div>
                              <div className="flex items-center gap-3 text-gray-700">
                                <div className="p-2 bg-orange-200 rounded-lg">
                                  <Clock className="w-4 h-4 text-orange-700" />
                                </div>
                                <div>
                                  <div className="text-xs text-gray-600 font-medium">Details</div>
                                  <div className="font-semibold text-gray-900">{interview.interviewType} • {interview.duration} min</div>
                                </div>
                              </div>
                              {interview.interviewer && (
                                <div className="flex items-center gap-3 text-gray-700">
                                  <div className="p-2 bg-orange-200 rounded-lg">
                                    <Users className="w-4 h-4 text-orange-700" />
                                  </div>
                                  <div>
                                    <div className="text-xs text-gray-600 font-medium">Interviewer</div>
                                    <div className="font-semibold text-gray-900">{interview.interviewer.firstName} {interview.interviewer.lastName}</div>
                                  </div>
                                </div>
                              )}
                            </div>
                            <p className="text-sm text-gray-700 bg-orange-100 p-3 rounded-lg">
                              ⏳ Your interview request is waiting for the interviewer's approval. You'll be notified once they accept or decline.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Scheduled/Confirmed Interviews Section */}
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
              Confirmed Interviews
            </h2>
          </>
        )}

        {isInterviewer && (
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <Users className="w-6 h-6 text-purple-600" />
            Your Scheduled Interviews
          </h2>
        )}
        
        {loading ? (
          <div className="relative overflow-hidden rounded-2xl bg-white/90 backdrop-blur-xl p-16 shadow-xl text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 bg-purple-600 rounded-full opacity-20 animate-ping"></div>
                </div>
              </div>
              <p className="text-gray-600 text-lg font-medium">Loading interviews...</p>
            </div>
          </div>
        ) : interviews.filter(i => !(!isInterviewer && i.status === 'PENDING')).length === 0 ? (
          <div className="relative overflow-hidden rounded-2xl bg-white/90 backdrop-blur-xl p-16 shadow-xl text-center">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 opacity-50"></div>
            <div className="relative">
              <div className="inline-flex p-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl mb-6">
                <Video className="w-16 h-16 text-purple-600" />
              </div>
              <p className="text-xl font-semibold text-gray-900 mb-2">No interviews scheduled yet</p>
              <p className="text-gray-600 mb-6">Start your preparation journey today!</p>
              {!isInterviewer && (
                <button
                  onClick={() => setShowForm(true)}
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold hover:shadow-xl transform hover:scale-105 transition-all"
                >
                  <Plus className="w-5 h-5" />
                  Schedule Your First Interview
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5">
            {interviews
              .filter(interview => !(!isInterviewer && interview.status === 'PENDING')) // Hide PENDING for candidates (shown above)
              .map((interview) => (
              <div key={interview.id} className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl blur opacity-20 group-hover:opacity-100 transition duration-500"></div>
                <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="text-xl font-bold text-gray-900">
                          {interview.topic}
                        </h3>
                        <span className={`px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-2 ${getStatusColor(interview.status)}`}>
                          {getStatusIcon(interview.status)}
                          {interview.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-3 text-gray-600">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <Calendar className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <div className="text-xs text-gray-500 font-medium">Scheduled For</div>
                            <div className="font-semibold text-gray-900">{formatDate(interview.scheduledAt)}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 text-gray-600">
                          <div className="p-2 bg-purple-100 rounded-lg">
                            <Clock className="w-4 h-4 text-purple-600" />
                          </div>
                          <div>
                            <div className="text-xs text-gray-500 font-medium">Details</div>
                            <div className="font-semibold text-gray-900">{interview.interviewType} • {interview.duration} min</div>
                          </div>
                        </div>
                        {isInterviewer && interview.candidate && (
                          <div className="flex items-center gap-3 text-gray-600">
                            <div className="p-2 bg-green-100 rounded-lg">
                              <Users className="w-4 h-4 text-green-600" />
                            </div>
                            <div>
                              <div className="text-xs text-gray-500 font-medium">Candidate</div>
                              <div className="font-semibold text-gray-900">{interview.candidate.firstName} {interview.candidate.lastName}</div>
                            </div>
                          </div>
                        )}
                        {!isInterviewer && interview.interviewer && (
                          <div className="flex items-center gap-3 text-gray-600">
                            <div className="p-2 bg-green-100 rounded-lg">
                              <Users className="w-4 h-4 text-green-600" />
                            </div>
                            <div>
                              <div className="text-xs text-gray-500 font-medium">Interviewer</div>
                              <div className="font-semibold text-gray-900">{interview.interviewer.firstName} {interview.interviewer.lastName}</div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      {interview.status === 'SCHEDULED' && (
                        <button
                          onClick={() => navigate(`/live-interview-room/${interview.id}`)}
                          className="group px-6 py-3 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold hover:shadow-xl transform hover:scale-105 transition-all flex items-center gap-2 whitespace-nowrap"
                        >
                          <Video className="w-5 h-5" />
                          Join Interview
                        </button>
                      )}
                      {interview.status === 'COMPLETED' && (
                        <button
                          onClick={() => navigate(`/live-interview-room/${interview.id}`)}
                          className="px-6 py-3 rounded-xl bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 transition-all flex items-center gap-2 whitespace-nowrap"
                        >
                          <CheckCircle className="w-5 h-5" />
                          View Results
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
    </div>
  );
}
