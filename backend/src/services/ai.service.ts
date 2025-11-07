import Groq from 'groq-sdk';
import OpenAI from 'openai';
import { logger } from '../utils/logger';

// Initialize AI clients
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const USE_GROQ = process.env.GROQ_API_KEY ? true : false;

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

    let response;

    if (USE_GROQ) {
      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'You are an expert technical interviewer. Generate realistic interview questions.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        model: 'llama-3.1-70b-versatile',
        temperature: 0.7,
        max_tokens: 2000,
      });
      response = completion.choices[0]?.message?.content;
    } else {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: 'You are an expert technical interviewer. Generate realistic interview questions.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      });
      response = completion.choices[0]?.message?.content;
    }

    if (!response) {
      throw new Error('No response from AI');
    }

    // Parse JSON response
    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('Invalid JSON response from AI');
    }

    const questions: Question[] = JSON.parse(jsonMatch[0]);
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

    let analysisResponse;

    if (USE_GROQ) {
      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'You are an expert interviewer analyzing candidate responses.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        model: 'llama-3.1-70b-versatile',
        temperature: 0.5,
        max_tokens: 1000,
      });
      analysisResponse = completion.choices[0]?.message?.content;
    } else {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: 'You are an expert interviewer analyzing candidate responses.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.5,
        max_tokens: 1000,
      });
      analysisResponse = completion.choices[0]?.message?.content;
    }

    if (!analysisResponse) {
      throw new Error('No analysis response from AI');
    }

    // Parse JSON response
    const jsonMatch = analysisResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid JSON response from AI');
    }

    const analysis = JSON.parse(jsonMatch[0]);
    return analysis;
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
    // This would use Whisper API for audio transcription
    // Placeholder implementation
    const transcription = await openai.audio.transcriptions.create({
      file: audioBuffer as any,
      model: 'whisper-1',
    });

    return transcription.text;
  } catch (error) {
    logger.error('Transcribe audio error:', error);
    throw error;
  }
};
