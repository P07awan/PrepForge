import { Request, Response } from 'express';
import Stripe from 'stripe';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth';
import { logger } from '../utils/logger';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

const SUBSCRIPTION_PRICES = {
  BASIC: 999, // $9.99
  PREMIUM: 2999, // $29.99
  ENTERPRISE: 9999, // $99.99
};

export const createCheckoutSession = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { subscription } = req.body;
    const userId = req.user!.id;

    if (!SUBSCRIPTION_PRICES[subscription as keyof typeof SUBSCRIPTION_PRICES]) {
      return res.status(400).json({ error: 'Invalid subscription plan' });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      customer_email: user.email,
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `PrepForge ${subscription} Subscription`,
              description: `Monthly ${subscription.toLowerCase()} plan`,
            },
            unit_amount: SUBSCRIPTION_PRICES[subscription as keyof typeof SUBSCRIPTION_PRICES],
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.CORS_ORIGIN}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CORS_ORIGIN}/payment/cancel`,
      metadata: {
        userId,
        subscription,
      },
    });

    res.json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    logger.error('Create checkout session error:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
};

export const handleWebhook = async (req: Request, res: Response): Promise<any> => {
  const sig = req.headers['stripe-signature'] as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    logger.error('Stripe webhook secret not configured');
    return res.status(500).json({ error: 'Webhook not configured' });
  }

  try {
    const event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const subscription = session.metadata?.subscription;

        if (userId && subscription) {
          // Update user subscription
          await prisma.user.update({
            where: { id: userId },
            data: { subscription: subscription as any },
          });

          // Create payment record
          await prisma.payment.create({
            data: {
              userId,
              amount: (session.amount_total || 0) / 100,
              currency: session.currency || 'usd',
              status: 'COMPLETED',
              subscription: subscription as any,
              stripePaymentId: session.payment_intent as string,
              metadata: session.metadata || {},
            },
          });

          logger.info(`Subscription activated for user ${userId}: ${subscription}`);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        // Handle subscription cancellation
        logger.info(`Subscription cancelled: ${subscription.id}`);
        break;
      }

      default:
        logger.info(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    logger.error('Webhook error:', error);
    res.status(400).json({ error: 'Webhook error' });
  }
};

export const getPaymentHistory = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    const payments = await prisma.payment.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    res.json({ payments });
  } catch (error) {
    logger.error('Get payment history error:', error);
    res.status(500).json({ error: 'Failed to fetch payment history' });
  }
};
