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

export const sendInterviewRequestNotification = async (
  interviewerEmail: string,
  interviewerName: string,
  candidateName: string,
  candidateEmail: string,
  topic: string,
  type: string,
  scheduledAt: string,
  duration: number
): Promise<boolean> => {
  const subject = `🔔 New Interview Request from ${candidateName}`;
  
  const acceptLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/interview-requests`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
        .detail-box { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #f59e0b; }
        .detail-row { margin: 10px 0; }
        .label { font-weight: bold; color: #f59e0b; }
        .button { display: inline-block; background: #f59e0b; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .alert { background: #fef3c7; border: 1px solid #fbbf24; padding: 15px; border-radius: 6px; margin: 20px 0; }
        .footer { text-align: center; color: #6b7280; font-size: 14px; margin-top: 30px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔔 New Interview Request</h1>
        </div>
        <div class="content">
          <p>Hi <strong>${interviewerName}</strong>,</p>
          <p><strong>${candidateName}</strong> has requested you to conduct a live interview. Please review the details below and accept or decline this request.</p>
          
          <div class="detail-box">
            <h3 style="margin-top: 0; color: #f59e0b;">Interview Details</h3>
            <div class="detail-row"><span class="label">Candidate:</span> ${candidateName}</div>
            <div class="detail-row"><span class="label">Email:</span> ${candidateEmail}</div>
            <div class="detail-row"><span class="label">Topic:</span> ${topic}</div>
            <div class="detail-row"><span class="label">Type:</span> ${type}</div>
            <div class="detail-row"><span class="label">Scheduled:</span> ${new Date(scheduledAt).toLocaleString('en-US', { 
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</div>
            <div class="detail-row"><span class="label">Duration:</span> ${duration} minutes</div>
          </div>

          <div class="alert">
            <strong>⚠️ Action Required:</strong> This interview is pending your approval. Please accept or decline as soon as possible.
          </div>

          <center>
            <a href="${acceptLink}" class="button">Review Interview Requests</a>
          </center>

          <p style="margin-top: 30px; font-size: 14px; color: #6b7280;">
            You can manage all your interview requests from the "Interview Requests" page in your PrepForge dashboard.
          </p>

          <div class="footer">
            <p>This is an automated notification from PrepForge.<br>
            If you did not expect this request, you can decline it from your dashboard.</p>
            <p style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #e5e7eb;">
              <strong>Need Support?</strong><br>
              Email: <a href="mailto:prepforge563@gmail.com" style="color: #f59e0b;">prepforge563@gmail.com</a> | 
              Phone: <a href="tel:+917232915352" style="color: #f59e0b;">+91 7232915352</a>
            </p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
New Interview Request

Hi ${interviewerName},

${candidateName} has requested you to conduct a live interview.

Interview Details:
- Candidate: ${candidateName} (${candidateEmail})
- Topic: ${topic}
- Type: ${type}
- Scheduled: ${new Date(scheduledAt).toLocaleString()}
- Duration: ${duration} minutes

⚠️ ACTION REQUIRED: This interview is pending your approval.

Please visit ${acceptLink} to review and accept or decline this request.

---
PrepForge Interview Platform
Support: prepforge563@gmail.com | +91 7232915352
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

export const sendInterviewAcceptedNotification = async (
  candidateEmail: string,
  candidateName: string,
  interviewerName: string,
  topic: string,
  type: string,
  scheduledAt: string,
  duration: number,
  roomLink: string
): Promise<boolean> => {
  const subject = `✅ Interview Confirmed: ${topic}`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
        .detail-box { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #10b981; }
        .detail-row { margin: 10px 0; }
        .label { font-weight: bold; color: #10b981; }
        .button { display: inline-block; background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .success { background: #d1fae5; border: 1px solid #10b981; padding: 15px; border-radius: 6px; margin: 20px 0; color: #065f46; }
        .footer { text-align: center; color: #6b7280; font-size: 14px; margin-top: 30px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✅ Interview Confirmed!</h1>
        </div>
        <div class="content">
          <p>Hi <strong>${candidateName}</strong>,</p>
          
          <div class="success">
            <strong>🎉 Great news!</strong> ${interviewerName} has accepted your interview request.
          </div>

          <p>Your interview is now confirmed and scheduled. Here are the details:</p>
          
          <div class="detail-box">
            <h3 style="margin-top: 0; color: #10b981;">Interview Details</h3>
            <div class="detail-row"><span class="label">Interviewer:</span> ${interviewerName}</div>
            <div class="detail-row"><span class="label">Topic:</span> ${topic}</div>
            <div class="detail-row"><span class="label">Type:</span> ${type}</div>
            <div class="detail-row"><span class="label">Scheduled:</span> ${new Date(scheduledAt).toLocaleString('en-US', { 
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</div>
            <div class="detail-row"><span class="label">Duration:</span> ${duration} minutes</div>
          </div>

          <center>
            <a href="${roomLink}" class="button">Join Interview Room</a>
          </center>

          <p style="margin-top: 30px;">
            <strong>Preparation Tips:</strong><br>
            • Review the topic thoroughly<br>
            • Test your camera and microphone beforehand<br>
            • Join 5 minutes early<br>
            • Have a quiet, well-lit space ready<br>
            • Keep a copy of your resume handy
          </p>

          <div class="footer">
            <p>You'll receive a reminder 1 hour before the interview starts.<br>
            Good luck with your preparation!</p>
            <p style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #e5e7eb;">
              <strong>Need Support?</strong><br>
              Email: <a href="mailto:prepforge563@gmail.com" style="color: #10b981;">prepforge563@gmail.com</a> | 
              Phone: <a href="tel:+917232915352" style="color: #10b981;">+91 7232915352</a>
            </p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
Interview Confirmed!

Hi ${candidateName},

🎉 Great news! ${interviewerName} has accepted your interview request.

Interview Details:
- Interviewer: ${interviewerName}
- Topic: ${topic}
- Type: ${type}
- Scheduled: ${new Date(scheduledAt).toLocaleString()}
- Duration: ${duration} minutes

Join Interview: ${roomLink}

Preparation Tips:
• Review the topic thoroughly
• Test your camera and microphone beforehand
• Join 5 minutes early
• Have a quiet, well-lit space ready
• Keep a copy of your resume handy

You'll receive a reminder 1 hour before the interview starts.
Good luck with your preparation!

---
PrepForge Interview Platform
Support: prepforge563@gmail.com | +91 7232915352
  `;

  return sendEmail({
    to: candidateEmail,
    subject,
    html,
    text,
  });
};

