import { Response } from 'express';
import { validationResult } from 'express-validator';
import { randomBytes } from 'crypto';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth';
import { logger } from '../utils/logger';
import { sendInterviewInvitation } from '../services/email.service';

export const scheduleLiveInterview = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { interviewType, topic, scheduledAt, duration, interviewerId } = req.body;
    const candidateId = req.user!.id;

    // Generate unique room ID
    const roomId = randomBytes(16).toString('hex');

    // Create interview
    const interview = await prisma.liveInterview.create({
      data: {
        candidateId,
        interviewerId,
        interviewType,
        topic,
        scheduledAt: new Date(scheduledAt),
        duration,
        roomId,
        status: 'SCHEDULED',
      },
      include: {
        candidate: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        interviewer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    logger.info(`Live interview scheduled: ${interview.id}`);

    // Send email notification to interviewer if assigned
    if (interview.interviewer && interview.interviewer.email) {
      const candidateName = `${interview.candidate.firstName} ${interview.candidate.lastName}`;
      const interviewerName = `${interview.interviewer.firstName} ${interview.interviewer.lastName}`;
      const roomLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/interview-room/${interview.id}`;

      sendInterviewInvitation({
        candidateName,
        interviewerName,
        interviewerEmail: interview.interviewer.email,
        topic,
        type: interviewType,
        scheduledAt: interview.scheduledAt.toISOString(),
        duration,
        roomLink,
      }).catch((error) => {
        logger.error('Failed to send interview invitation email:', error);
        // Don't fail the request if email sending fails
      });

      logger.info(`Invitation email queued for ${interview.interviewer.email}`);
    }

    res.status(201).json({
      message: 'Live interview scheduled successfully',
      interview,
    });
  } catch (error) {
    logger.error('Schedule live interview error:', error);
    res.status(500).json({ error: 'Failed to schedule interview' });
  }
};

export const getLiveInterview = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const interview = await prisma.liveInterview.findFirst({
      where: {
        id,
        OR: [{ candidateId: userId }, { interviewerId: userId }],
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
        interviewer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            profileImage: true,
          },
        },
        questions: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!interview) {
      return res.status(404).json({ error: 'Interview not found' });
    }

    res.json({ interview });
  } catch (error) {
    logger.error('Get live interview error:', error);
    res.status(500).json({ error: 'Failed to fetch interview' });
  }
};

export const getUserLiveInterviews = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { status, role = 'candidate', limit = 20, offset = 0 } = req.query;

    const where: any =
      role === 'interviewer' ? { interviewerId: userId } : { candidateId: userId };

    if (status) {
      where.status = status;
    }

    const interviews = await prisma.liveInterview.findMany({
      where,
      orderBy: { scheduledAt: 'desc' },
      take: Number(limit),
      skip: Number(offset),
      include: {
        candidate: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        interviewer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    res.json({ interviews });
  } catch (error) {
    logger.error('Get user live interviews error:', error);
    res.status(500).json({ error: 'Failed to fetch interviews' });
  }
};

export const joinInterview = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const interview = await prisma.liveInterview.findFirst({
      where: {
        id,
        OR: [{ candidateId: userId }, { interviewerId: userId }],
      },
    });

    if (!interview) {
      return res.status(404).json({ error: 'Interview not found' });
    }

    if (interview.status === 'COMPLETED') {
      return res.status(400).json({ error: 'Interview already completed' });
    }

    // Update status to IN_PROGRESS if not already
    if (interview.status === 'SCHEDULED') {
      await prisma.liveInterview.update({
        where: { id },
        data: {
          status: 'IN_PROGRESS',
          startedAt: new Date(),
        },
      });
    }

    // Generate WebRTC credentials/tokens (implement based on your WebRTC setup)
    const credentials = {
      roomId: interview.roomId,
      // Add TURN server credentials if needed
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        // Add TURN servers from env if configured
      ],
    };

    logger.info(`User ${userId} joined interview ${id}`);

    res.json({
      message: 'Joined interview successfully',
      credentials,
    });
  } catch (error) {
    logger.error('Join interview error:', error);
    res.status(500).json({ error: 'Failed to join interview' });
  }
};

export const completeInterview = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const { score, feedback, transcription, analytics } = req.body;
    const userId = req.user!.id;

    // Verify interviewer
    const interview = await prisma.liveInterview.findFirst({
      where: { id, interviewerId: userId },
    });

    if (!interview) {
      return res.status(404).json({ error: 'Interview not found' });
    }

    // Update interview
    const updatedInterview = await prisma.liveInterview.update({
      where: { id },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
        score,
        feedback,
        transcription,
        analytics,
      },
      include: {
        candidate: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    logger.info(`Live interview completed: ${id}`);

    res.json({
      message: 'Interview completed successfully',
      interview: updatedInterview,
    });
  } catch (error) {
    logger.error('Complete live interview error:', error);
    res.status(500).json({ error: 'Failed to complete interview' });
  }
};
