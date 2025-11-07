import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader } from 'lucide-react';
import api from '../services/api';
import InterviewFeedback from '../components/InterviewFeedback';

export default function InterviewFeedbackPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [interview, setInterview] = useState<any>(null);

  useEffect(() => {
    fetchInterviewFeedback();
  }, [id]);

  const fetchInterviewFeedback = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Fetch interview details with feedback
      const response = await api.get(`/ai-interviews/${id}`);
      const interviewData = response.data?.interview;

      if (!interviewData) {
        throw new Error('Interview not found');
      }

      // Check if interview is completed
      if (interviewData.status !== 'COMPLETED') {
        setError('This interview is not yet completed');
        return;
      }

      setInterview(interviewData);
    } catch (err: any) {
      console.error('Fetch interview error:', err);
      setError(err.response?.data?.error || 'Failed to load interview feedback');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader className="w-12 h-12 text-primary-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading feedback...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto mt-12">
        <div className="card bg-red-50 border border-red-200">
          <h2 className="text-xl font-semibold text-red-900 mb-2">Error Loading Feedback</h2>
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="btn-secondary"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!interview) {
    return (
      <div className="max-w-2xl mx-auto mt-12">
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Interview Not Found</h2>
          <p className="text-gray-600 mb-4">
            The interview you're looking for doesn't exist or you don't have permission to view it.
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="btn-secondary"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Dashboard</span>
        </button>
        <div className="text-sm text-gray-500">
          Completed: {interview.completedAt ? new Date(interview.completedAt).toLocaleDateString() : 'N/A'}
        </div>
      </div>

      {/* Feedback Component */}
      <InterviewFeedback interview={interview} />
    </div>
  );
}