export const sendInterviewDeclinedNotification = async (
  candidateEmail: string,
  candidateName: string,
  interviewerName: string,
  topic: string,
  scheduledAt: string
): Promise<boolean> => {
  const subject = `❌ Interview Request Declined: ${topic}`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
        .alert { background: #fee2e2; border: 1px solid #ef4444; padding: 15px; border-radius: 6px; margin: 20px 0; color: #991b1b; }
        .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .footer { text-align: center; color: #6b7280; font-size: 14px; margin-top: 30px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Interview Request Update</h1>
        </div>
        <div class="content">
          <p>Hi <strong>${candidateName}</strong>,</p>
          
          <div class="alert">
            <strong>We're sorry.</strong> ${interviewerName} was unable to accept your interview request for "${topic}" scheduled on ${new Date(scheduledAt).toLocaleDateString()}.
          </div>

          <p>This could be due to scheduling conflicts or availability issues. Don't worry - you can:</p>
          <ul>
            <li>Request another time slot with the same interviewer</li>
            <li>Choose a different interviewer from our platform</li>
            <li>Practice with AI mock interviews in the meantime</li>
          </ul>

          <center>
            <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/live-interview" class="button">Schedule Another Interview</a>
          </center>

          <div class="footer">
            <p>Keep preparing and don't give up! Every practice session counts.</p>
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
Interview Request Declined

Hi ${candidateName},

We're sorry. ${interviewerName} was unable to accept your interview request for "${topic}" scheduled on ${new Date(scheduledAt).toLocaleDateString()}.

This could be due to scheduling conflicts or availability issues. Don't worry - you can:
• Request another time slot with the same interviewer
• Choose a different interviewer from our platform
• Practice with AI mock interviews in the meantime

Schedule another interview: ${process.env.FRONTEND_URL || 'http://localhost:5173'}/live-interview

Keep preparing and don't give up! Every practice session counts.

---
PrepForge Interview Platform
Support: prepforge563@gmail.com | +91 7232915352
  `;

  return sendEmail({
    to: candidateEmail,
    subject,
    html,
    text,
  });
};
