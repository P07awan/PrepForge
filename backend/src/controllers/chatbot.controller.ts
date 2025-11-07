import { Request, Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY || 'AIzaSyDgQEmf90jsJGEymQ-HtHO5ynl7HdyVcuY'
);

// System prompt for the chatbot
const SYSTEM_PROMPT = `You are PrepForge AI Assistant, a helpful and friendly chatbot designed to help candidates prepare for job interviews. Your role is to:

1. Provide interview preparation tips and strategies
2. Answer questions about resume writing and optimization
3. Help with technical interview preparation
4. Give advice on behavioral interview questions
5. Explain how to use the PrepForge platform
6. Provide career guidance and job search tips

Guidelines:
- Be encouraging and supportive
- Provide actionable, specific advice
- Use a friendly but professional tone
- Keep responses concise (2-3 paragraphs max)
- If asked about scheduling interviews, guide them to the "Schedule Interview" page
- If asked about AI interviews, guide them to the "AI Interview" page
- Focus on helping candidates succeed in their interview preparation

You are specifically designed for candidates, not interviewers.`;

export const chatbotController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Message is required' });
      return;
    }

    // Call Gemini API for response
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    // Combine system prompt with user message
    const prompt = `${SYSTEM_PROMPT}\n\nUser: ${message}\n\nAssistant:`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const botResponse = response.text() || 
      "I'm here to help! Could you please rephrase your question?";

    res.json({
      response: botResponse,
      timestamp: new Date().toISOString(),
    });

  } catch (error: any) {
    console.error('Chatbot error:', error);
    
    // Fallback response if API fails
    const fallbackResponses: Record<string, string> = {
      'technical': "For technical interview prep, I recommend:\n\n1. Practice coding problems on platforms like LeetCode\n2. Review data structures and algorithms\n3. Use our AI Interview feature for mock technical interviews\n4. Focus on explaining your thought process clearly",
      'resume': "Great resume tips:\n\n1. Keep it to 1-2 pages\n2. Use action verbs (achieved, developed, led)\n3. Quantify achievements with numbers\n4. Tailor it to each job description\n5. Have someone proofread it",
      'behavioral': "For behavioral interviews:\n\n1. Use the STAR method (Situation, Task, Action, Result)\n2. Prepare 5-7 stories showcasing different skills\n3. Practice with our AI Interview feature\n4. Be specific and authentic in your answers",
      'schedule': "To schedule a live interview:\n\n1. Click 'Schedule Interview' in the navigation\n2. Fill in the interview details (topic, date, time)\n3. Enter the interviewer's email\n4. Submit your request\n5. Wait for the interviewer to accept",
      'default': "I'm PrepForge AI Assistant! I can help you with interview preparation, resume advice, technical questions, and platform navigation. What would you like to know?"
    };

    // Simple keyword matching for fallback
    const userMessage = req.body.message || '';
    const lowerMessage = userMessage.toLowerCase();
    let fallbackResponse = fallbackResponses.default;

    if (lowerMessage.includes('technical') || lowerMessage.includes('coding')) {
      fallbackResponse = fallbackResponses.technical;
    } else if (lowerMessage.includes('resume') || lowerMessage.includes('cv')) {
      fallbackResponse = fallbackResponses.resume;
    } else if (lowerMessage.includes('behavioral') || lowerMessage.includes('star')) {
      fallbackResponse = fallbackResponses.behavioral;
    } else if (lowerMessage.includes('schedule') || lowerMessage.includes('book')) {
      fallbackResponse = fallbackResponses.schedule;
    }

    res.json({
      response: fallbackResponse,
      timestamp: new Date().toISOString(),
      fallback: true,
    });
  }
};
