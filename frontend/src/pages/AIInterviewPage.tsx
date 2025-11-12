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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="relative overflow-hidden rounded-3xl bg-white/80 backdrop-blur-xl p-8 shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-pink-600/5"></div>
          <div className="relative">
            <div className="flex items-center gap-4 mb-3">
              <div className="p-3 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-lg">
                <BrainCircuit className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-extrabold text-gray-900">
                  AI-Powered <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Mock Interview</span>
                </h1>
                <p className="text-lg text-gray-600 mt-1">
                  Practice with our AI interviewer and get instant feedback on your responses
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl blur opacity-10"></div>
              <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl">
                <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                  <Zap className="w-6 h-6 text-purple-600" />
                  Create New Interview
                </h2>

                <form onSubmit={handleSubmit} className="space-y-7">
                  {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-xl text-sm flex items-start gap-3">
                      <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      <span>{error}</span>
                    </div>
                  )}

              {/* Interview Type */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-4">
                  Interview Type
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {interviewTypes.map((type) => {
                    const Icon = type.icon;
                    const isSelected = formData.interviewType === type.value;
                    return (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, interviewType: type.value as any, topic: '' })}
                        className={`group relative p-4 rounded-xl border-2 transition-all ${
                          isSelected
                            ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-blue-50 shadow-lg'
                            : 'border-gray-200 hover:border-purple-300 hover:shadow-md'
                        }`}
                      >
                        <Icon className={`w-7 h-7 mx-auto mb-2 transition-transform group-hover:scale-110 ${
                          isSelected ? 'text-purple-600' : 'text-gray-400 group-hover:text-purple-500'
                        }`} />
                        <div className={`text-sm font-semibold text-center ${
                          isSelected ? 'text-purple-900' : 'text-gray-700'
                        }`}>{type.label}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Topic */}
              <div>
                <label htmlFor="topic" className="block text-sm font-bold text-gray-700 mb-3">
                  Domain / Focus Area
                </label>
                <input
                  id="topic"
                  type="text"
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none text-gray-900"
                  placeholder="e.g., Machine Learning, DSA, Web Development"
                  required
                />
                <div className="mt-3 flex flex-wrap gap-2">
                  {topicSuggestions[formData.interviewType]?.map((topic) => (
                    <button
                      key={topic}
                      type="button"
                      onClick={() => setFormData({ ...formData, topic })}
                      className="px-4 py-2 text-sm bg-gradient-to-r from-gray-100 to-gray-50 hover:from-purple-100 hover:to-blue-100 rounded-full text-gray-700 hover:text-purple-900 transition-all font-medium border border-gray-200 hover:border-purple-300"
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-4">
                  Difficulty Level
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {difficulties.map((diff) => {
                    const isSelected = formData.difficulty === diff.value;
                    return (
                      <button
                        key={diff.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, difficulty: diff.value as any })}
                        className={`group relative p-5 rounded-xl border-2 text-left transition-all ${
                          isSelected
                            ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-blue-50 shadow-lg'
                            : 'border-gray-200 hover:border-purple-300 hover:shadow-md'
                        }`}
                      >
                        <div className={`font-bold text-lg mb-1 ${
                          isSelected ? 'text-purple-900' : 'text-gray-900 group-hover:text-purple-700'
                        }`}>
                          {diff.label}
                        </div>
                        <div className={`text-sm ${
                          isSelected ? 'text-purple-600' : 'text-gray-500'
                        }`}>{diff.description}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Duration */}
              <div>
                <label htmlFor="duration" className="block text-sm font-bold text-gray-700 mb-3">
                  Duration (minutes)
                </label>
                <div className="relative">
                  <select
                    id="duration"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none appearance-none bg-white text-gray-900 font-medium"
                    required
                  >
                    {[15, 30, 45, 60, 90, 120].map((d) => (
                      <option key={d} value={d}>{d} minutes</option>
                    ))}
                  </select>
                  <svg className="absolute right-4 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full py-4 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg hover:shadow-2xl transform hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating Interview...
                    </>
                  ) : (
                    <>
                      <Zap className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                      Start AI Interview
                      <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </>
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>
            </form>
          </div>
        </div>
      </div>

        {/* Info Sidebar */}
        <div className="space-y-6">
          {/* How it works */}
          <div className="relative overflow-hidden rounded-2xl bg-white/90 backdrop-blur-xl p-6 shadow-xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full blur-3xl opacity-20"></div>
            <h3 className="font-bold text-lg text-gray-900 mb-5 flex items-center gap-2">
              <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
              How it works
            </h3>
            <ol className="space-y-4 text-sm relative">
              {[
                { num: '1', text: 'Select your interview type and topic', color: 'from-blue-500 to-blue-600' },
                { num: '2', text: 'AI generates personalized questions', color: 'from-purple-500 to-purple-600' },
                { num: '3', text: 'Answer questions in the interview room', color: 'from-pink-500 to-pink-600' },
                { num: '4', text: 'Get instant AI feedback and scoring', color: 'from-green-500 to-green-600' },
              ].map((step) => (
                <li key={step.num} className="flex gap-4 items-start group">
                  <span className={`flex-shrink-0 w-8 h-8 bg-gradient-to-br ${step.color} text-white rounded-xl flex items-center justify-center text-sm font-bold shadow-md group-hover:scale-110 transition-transform`}>
                    {step.num}
                  </span>
                  <span className="text-gray-700 leading-relaxed pt-1">{step.text}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Pro Tips */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-50 p-6 shadow-xl border border-orange-200/50">
            <div className="absolute top-0 right-0 text-6xl opacity-10">💡</div>
            <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-2xl">💡</span>
              Pro Tips
            </h3>
            <ul className="space-y-3 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-orange-500 font-bold mt-0.5">•</span>
                <span>Be specific with your topic for better questions</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500 font-bold mt-0.5">•</span>
                <span>Start with easier questions to build confidence</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500 font-bold mt-0.5">•</span>
                <span>Practice regularly for best results</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500 font-bold mt-0.5">•</span>
                <span>Review feedback after each session</span>
              </li>
            </ul>
          </div>

          {/* Stats Card */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 p-6 shadow-xl text-white">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full blur-3xl opacity-10"></div>
            <div className="relative">
              <div className="text-4xl font-extrabold mb-2">10k+</div>
              <div className="text-blue-100 text-sm">Interviews completed</div>
              <div className="mt-4 pt-4 border-t border-white/20">
                <div className="text-2xl font-bold mb-1">95%</div>
                <div className="text-blue-100 text-sm">Success rate</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
