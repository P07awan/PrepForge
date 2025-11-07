import fs from 'fs/promises';
import path from 'path';
const pdfParse = require('pdf-parse');
import mammoth from 'mammoth';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

/**
 * Parse resume text from PDF or DOCX file
 */
export async function parseResumeText(filePath: string): Promise<string> {
  const ext = path.extname(filePath).toLowerCase();

  if (ext === '.pdf') {
    return await parsePDF(filePath);
  } else if (ext === '.docx' || ext === '.doc') {
    return await parseDOCX(filePath);
  }

  throw new Error('Unsupported file format');
}

/**
 * Parse PDF file
 */
async function parsePDF(filePath: string): Promise<string> {
  const dataBuffer = await fs.readFile(filePath);
  const data = await pdfParse(dataBuffer);
  return data.text;
}

/**
 * Parse DOCX file
 */
async function parseDOCX(filePath: string): Promise<string> {
  const dataBuffer = await fs.readFile(filePath);
  const result = await mammoth.extractRawText({ buffer: dataBuffer });
  return result.value;
}

/**
 * Analyze resume with AI
 */
export async function analyzeResumeWithAI(
  resumeText: string,
  jobRole: string,
  targetCompany?: string
): Promise<{
  overallScore: number;
  strengths: string[];
  improvements: string[];
  keywords: { present: string[]; missing: string[] };
  sections: Record<string, number>;
  detailedAnalysis: string;
}> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const companyContext = targetCompany
      ? `for the company ${targetCompany}`
      : 'for this job role';

    const prompt = `
You are an expert resume reviewer and career coach. Analyze the following resume ${companyContext} as a ${jobRole}.

Resume Content:
${resumeText}

Please provide a comprehensive analysis in JSON format with the following structure:
{
  "overallScore": <number 0-100>,
  "strengths": [<list of 4-6 key strengths>],
  "improvements": [<list of 5-8 specific, actionable improvements>],
  "keywords": {
    "present": [<list of relevant keywords found in the resume>],
    "missing": [<list of important keywords that should be added>]
  },
  "sections": {
    "summary": <score 0-100>,
    "experience": <score 0-100>,
    "skills": <score 0-100>,
    "education": <score 0-100>,
    "formatting": <score 0-100>
  },
  "detailedAnalysis": "<2-3 paragraph detailed analysis>"
}

Focus on:
1. Relevance to ${jobRole} role
2. Technical skills alignment
3. Quantifiable achievements
4. Professional presentation
5. ATS optimization
6. Keyword optimization for ${jobRole}
${targetCompany ? `7. Cultural fit for ${targetCompany}` : ''}

Provide ONLY the JSON response, no additional text.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Try to extract JSON from response
    let jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      // If no JSON found, try to parse the entire response
      jsonMatch = [text];
    }

    const analysis = JSON.parse(jsonMatch[0]);

    // Validate and normalize the response
    return {
      overallScore: Math.min(100, Math.max(0, analysis.overallScore || 0)),
      strengths: Array.isArray(analysis.strengths) ? analysis.strengths : [],
      improvements: Array.isArray(analysis.improvements) ? analysis.improvements : [],
      keywords: {
        present: Array.isArray(analysis.keywords?.present) ? analysis.keywords.present : [],
        missing: Array.isArray(analysis.keywords?.missing) ? analysis.keywords.missing : [],
      },
      sections: {
        summary: analysis.sections?.summary || 0,
        experience: analysis.sections?.experience || 0,
        skills: analysis.sections?.skills || 0,
        education: analysis.sections?.education || 0,
        formatting: analysis.sections?.formatting || 0,
      },
      detailedAnalysis: analysis.detailedAnalysis || 'Analysis completed successfully.',
    };
  } catch (error) {
    console.error('AI analysis error:', error);

    // Fallback to basic analysis if AI fails
    return generateFallbackAnalysis(resumeText, jobRole);
  }
}

/**
 * Calculate match score based on keyword matching
 */
export function calculateMatchScore(resumeText: string, jobRole: string): number {
  const lowerText = resumeText.toLowerCase();
  const roleKeywords = getJobRoleKeywords(jobRole);

  let matchCount = 0;
  roleKeywords.forEach((keyword) => {
    if (lowerText.includes(keyword.toLowerCase())) {
      matchCount++;
    }
  });

  const matchPercentage = (matchCount / roleKeywords.length) * 100;
  return Math.round(matchPercentage);
}

/**
 * Get keywords for specific job roles
 */
function getJobRoleKeywords(jobRole: string): string[] {
  const keywordMap: Record<string, string[]> = {
    'Software Engineer': [
      'programming',
      'coding',
      'software development',
      'algorithms',
      'data structures',
      'version control',
      'git',
      'testing',
      'debugging',
      'agile',
      'scrum',
    ],
    'Data Scientist': [
      'machine learning',
      'python',
      'statistics',
      'data analysis',
      'pandas',
      'numpy',
      'scikit-learn',
      'tensorflow',
      'pytorch',
      'sql',
      'visualization',
    ],
    'Product Manager': [
      'product strategy',
      'roadmap',
      'stakeholder management',
      'user research',
      'agile',
      'sprint planning',
      'metrics',
      'kpi',
      'market analysis',
      'competitive analysis',
    ],
    'Frontend Developer': [
      'html',
      'css',
      'javascript',
      'react',
      'vue',
      'angular',
      'responsive design',
      'ui/ux',
      'webpack',
      'typescript',
    ],
    'Backend Developer': [
      'api',
      'rest',
      'database',
      'sql',
      'node.js',
      'python',
      'java',
      'microservices',
      'server',
      'authentication',
    ],
    'Full Stack Developer': [
      'frontend',
      'backend',
      'database',
      'api',
      'react',
      'node.js',
      'sql',
      'deployment',
      'cloud',
      'devops',
    ],
    'DevOps Engineer': [
      'ci/cd',
      'docker',
      'kubernetes',
      'jenkins',
      'aws',
      'azure',
      'terraform',
      'monitoring',
      'automation',
      'linux',
    ],
    'UI/UX Designer': [
      'user experience',
      'user interface',
      'wireframes',
      'prototypes',
      'figma',
      'sketch',
      'adobe xd',
      'user research',
      'usability',
      'design systems',
    ],
    'Data Analyst': [
      'data analysis',
      'excel',
      'sql',
      'tableau',
      'power bi',
      'statistics',
      'reporting',
      'visualization',
      'business intelligence',
      'kpi',
    ],
    'Mobile Developer': [
      'ios',
      'android',
      'react native',
      'flutter',
      'swift',
      'kotlin',
      'mobile ui',
      'app store',
      'play store',
      'mobile optimization',
    ],
    'Machine Learning Engineer': [
      'machine learning',
      'deep learning',
      'neural networks',
      'tensorflow',
      'pytorch',
      'nlp',
      'computer vision',
      'model deployment',
      'mlops',
      'feature engineering',
    ],
    'Cloud Architect': [
      'cloud infrastructure',
      'aws',
      'azure',
      'gcp',
      'serverless',
      'scalability',
      'security',
      'cost optimization',
      'architecture design',
      'cloud migration',
    ],
  };

  return keywordMap[jobRole] || [
    'professional',
    'experience',
    'skills',
    'projects',
    'education',
    'leadership',
    'teamwork',
    'communication',
  ];
}

/**
 * Generate fallback analysis if AI fails
 */
function generateFallbackAnalysis(
  resumeText: string,
  jobRole: string
): {
  overallScore: number;
  strengths: string[];
  improvements: string[];
  keywords: { present: string[]; missing: string[] };
  sections: Record<string, number>;
  detailedAnalysis: string;
} {
  const lowerText = resumeText.toLowerCase();
  const roleKeywords = getJobRoleKeywords(jobRole);

  const presentKeywords: string[] = [];
  const missingKeywords: string[] = [];

  roleKeywords.forEach((keyword) => {
    if (lowerText.includes(keyword.toLowerCase())) {
      presentKeywords.push(keyword);
    } else {
      missingKeywords.push(keyword);
    }
  });

  const matchScore = calculateMatchScore(resumeText, jobRole);

  return {
    overallScore: matchScore,
    strengths: [
      'Resume structure is clear and organized',
      'Contains relevant work experience',
      `${presentKeywords.length} relevant keywords found`,
      'Professional presentation',
    ],
    improvements: [
      `Add missing keywords: ${missingKeywords.slice(0, 3).join(', ')}`,
      'Include more quantifiable achievements',
      'Add specific technical skills',
      'Enhance the professional summary',
      'Include relevant certifications',
    ],
    keywords: {
      present: presentKeywords,
      missing: missingKeywords,
    },
    sections: {
      summary: 70,
      experience: matchScore,
      skills: Math.min(100, (presentKeywords.length / roleKeywords.length) * 100),
      education: 75,
      formatting: 80,
    },
    detailedAnalysis: `Your resume shows ${matchScore}% match with the ${jobRole} role. The document contains ${presentKeywords.length} out of ${roleKeywords.length} key industry keywords. Consider adding more specific achievements and technical skills to strengthen your application. Focus on quantifiable results and industry-specific terminology to improve your resume's impact.`,
  };
}
