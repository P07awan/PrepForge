import { Request, Response } from 'express';
import { PrismaClient, ResumeStatus } from '@prisma/client';
import * as resumeMatcherService from '../services/resumeMatcher.service';
import fs from 'fs/promises';

const prisma = new PrismaClient();

/**
 * Upload and analyze a resume
 * POST /api/resumes/upload
 */
export const uploadResume = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    // Check if file was uploaded
    if (!req.file) {
      res.status(400).json({ message: 'No file uploaded' });
      return;
    }

    const { jobRole, targetCompany } = req.body;

    if (!jobRole) {
      // Clean up uploaded file
      await fs.unlink(req.file.path);
      res.status(400).json({ message: 'Job role is required' });
      return;
    }

    // Create resume record with PROCESSING status
    const resume = await prisma.resume.create({
      data: {
        userId,
        fileName: req.file.originalname,
        fileUrl: req.file.path,
        fileSize: req.file.size,
        fileType: req.file.mimetype,
        jobRole,
        targetCompany: targetCompany || null,
        status: ResumeStatus.PROCESSING,
      },
    });

    // Start async analysis (don't wait for it)
    analyzeResumeAsync(resume.id, req.file.path, jobRole, targetCompany);

    res.status(201).json({
      message: 'Resume uploaded successfully',
      resumeId: resume.id,
      status: ResumeStatus.PROCESSING,
    });
  } catch (error: any) {
    console.error('Upload resume error:', error);
    
    // Clean up file if upload fails
    if (req.file) {
      try {
        await fs.unlink(req.file.path);
      } catch (unlinkError) {
        console.error('Error deleting file:', unlinkError);
      }
    }
    
    res.status(500).json({ message: 'Failed to upload resume', error: error.message });
  }
};

/**
 * Async function to analyze resume in background
 */
async function analyzeResumeAsync(
  resumeId: string,
  filePath: string,
  jobRole: string,
  targetCompany?: string
) {
  try {
    // Parse resume text
    const resumeText = await resumeMatcherService.parseResumeText(filePath);

    // Analyze with AI
    const analysis = await resumeMatcherService.analyzeResumeWithAI(
      resumeText,
      jobRole,
      targetCompany
    );

    // Calculate match score
    const matchScore = resumeMatcherService.calculateMatchScore(resumeText, jobRole);

    // Update resume with analysis results
    await prisma.resume.update({
      where: { id: resumeId },
      data: {
        analysis: analysis.detailedAnalysis,
        overallScore: analysis.overallScore,
        matchPercentage: matchScore,
        strengths: analysis.strengths,
        improvements: analysis.improvements,
        keywords: analysis.keywords,
        sections: analysis.sections,
        status: ResumeStatus.COMPLETED,
        processedAt: new Date(),
      },
    });

    console.log(`Resume ${resumeId} analyzed successfully`);
  } catch (error) {
    console.error(`Error analyzing resume ${resumeId}:`, error);

    // Update status to FAILED
    await prisma.resume.update({
      where: { id: resumeId },
      data: {
        status: ResumeStatus.FAILED,
        processedAt: new Date(),
      },
    });
  }
}

/**
 * Get all resumes for the authenticated user
 * GET /api/resumes
 */
export const getMyResumes = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const resumes = await prisma.resume.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        fileName: true,
        fileSize: true,
        fileType: true,
        jobRole: true,
        targetCompany: true,
        overallScore: true,
        matchPercentage: true,
        status: true,
        processedAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.json({ resumes });
  } catch (error: any) {
    console.error('Get resumes error:', error);
    res.status(500).json({ message: 'Failed to fetch resumes', error: error.message });
  }
};

/**
 * Get detailed analysis for a specific resume
 * GET /api/resumes/:id
 */
export const getResumeDetails = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const { id } = req.params;

    const resume = await prisma.resume.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!resume) {
      res.status(404).json({ message: 'Resume not found' });
      return;
    }

    res.json({ resume });
  } catch (error: any) {
    console.error('Get resume details error:', error);
    res.status(500).json({ message: 'Failed to fetch resume details', error: error.message });
  }
};

/**
 * Delete a resume and its file
 * DELETE /api/resumes/:id
 */
export const deleteResumeById = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const { id } = req.params;

    const resume = await prisma.resume.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!resume) {
      res.status(404).json({ message: 'Resume not found' });
      return;
    }

    // Delete file from filesystem
    try {
      await fs.unlink(resume.fileUrl);
    } catch (unlinkError) {
      console.error('Error deleting file:', unlinkError);
      // Continue even if file deletion fails
    }

    // Delete from database
    await prisma.resume.delete({
      where: { id },
    });

    res.json({ message: 'Resume deleted successfully' });
  } catch (error: any) {
    console.error('Delete resume error:', error);
    res.status(500).json({ message: 'Failed to delete resume', error: error.message });
  }
};
