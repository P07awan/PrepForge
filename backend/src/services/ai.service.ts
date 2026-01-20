import axios from 'axios';
import { logger } from '../utils/logger';

// ML Model API Configuration
const ML_MODEL_API_URL = process.env.ML_MODEL_API_URL || 'http://localhost:5000';
const ML_MODEL_API_KEY = process.env.ML_MODEL_API_KEY || '';

interface Question {
  text: string;
  type: string;
  expectedAnswer?: string;
  difficulty?: string;
}

export const generateAIQuestions = async (
  interviewType: string,
  topic: string,
  difficulty: string,
  count: number = 5
): Promise<Question[]> => {
  try {
    const prompt = `Generate ${count} ${difficulty} level ${interviewType} interview questions about ${topic}. 
    Return a JSON array of objects with fields: text (question text), type (question type), expectedAnswer (brief expected answer), difficulty.
    Question types can be: TECHNICAL, BEHAVIORAL, CODING, OPEN_ENDED.
    Make questions realistic and relevant to actual interviews.`;

    // Call your ML model API
    const response = await axios.post(
      `${ML_MODEL_API_URL}/api/generate-questions`,
      {
        interviewType,
        topic,
        difficulty,
        count,
        prompt,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          ...(ML_MODEL_API_KEY && { 'Authorization': `Bearer ${ML_MODEL_API_KEY}` }),
        },
        timeout: 30000, // 30 second timeout
      }
    );

    // Assuming your ML model returns { questions: [...] }
    const questions: Question[] = response.data.questions || response.data;
    
    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error('Invalid response from ML model');
    }

    return questions;
  } catch (error) {
    logger.error('Generate AI questions error:', error);
    // Return fallback questions
    return [
      {
        text: `Tell me about your experience with ${topic}`,
        type: 'OPEN_ENDED',
        difficulty,
      },
      {
        text: `What are the key concepts in ${topic}?`,
        type: 'TECHNICAL',
        difficulty,
      },
      {
        text: `Describe a challenging project involving ${topic}`,
        type: 'BEHAVIORAL',
        difficulty,
      },
    ];
  }
};

export const analyzeResponse = async (
  question: string,
  response: string,
  interviewType: string
): Promise<any> => {
  try {
    const prompt = `Analyze this interview response:
    Question: ${question}
    Response: ${response}
    Interview Type: ${interviewType}
    
    Provide analysis in JSON format with these fields:
    - confidence (0-100): How confident the candidate sounds
    - technicalScore (0-100): Technical accuracy and depth
    - communicationScore (0-100): Clarity and articulation
    - strengths (array): Key strengths demonstrated
    - improvements (array): Areas for improvement
    - feedback (string): Overall constructive feedback`;

    // Call your ML model API for analysis
    const mlResponse = await axios.post(
      `${ML_MODEL_API_URL}/api/analyze-response`,
      {
        question,
        response,
        interviewType,
        prompt,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          ...(ML_MODEL_API_KEY && { 'Authorization': `Bearer ${ML_MODEL_API_KEY}` }),
        },
        timeout: 30000,
      }
    );

    // Assuming your ML model returns the analysis object directly
    const analysis = mlResponse.data.analysis || mlResponse.data;
    
    return {
      confidence: analysis.confidence || 70,
      technicalScore: analysis.technicalScore || 70,
      communicationScore: analysis.communicationScore || 70,
      strengths: analysis.strengths || ['Response provided'],
      improvements: analysis.improvements || ['Could provide more detail'],
      feedback: analysis.feedback || 'Good attempt. Consider elaborating more on your answer.',
    };
  } catch (error) {
    logger.error('Analyze response error:', error);
    // Return default analysis
    return {
      confidence: 70,
      technicalScore: 70,
      communicationScore: 70,
      strengths: ['Attempted to answer'],
      improvements: ['Could provide more detail'],
      feedback: 'Keep practicing and improving your responses.',
    };
  }
};

export const transcribeAudio = async (audioBuffer: Buffer): Promise<string> => {
  try {
    // Call your ML model API for audio transcription
    const formData = new FormData();
    const audioBlob = new Blob([audioBuffer]);
    formData.append('audio', audioBlob, 'audio.wav');

    const transcriptionResponse = await axios.post(
      `${ML_MODEL_API_URL}/api/transcribe-audio`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...(ML_MODEL_API_KEY && { 'Authorization': `Bearer ${ML_MODEL_API_KEY}` }),
        },
        timeout: 60000, // 60 seconds for audio processing
      }
    );

    return transcriptionResponse.data.text || transcriptionResponse.data;
  } catch (error) {
    logger.error('Transcribe audio error:', error);
    throw error;
  }
};
