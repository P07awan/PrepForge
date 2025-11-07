import { CheckCircle, XCircle, AlertCircle, TrendingUp, TrendingDown, Award } from 'lucide-react';

interface FeedbackProps {
  interview: {
    id: string;
    interviewType: string;
    topic: string;
    difficulty: string;
    score?: number;
    feedback?: {
      overallScore?: number;
      strengths?: string[];
      improvements?: string[];
      detailedAnalysis?: string;
      categoryScores?: {
        technical?: number;
        communication?: number;
        problemSolving?: number;
        clarity?: number;
      };
    };
    completedAt?: string;
  };
}

export default function InterviewFeedback({ interview }: FeedbackProps) {
  const feedback = interview.feedback || {};
  const overallScore = feedback.overallScore || interview.score || 0;
  
  // Determine score color and rating
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreRating = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Very Good';
    if (score >= 70) return 'Good';
    if (score >= 60) return 'Average';
    return 'Needs Improvement';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-50 border-green-200';
    if (score >= 60) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  return (
    <div className="space-y-6">
      {/* Overall Score Card */}
      <div className={`card border-2 ${getScoreBgColor(overallScore)}`}>
        <div className="text-center">
          <Award className={`w-16 h-16 mx-auto mb-4 ${getScoreColor(overallScore)}`} />
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Interview Complete!
          </h2>
          <div className={`text-6xl font-bold mb-2 ${getScoreColor(overallScore)}`}>
            {overallScore.toFixed(1)}%
          </div>
          <p className="text-xl text-gray-600">{getScoreRating(overallScore)}</p>
          <div className="mt-4 text-sm text-gray-500">
            {interview.interviewType} • {interview.topic} • {interview.difficulty}
          </div>
        </div>
      </div>

      {/* Category Scores */}
      {feedback.categoryScores && (
        <div className="card">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Performance Breakdown</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(feedback.categoryScores).map(([category, score]) => (
              <div key={category} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700 capitalize">
                    {category.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <span className={`text-sm font-semibold ${getScoreColor(score)}`}>
                    {score}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full transition-all duration-500 ${
                      score >= 80 ? 'bg-green-600' : score >= 60 ? 'bg-yellow-600' : 'bg-red-600'
                    }`}
                    style={{ width: `${score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Strengths */}
        {feedback.strengths && feedback.strengths.length > 0 && (
          <div className="card bg-green-50 border border-green-200">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <h3 className="text-xl font-semibold text-gray-900">Strengths</h3>
            </div>
            <ul className="space-y-3">
              {feedback.strengths.map((strength, index) => (
                <li key={index} className="flex items-start gap-2">
                  <TrendingUp className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{strength}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Areas for Improvement */}
        {feedback.improvements && feedback.improvements.length > 0 && (
          <div className="card bg-yellow-50 border border-yellow-200">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="w-6 h-6 text-yellow-600" />
              <h3 className="text-xl font-semibold text-gray-900">Areas to Improve</h3>
            </div>
            <ul className="space-y-3">
              {feedback.improvements.map((improvement, index) => (
                <li key={index} className="flex items-start gap-2">
                  <TrendingDown className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{improvement}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Detailed Analysis */}
      {feedback.detailedAnalysis && (
        <div className="card">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <XCircle className="w-6 h-6 text-primary-600" />
            Detailed Feedback
          </h3>
          <div className="prose max-w-none">
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {feedback.detailedAnalysis}
            </p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="card bg-gray-50">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Next Steps</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => window.location.href = '/ai-interview'}
            className="btn-primary"
          >
            Practice Again
          </button>
          <button
            onClick={() => window.location.href = '/dashboard'}
            className="btn-secondary"
          >
            View Dashboard
          </button>
          <button
            onClick={() => window.print()}
            className="btn-secondary"
          >
            Download Report
          </button>
        </div>
      </div>
    </div>
  );
}
