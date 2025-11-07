import nodemailer from 'nodemailer';
import { logger } from '../utils/logger';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

interface InterviewInviteData {
  candidateName: string;
  interviewerName: string;
  interviewerEmail: string;
  topic: string;
  type: string;
  scheduledAt: string;
  duration: number;
  roomLink: string;
}

// Create transporter
const createTransporter = () => {
  // For development, use ethereal.email test account
  // For production, configure with real SMTP (Gmail, SendGrid, etc.)
  
  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  
  // Fallback: log emails instead of sending
  logger.warn('Email service not configured. Emails will be logged instead.');
  return null;
};

const transporter = createTransporter();

export const sendEmail = async (options: EmailOptions): Promise<boolean> => {
  try {
    if (!transporter) {
      logger.info(`[EMAIL LOG] To: ${options.to}`);
      logger.info(`[EMAIL LOG] Subject: ${options.subject}`);
      logger.info(`[EMAIL LOG] Body: ${options.text || options.html}`);
      return true;
    }

    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'PrepForge <noreply@prepforge.com>',
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    });

    logger.info(`Email sent to ${options.to}: ${options.subject}`);
    return true;
  } catch (error) {
    logger.error('Email sending failed:', error);
    return false;
  }
};

export const sendInterviewInvitation = async (data: InterviewInviteData): Promise<boolean> => {
  const { interviewerEmail, interviewerName, candidateName, topic, type, scheduledAt, duration, roomLink } = data;

  const subject = `🎯 Interview Invitation: ${topic}`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
        .detail-box { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #667eea; }
        .detail-row { margin: 10px 0; }
        .label { font-weight: bold; color: #667eea; }
        .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .footer { text-align: center; color: #6b7280; font-size: 14px; margin-top: 30px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎯 You've Been Invited to Conduct an Interview!</h1>
        </div>
        <div class="content">
          <p>Hi <strong>${interviewerName}</strong>,</p>
          <p><strong>${candidateName}</strong> has scheduled a live interview and selected you as the interviewer.</p>
          
          <div class="detail-box">
            <div class="detail-row"><span class="label">Topic:</span> ${topic}</div>
            <div class="detail-row"><span class="label">Type:</span> ${type}</div>
            <div class="detail-row"><span class="label">Scheduled:</span> ${new Date(scheduledAt).toLocaleString('en-US', { 
              dateStyle: 'full', 
              timeStyle: 'short' 
            })}</div>
            <div class="detail-row"><span class="label">Duration:</span> ${duration} minutes</div>
          </div>

          <p>When the time comes, join the interview room using the button below:</p>
          <center>
            <a href="${roomLink}" class="button">Join Interview Room</a>
          </center>

          <p style="margin-top: 30px;">
            <strong>Tips for interviewers:</strong><br>
            • Review the topic beforehand<br>
            • Prepare relevant questions<br>
            • Join 5 minutes early to test your connection<br>
            • Be constructive with feedback
          </p>

          <div class="footer">
            <p>This is an automated notification from PrepForge.<br>
            If you did not expect this invitation, please contact the candidate.</p>
            <p style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #e5e7eb;">
              <strong>Need Support?</strong><br>
              Email: <a href="mailto:prepforge563@gmail.com" style="color: #667eea;">prepforge563@gmail.com</a> | 
              Phone: <a href="tel:+917232915352" style="color: #667eea;">+91 7232915352</a>
            </p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
You've Been Invited to Conduct an Interview!

Hi ${interviewerName},

${candidateName} has scheduled a live interview and selected you as the interviewer.

Interview Details:
- Topic: ${topic}
- Type: ${type}
- Scheduled: ${new Date(scheduledAt).toLocaleString()}
- Duration: ${duration} minutes

Join the interview room: ${roomLink}

Tips for interviewers:
• Review the topic beforehand
• Prepare relevant questions
• Join 5 minutes early to test your connection
• Be constructive with feedback

---
PrepForge Interview Platform
  `;

  return sendEmail({
    to: interviewerEmail,
    subject,
    html,
    text,
  });
};

export const sendInterviewReminder = async (
  email: string, 
  name: string, 
  topic: string, 
  scheduledAt: string,
  roomLink: string
): Promise<boolean> => {
  const subject = `⏰ Interview Reminder: ${topic} in 1 hour`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #f59e0b; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
        .button { display: inline-block; background: #f59e0b; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>⏰ Interview Starting Soon!</h1>
        </div>
        <div class="content">
          <p>Hi <strong>${name}</strong>,</p>
          <p>Your interview for <strong>${topic}</strong> is scheduled to start in approximately 1 hour at ${new Date(scheduledAt).toLocaleTimeString()}.</p>
          <center>
            <a href="${roomLink}" class="button">Join Interview Room</a>
          </center>
          <p><strong>Reminder:</strong> Join a few minutes early to test your audio/video connection!</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject,
    html,
    text: `Interview Reminder: Your interview for ${topic} starts in 1 hour. Join at: ${roomLink}`,
  });
};
