import { Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth';
import { logger } from '../utils/logger';

export const getUserInterviews = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const userId = req.user!.id;

    const [aiInterviews, liveInterviews] = await Promise.all([
      prisma.aIInterview.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 20,
      }),
      prisma.liveInterview.findMany({
        where: { candidateId: userId },
        orderBy: { createdAt: 'desc' },
        take: 20,
      }),
    ]);

    res.json({
      aiInterviews,
      liveInterviews,
    });
  } catch (error) {
    logger.error('Get user interviews error:', error);
    res.status(500).json({ error: 'Failed to fetch interviews' });
  }
};

export const getUserStats = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const userId = req.user!.id;

    const [aiCount, liveCount, avgAIScore, avgLiveScore] = await Promise.all([
      prisma.aIInterview.count({
        where: { userId, status: 'COMPLETED' },
      }),
      prisma.liveInterview.count({
        where: { candidateId: userId, status: 'COMPLETED' },
      }),
      prisma.aIInterview.aggregate({
        where: { userId, status: 'COMPLETED', score: { not: null } },
        _avg: { score: true },
      }),
      prisma.liveInterview.aggregate({
        where: { candidateId: userId, status: 'COMPLETED', score: { not: null } },
        _avg: { score: true },
      }),
    ]);

    res.json({
      totalAIInterviews: aiCount,
      totalLiveInterviews: liveCount,
      averageAIScore: avgAIScore._avg.score || 0,
      averageLiveScore: avgLiveScore._avg.score || 0,
    });
  } catch (error) {
    logger.error('Get user stats error:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
};

export const findUserByEmail = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { email } = req.query as { email?: string };
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    const user = await prisma.user.findUnique({
      where: { email: String(email) },
      select: { id: true, firstName: true, lastName: true, email: true, role: true },
    });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.json({ user });
  } catch (error) {
    logger.error('Find user by email error:', error);
    res.status(500).json({ error: 'Failed to lookup user' });
  }
};
