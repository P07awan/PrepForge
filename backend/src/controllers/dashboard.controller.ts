import { Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth';
import { logger } from '../utils/logger';

export const getUnifiedDashboard = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const userId = req.user!.id;

    // Get interviews where user is candidate
    const candidateInterviews = await prisma.liveInterview.findMany({
      where: {
        candidateId: userId,
        status: { in: ['SCHEDULED', 'IN_PROGRESS'] },
      },
      include: {
        interviewer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            profileImage: true,
          },
        },
      },
      orderBy: { scheduledAt: 'asc' },
    });

    // Get interviews where user is interviewer
    const interviewerInterviews = await prisma.liveInterview.findMany({
      where: {
        interviewerId: userId,
        status: { in: ['SCHEDULED', 'IN_PROGRESS'] },
      },
      include: {
        candidate: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            profileImage: true,
          },
        },
      },
      orderBy: { scheduledAt: 'asc' },
    });

    // Get AI interviews
    const aiInterviews = await prisma.aIInterview.findMany({
      where: {
        userId,
        status: { in: ['SCHEDULED', 'IN_PROGRESS'] },
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    // Calculate stats
    const candidateStats = await prisma.liveInterview.aggregate({
      where: { candidateId: userId },
      _count: {
        id: true,
      },
    });

    const interviewerStats = await prisma.liveInterview.aggregate({
      where: { interviewerId: userId },
      _count: {
        id: true,
      },
    });

    const completedAsCandidate = await prisma.liveInterview.count({
      where: {
        candidateId: userId,
        status: 'COMPLETED',
      },
    });

    const completedAsInterviewer = await prisma.liveInterview.count({
      where: {
        interviewerId: userId,
        status: 'COMPLETED',
      },
    });

    const completedAI = await prisma.aIInterview.count({
      where: {
        userId,
        status: 'COMPLETED',
      },
    });

    // Get average rating as interviewer
    const ratingData = await prisma.liveInterview.aggregate({
      where: {
        interviewerId: userId,
        status: 'COMPLETED',
        score: { not: null },
      },
      _avg: {
        score: true,
      },
    });

    // Separate today's interviews
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayAsCandidate = candidateInterviews.filter(
      (interview) => {
        const interviewDate = new Date(interview.scheduledAt);
        return interviewDate >= today && interviewDate < tomorrow;
      }
    );

    const todayAsInterviewer = interviewerInterviews.filter(
      (interview) => {
        const interviewDate = new Date(interview.scheduledAt);
        return interviewDate >= today && interviewDate < tomorrow;
      }
    );

    res.json({
      candidate: {
        upcoming: candidateInterviews,
        today: todayAsCandidate,
        total: candidateStats._count.id,
        completed: completedAsCandidate,
      },
      interviewer: {
        upcoming: interviewerInterviews,
        today: todayAsInterviewer,
        total: interviewerStats._count.id,
        completed: completedAsInterviewer,
        averageRating: ratingData._avg.score || 0,
      },
      aiInterviews: {
        recent: aiInterviews,
        completed: completedAI,
      },
      stats: {
        totalUpcoming: candidateInterviews.length + interviewerInterviews.length,
        totalCompleted: completedAsCandidate + completedAsInterviewer + completedAI,
        pendingRequests: interviewerInterviews.length,
        todayTotal: todayAsCandidate.length + todayAsInterviewer.length,
      },
    });
  } catch (error) {
    logger.error('Get unified dashboard error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
};

export const getInterviewerRequests = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const userId = req.user!.id;

    const requests = await prisma.liveInterview.findMany({
      where: {
        interviewerId: userId,
        status: 'SCHEDULED',
        scheduledAt: { gte: new Date() }, // Only future interviews
      },
      include: {
        candidate: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            profileImage: true,
            bio: true,
          },
        },
      },
      orderBy: { scheduledAt: 'asc' },
    });

    res.json({ requests });
  } catch (error) {
    logger.error('Get interviewer requests error:', error);
    res.status(500).json({ error: 'Failed to fetch requests' });
  }
};

export const acceptInterviewRequest = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    // Verify user is the interviewer
    const interview = await prisma.liveInterview.findFirst({
      where: {
        id,
        interviewerId: userId,
      },
      include: {
        candidate: {
          select: {
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!interview) {
      return res.status(404).json({ error: 'Interview not found or unauthorized' });
    }

    // Update interview status (could add acceptedAt field)
    const updated = await prisma.liveInterview.update({
      where: { id },
      data: {
        updatedAt: new Date(),
      },
    });

    logger.info(`Interview ${id} accepted by interviewer ${userId}`);

    // TODO: Send confirmation email to candidate
    // await sendInterviewConfirmation(interview.candidate.email, ...);

    res.json({
      message: 'Interview accepted successfully',
      interview: updated,
    });
  } catch (error) {
    logger.error('Accept interview error:', error);
    res.status(500).json({ error: 'Failed to accept interview' });
  }
};

export const declineInterviewRequest = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    // Verify user is the interviewer
    const interview = await prisma.liveInterview.findFirst({
      where: {
        id,
        interviewerId: userId,
      },
      include: {
        candidate: {
          select: {
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!interview) {
      return res.status(404).json({ error: 'Interview not found or unauthorized' });
    }

    // Update interview status to cancelled
    const updated = await prisma.liveInterview.update({
      where: { id },
      data: {
        status: 'CANCELLED',
        updatedAt: new Date(),
      },
    });

    logger.info(`Interview ${id} declined by interviewer ${userId}`);

    // TODO: Send notification email to candidate
    // await sendInterviewDeclined(interview.candidate.email, reason, ...);

    res.json({
      message: 'Interview declined successfully',
      interview: updated,
    });
  } catch (error) {
    logger.error('Decline interview error:', error);
    res.status(500).json({ error: 'Failed to decline interview' });
  }
};
