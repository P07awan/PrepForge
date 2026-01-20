import { useState } from 'react';
import { Upload, CheckCircle, XCircle, TrendingUp, TrendingDown, Award, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ResumeMatcherPage() {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [jobRole, setJobRole] = useState('');
  const [targetCompany, setTargetCompany] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);

  const jobRoles = [
    'Software Engineer',
    'Data Scientist',
    'Product Manager',
    'Frontend Developer',
    'Backend Developer',
    'Full Stack Developer',
    'DevOps Engineer',
    'UI/UX Designer',
    'Data Analyst',
    'Mobile Developer',
    'Machine Learning Engineer',
    'Cloud Architect',
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleAnalyze = async () => {
    if (!file || !jobRole) return;
    
    setAnalyzing(true);
    
    try {
      // Create FormData to send file
      const formData = new FormData();
      formData.append('resume', file);
      formData.append('jobRole', jobRole);
      if (targetCompany) {
        formData.append('targetCompany', targetCompany);
      }

      // Upload and trigger analysis
      const token = localStorage.getItem('token');
      const uploadResponse = await fetch('http://localhost:8000/api/resumes/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload resume');
      }

      const { resumeId } = await uploadResponse.json();

      // Poll for analysis results
      let attempts = 0;
      const maxAttempts = 30; // 30 seconds max wait
      
      const pollAnalysis = async (): Promise<void> => {
        if (attempts >= maxAttempts) {
          throw new Error('Analysis timeout - please try again');
        }

        const response = await fetch(`http://localhost:8000/api/resumes/${resumeId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch analysis');
        }

        const { resume } = await response.json();

        if (resume.status === 'COMPLETED') {
          // Analysis complete - format the data
          setAnalysis({
            overallScore: resume.overallScore || 0,
            matchPercentage: resume.matchPercentage || 0,
            strengths: resume.strengths || [],
            improvements: resume.improvements || [],
            keywords: resume.keywords || { present: [], missing: [] },
            sections: resume.sections || {}
          });
          setAnalyzing(false);
        } else if (resume.status === 'FAILED') {
          throw new Error('Resume analysis failed');
        } else {
          // Still processing - poll again
          attempts++;
          await new Promise(resolve => setTimeout(resolve, 1000));
          await pollAnalysis();
        }
      };

      await pollAnalysis();
    } catch (error: any) {
      console.error('Analysis error:', error);
      alert(error.message || 'Failed to analyze resume. Please try again.');
      setAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-50 border-green-200';
    if (score >= 60) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            Resume Matcher
          </h1>
          <p className="text-gray-600 mt-1">
            Upload your resume and get AI-powered analysis with job role matching
          </p>
        </div>
      </div>

      {!analysis ? (
        <div className="space-y-6">
          {/* Upload Section */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload Resume</h2>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-400 transition-colors">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
                id="resume-upload"
              />
              <label htmlFor="resume-upload" className="cursor-pointer">
                <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                {file ? (
                  <div>
                    <p className="text-lg font-medium text-gray-900 mb-1">{file.name}</p>
                    <p className="text-sm text-gray-600">File size: {(file.size / 1024).toFixed(2)} KB</p>
                    <button className="mt-3 text-purple-600 hover:text-purple-700 font-medium">
                      Change file
                    </button>
                  </div>
                ) : (
                  <div>
                    <p className="text-lg font-medium text-gray-900 mb-1">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-sm text-gray-600">
                      PDF, DOC, or DOCX (max 5MB)
                    </p>
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* Job Role Selection */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Target Job Role</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Role *
                </label>
                <select
                  value={jobRole}
                  onChange={(e) => setJobRole(e.target.value)}
                  className="input"
                  required
                >
                  <option value="">Select a job role</option>
                  {jobRoles.map((role) => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Company (Optional)
                </label>
                <input
                  type="text"
                  value={targetCompany}
                  onChange={(e) => setTargetCompany(e.target.value)}
                  className="input"
                  placeholder="e.g., Google, Amazon, Microsoft"
                />
              </div>
            </div>
          </div>

          {/* Analyze Button */}
          <div className="card bg-purple-50 border-purple-200">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to Analyze?</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Our AI will analyze your resume against the selected job role and provide detailed feedback.
                </p>
              </div>
              <button
                onClick={handleAnalyze}
                disabled={!file || !jobRole || analyzing}
                className="btn btn-primary flex items-center gap-2 whitespace-nowrap"
              >
                {analyzing ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Award className="w-4 h-4" />
                    Analyze Resume
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Overall Score */}
          <div className={`card border-2 ${getScoreBgColor(analysis.overallScore)}`}>
            <div className="text-center">
              <Award className={`w-16 h-16 mx-auto mb-4 ${getScoreColor(analysis.overallScore)}`} />
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Analysis Complete!</h2>
              <div className={`text-6xl font-bold mb-2 ${getScoreColor(analysis.overallScore)}`}>
                {analysis.overallScore}%
              </div>
              <p className="text-xl text-gray-600 mb-1">Overall Resume Score</p>
              <p className="text-lg text-gray-600">
                {analysis.matchPercentage}% match with {jobRole}
              </p>
              <button
                onClick={() => setAnalysis(null)}
                className="mt-4 text-purple-600 hover:text-purple-700 font-medium"
              >
                Analyze Another Resume
              </button>
            </div>
          </div>

          {/* Section Scores */}
          <div className="card">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Section Analysis</h3>
            <div className="space-y-4">
              {Object.entries(analysis.sections).map(([section, data]: [string, any]) => (
                <div key={section} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700 capitalize">
                      {section}
                    </span>
                    <span className={`text-sm font-semibold ${getScoreColor(data.score)}`}>
                      {data.score}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full transition-all duration-500 ${
                        data.score >= 80 ? 'bg-green-600' : data.score >= 60 ? 'bg-yellow-600' : 'bg-red-600'
                      }`}
                      style={{ width: `${data.score}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-600">{data.feedback}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Strengths */}
            <div className="card bg-green-50 border border-green-200">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <h3 className="text-xl font-semibold text-gray-900">Strengths</h3>
              </div>
              <ul className="space-y-3">
                {analysis.strengths.map((strength: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <TrendingUp className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{strength}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Improvements */}
            <div className="card bg-yellow-50 border border-yellow-200">
              <div className="flex items-center gap-2 mb-4">
                <XCircle className="w-6 h-6 text-yellow-600" />
                <h3 className="text-xl font-semibold text-gray-900">Areas to Improve</h3>
              </div>
              <ul className="space-y-3">
                {analysis.improvements.map((improvement: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <TrendingDown className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{improvement}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Keywords */}
          <div className="card">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Keyword Analysis</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">✅ Keywords Found</h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.keywords.present.map((keyword: string, index: number) => (
                    <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">❌ Missing Keywords</h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.keywords.missing.map((keyword: string, index: number) => (
                    <span key={index} className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="card bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Next Steps</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="btn-primary" onClick={() => window.print()}>
                Download Report
              </button>
              <button className="btn-secondary" onClick={() => navigate('/resume-maker')}>
                Create New Resume
              </button>
              <button className="btn-secondary" onClick={() => setAnalysis(null)}>
                Analyze Another
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
