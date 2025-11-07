import { Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth';
import { logger } from '../utils/logger';

export const getAllUsers = async (req: AuthRequest, res: Response) => {
  try {
    const { role, subscription, limit = 50, offset = 0 } = req.query;

    const where: any = {};
    if (role) where.role = role;
    if (subscription) where.subscription = subscription;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          subscription: true,
          createdAt: true,
          _count: {
            select: {
              aiInterviews: true,
              liveInterviews: true,
            },
          },
        },
        take: Number(limit),
        skip: Number(offset),
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count({ where }),
    ]);

    res.json({
      users,
      total,
      page: Math.floor(Number(offset) / Number(limit)) + 1,
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    logger.error('Get all users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

export const getAllInterviews = async (req: AuthRequest, res: Response) => {
  try {
    const { type = 'all', status, limit = 50, offset = 0 } = req.query;

    const where: any = {};
    if (status) where.status = status;

    let interviews: any[] = [];

    if (type === 'ai' || type === 'all') {
      const aiInterviews = await prisma.aIInterview.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
        take: type === 'ai' ? Number(limit) : Math.floor(Number(limit) / 2),
        skip: Number(offset),
        orderBy: { createdAt: 'desc' },
      });
      interviews = [...interviews, ...aiInterviews.map((i) => ({ ...i, type: 'AI' }))];
    }

    if (type === 'live' || type === 'all') {
      const liveInterviews = await prisma.liveInterview.findMany({
        where,
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
        take: type === 'live' ? Number(limit) : Math.floor(Number(limit) / 2),
        skip: Number(offset),
        orderBy: { createdAt: 'desc' },
      });
      interviews = [...interviews, ...liveInterviews.map((i) => ({ ...i, type: 'LIVE' }))];
    }

    res.json({ interviews });
  } catch (error) {
    logger.error('Get all interviews error:', error);
    res.status(500).json({ error: 'Failed to fetch interviews' });
  }
};

export const getSystemStats = async (_req: AuthRequest, res: Response): Promise<any> => {
  try {
    const [
      totalUsers,
      totalAIInterviews,
      totalLiveInterviews,
      completedAI,
      completedLive,
      totalRevenue,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.aIInterview.count(),
      prisma.liveInterview.count(),
      prisma.aIInterview.count({ where: { status: 'COMPLETED' } }),
      prisma.liveInterview.count({ where: { status: 'COMPLETED' } }),
      prisma.payment.aggregate({
        where: { status: 'COMPLETED' },
        _sum: { amount: true },
      }),
    ]);

    res.json({
      totalUsers,
      totalInterviews: totalAIInterviews + totalLiveInterviews,
      totalAIInterviews,
      totalLiveInterviews,
      completedInterviews: completedAI + completedLive,
      completedAIInterviews: completedAI,
      completedLiveInterviews: completedLive,
      totalRevenue: totalRevenue._sum.amount || 0,
    });
  } catch (error) {
    logger.error('Get system stats error:', error);
    res.status(500).json({ error: 'Failed to fetch system statistics' });
  }
};

export const updateUserRole = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['CANDIDATE', 'INTERVIEWER', 'ADMIN'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const user = await prisma.user.update({
      where: { id },
      data: { role },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
      },
    });

    logger.info(`User role updated: ${id} -> ${role}`);

    res.json({
      message: 'User role updated successfully',
      user,
    });
  } catch (error) {
    logger.error('Update user role error:', error);
    res.status(500).json({ error: 'Failed to update user role' });
  }
};

export const deleteUser = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { id } = req.params;

    // Prevent self-deletion
    if (id === req.user!.id) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }

    await prisma.user.delete({
      where: { id },
    });

    logger.info(`User deleted: ${id}`);

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    logger.error('Delete user error:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
};
