import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BrainCircuit, Zap, Code, MessageSquare, Briefcase } from 'lucide-react';
import api from '../services/api';

export default function AIInterviewPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    interviewType: 'TECHNICAL',
    topic: '',
    difficulty: 'MEDIUM',
    duration: 30,
  });

  // Must match backend validator in routes: TECHNICAL, HR, APTITUDE, BEHAVIORAL, DOMAIN_SPECIFIC, CODING, SYSTEM_DESIGN
  const interviewTypes = [
    { value: 'TECHNICAL', label: 'Technical', icon: Code },
    { value: 'HR', label: 'HR', icon: MessageSquare },
    { value: 'APTITUDE', label: 'Aptitude', icon: BrainCircuit },
    { value: 'BEHAVIORAL', label: 'Behavioral', icon: MessageSquare },
    { value: 'DOMAIN_SPECIFIC', label: 'Domain Specific', icon: Briefcase },
    { value: 'CODING', label: 'Coding', icon: Code },
    { value: 'SYSTEM_DESIGN', label: 'System Design', icon: Briefcase },
  ];

  const difficulties = [
    { value: 'EASY', label: 'Easy', description: 'Entry level questions' },
    { value: 'MEDIUM', label: 'Medium', description: 'Intermediate concepts' },
    { value: 'HARD', label: 'Hard', description: 'Advanced topics' },
  ];

  const topicSuggestions: Record<string, string[]> = {
    TECHNICAL: ['Machine Learning', 'DSA', 'Web Development', 'Data Analytics', 'Cloud Computing', 'Cybersecurity'],
    HR: ['Culture Fit', 'Strengths & Weaknesses', 'Career Goals', 'Work-Life Balance'],
    APTITUDE: ['Logical Reasoning', 'Quantitative', 'Verbal Ability', 'Pattern Recognition'],
    BEHAVIORAL: ['Leadership', 'Teamwork', 'Communication', 'Conflict Resolution', 'Problem Solving'],
    DOMAIN_SPECIFIC: ['Machine Learning', 'Web Development', 'Mobile Development', 'DevOps', 'Data Science', 'AI/NLP'],
    CODING: ['DSA', 'Algorithms', 'Data Structures', 'Competitive Programming', 'Problem Solving'],
    SYSTEM_DESIGN: ['Scalability', 'Microservices', 'Databases', 'Caching', 'Load Balancing', 'API Design'],
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Backend expects: interviewType, topic, difficulty (optional), duration (15-120)
      const payload = {
        interviewType: formData.interviewType,
        topic: formData.topic,
        difficulty: formData.difficulty,
        duration: formData.duration,
      };
      const response = await api.post('/ai-interviews', payload);
      const interviewId = response.data?.interview?.id;
      if (interviewId) {
        navigate(`/interview-room/${interviewId}`);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create interview. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <BrainCircuit className="w-8 h-8 text-primary-600" />
          AI-Powered Mock Interview
        </h1>
        <p className="text-gray-600 mt-2">
          Practice with our AI interviewer and get instant feedback on your responses
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2">
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Create New Interview</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">{error}</div>
              )}

              {/* Interview Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Interview Type
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {interviewTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, interviewType: type.value as any, topic: '' })}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          formData.interviewType === type.value
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <Icon className={`w-6 h-6 mx-auto mb-2 ${
                          formData.interviewType === type.value ? 'text-primary-600' : 'text-gray-400'
                        }`} />
                        <div className="text-sm font-medium text-gray-900">{type.label}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Topic */}
              <div>
                <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-2">
                  Domain / Focus Area
                </label>
                <input
                  id="topic"
                  type="text"
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  className="input"
                  placeholder="e.g., Machine Learning, DSA, Web Development, Data Analytics"
                  required
                />
                <div className="mt-2 flex flex-wrap gap-2">
                  {topicSuggestions[formData.interviewType]?.map((topic) => (
                    <button
                      key={topic}
                      type="button"
                      onClick={() => setFormData({ ...formData, topic })}
                      className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700 transition-colors"
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Difficulty Level
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {difficulties.map((diff) => (
                    <button
                      key={diff.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, difficulty: diff.value as any })}
                      className={`p-4 rounded-lg border-2 text-left transition-all ${
                        formData.difficulty === diff.value
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className={`font-medium ${
                        formData.difficulty === diff.value ? 'text-primary-600' : 'text-gray-900'
                      }`}>
                        {diff.label}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{diff.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Duration */}
              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (minutes)
                </label>
                <select
                  id="duration"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                  className="input"
                  required
                >
                  {[15, 30, 45, 60, 90, 120].map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full flex items-center justify-center gap-2"
              >
                {loading ? (
                  'Creating Interview...'
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    Start AI Interview
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Info Sidebar */}
        <div className="space-y-4">
          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-3">How it works</h3>
            <ol className="space-y-3 text-sm text-gray-600">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-xs font-medium">
                  1
                </span>
                <span>Select your interview type and topic</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-xs font-medium">
                  2
                </span>
                <span>AI generates personalized questions</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-xs font-medium">
                  3
                </span>
                <span>Answer questions in the interview room</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-xs font-medium">
                  4
                </span>
                <span>Get instant AI feedback and scoring</span>
              </li>
            </ol>
          </div>

          <div className="card bg-gradient-to-br from-primary-50 to-secondary-50">
            <h3 className="font-semibold text-gray-900 mb-2">💡 Pro Tips</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Be specific with your topic</li>
              <li>• Start with easier questions</li>
              <li>• Practice regularly for best results</li>
              <li>• Review feedback after each session</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
