import { Response } from 'express';
import { validationResult } from 'express-validator';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth';
import { logger } from '../utils/logger';
import { generateAIQuestions, analyzeResponse } from '../services/ai.service';

export const createAIInterview = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { interviewType, topic, difficulty = 'MEDIUM', duration } = req.body;
    const userId = req.user!.id;

    // Create interview
    const interview = await prisma.aIInterview.create({
      data: {
        userId,
        interviewType,
        topic,
        difficulty,
        duration,
        status: 'IN_PROGRESS',
        startedAt: new Date(),
      },
    });

    // Generate initial questions
    const questions = await generateAIQuestions(interviewType, topic, difficulty, 5);

    // Save questions
    await prisma.question.createMany({
      data: questions.map((q, index) => ({
        aiInterviewId: interview.id,
        questionText: q.text,
        questionType: q.type as any,
        expectedAnswer: q.expectedAnswer,
        difficulty: q.difficulty || difficulty,
        topic,
        order: index + 1,
      })),
    });

    // Fetch interview with questions
    const interviewWithQuestions = await prisma.aIInterview.findUnique({
      where: { id: interview.id },
      include: {
        questions: {
          orderBy: { order: 'asc' },
        },
      },
    });

    logger.info(`AI Interview created: ${interview.id}`);

    res.status(201).json({
      message: 'AI Interview started successfully',
      interview: interviewWithQuestions,
    });
  } catch (error) {
    logger.error('Create AI interview error:', error);
    res.status(500).json({ error: 'Failed to create AI interview' });
  }
};

export const getAIInterview = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const interview = await prisma.aIInterview.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        questions: {
          orderBy: { order: 'asc' },
        },
        responses: true,
      },
    });

    if (!interview) {
      return res.status(404).json({ error: 'Interview not found' });
    }

    res.json({ interview });
  } catch (error) {
    logger.error('Get AI interview error:', error);
    res.status(500).json({ error: 'Failed to fetch interview' });
  }
};

export const getUserAIInterviews = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { status, limit = 20, offset = 0 } = req.query;

    const where: any = { userId };
    if (status) {
      where.status = status;
    }

    const interviews = await prisma.aIInterview.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: Number(limit),
      skip: Number(offset),
      include: {
        questions: {
          select: { id: true },
        },
        responses: {
          select: { id: true },
        },
      },
    });

    res.json({ interviews });
  } catch (error) {
    logger.error('Get user AI interviews error:', error);
    res.status(500).json({ error: 'Failed to fetch interviews' });
  }
};

export const submitResponse = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const { questionId, responseText, audioUrl, responseTime } = req.body;
    const userId = req.user!.id;

    // Verify interview ownership
    const interview = await prisma.aIInterview.findFirst({
      where: { id, userId },
      include: {
        questions: {
          where: { id: questionId },
        },
      },
    });

    if (!interview) {
      return res.status(404).json({ error: 'Interview not found' });
    }

    if (interview.questions.length === 0) {
      return res.status(404).json({ error: 'Question not found' });
    }

    const question = interview.questions[0];

    // Analyze response with AI
    const analysis = await analyzeResponse(
      question.questionText,
      responseText,
      interview.interviewType
    );

    // Save response
    const response = await prisma.response.create({
      data: {
        questionId,
        aiInterviewId: id,
        responseText,
        audioUrl,
        responseTime,
        confidence: analysis.confidence,
        technicalScore: analysis.technicalScore,
        communicationScore: analysis.communicationScore,
        aiAnalysis: analysis,
      },
    });

    logger.info(`Response submitted for question ${questionId}`);

    res.status(201).json({
      message: 'Response submitted successfully',
      response,
      analysis,
    });
  } catch (error) {
    logger.error('Submit response error:', error);
    res.status(500).json({ error: 'Failed to submit response' });
  }
};

export const completeInterview = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    // Verify interview ownership
    const interview = await prisma.aIInterview.findFirst({
      where: { id, userId },
      include: {
        responses: true,
      },
    });

    if (!interview) {
      return res.status(404).json({ error: 'Interview not found' });
    }

    if (interview.status === 'COMPLETED') {
      return res.status(400).json({ error: 'Interview already completed' });
    }

    // Calculate overall score
    const avgTechnical =
      interview.responses.reduce((sum, r) => sum + (r.technicalScore || 0), 0) /
      interview.responses.length;
    const avgCommunication =
      interview.responses.reduce((sum, r) => sum + (r.communicationScore || 0), 0) /
      interview.responses.length;
    const avgConfidence =
      interview.responses.reduce((sum, r) => sum + (r.confidence || 0), 0) /
      interview.responses.length;

    const overallScore = (avgTechnical + avgCommunication + avgConfidence) / 3;

    // Generate feedback
    const feedback = {
      overallScore,
      technicalScore: avgTechnical,
      communicationScore: avgCommunication,
      confidenceScore: avgConfidence,
      strengths: [],
      improvements: [],
      tips: [],
    };

    // Update interview
    const updatedInterview = await prisma.aIInterview.update({
      where: { id },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
        score: overallScore,
        feedback,
      },
      include: {
        questions: true,
        responses: true,
      },
    });

    logger.info(`AI Interview completed: ${id}`);

    res.json({
      message: 'Interview completed successfully',
      interview: updatedInterview,
    });
  } catch (error) {
    logger.error('Complete interview error:', error);
    res.status(500).json({ error: 'Failed to complete interview' });
  }
};
