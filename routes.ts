import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, insertVideoSchema, insertHeadshotSchema, 
  insertEventSchema, insertNewsletterSchema, insertTipSchema, insertLikeSchema 
} from "@shared/schema";
import { 
  analyzeVideoContent, generateAIInsights, generateTrainingRecommendations, 
  analyzeNewsletterContent 
} from "./services/openai";
import multer from "multer";
import path from "path";
import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-06-30.basil",
});

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow videos, images
    if (file.mimetype.startsWith('video/') || file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only video and image files are allowed'));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Auth endpoints (simplified - in production use proper auth)
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }
      
      const user = await storage.createUser(userData);
      res.json({ user: { ...user, password: undefined } });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await storage.getUserByEmail(email);
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      res.json({ user: { ...user, password: undefined } });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // User endpoints
  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(parseInt(req.params.id));
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({ ...user, password: undefined });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.put("/api/users/:id", async (req, res) => {
    try {
      const updates = insertUserSchema.partial().parse(req.body);
      const user = await storage.updateUser(parseInt(req.params.id), updates);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({ ...user, password: undefined });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Video endpoints
  app.get("/api/videos", async (req, res) => {
    try {
      const videos = await storage.getAllVideos();
      res.json(videos);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/videos/:id", async (req, res) => {
    try {
      const video = await storage.getVideo(parseInt(req.params.id));
      if (!video) {
        return res.status(404).json({ message: "Video not found" });
      }
      res.json(video);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/videos", upload.single('video'), async (req, res) => {
    try {
      const videoData = insertVideoSchema.parse(req.body);
      
      // In production, upload file to cloud storage and get URL
      const videoUrl = req.file ? `/uploads/videos/${Date.now()}-${req.file.originalname}` : "/placeholder-video.mp4";
      
      // Use AI to analyze video content
      const analysis = await analyzeVideoContent(videoData.title, videoData.description || "");
      
      const video = await storage.createVideo({
        ...videoData,
        videoUrl,
        category: analysis.category,
        danceStyle: analysis.danceStyle,
        thumbnailUrl: videoData.thumbnailUrl || `/thumbnails/${Date.now()}.jpg`
      });
      
      res.json(video);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/videos/:id", async (req, res) => {
    try {
      const success = await storage.deleteVideo(parseInt(req.params.id));
      if (!success) {
        return res.status(404).json({ message: "Video not found" });
      }
      res.json({ message: "Video deleted successfully" });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Headshot endpoints
  app.get("/api/headshots", async (req, res) => {
    try {
      const headshots = await storage.getAllHeadshots();
      res.json(headshots);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/users/:userId/headshots", async (req, res) => {
    try {
      const headshots = await storage.getHeadshotsByUser(parseInt(req.params.userId));
      res.json(headshots);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/headshots", upload.single('image'), async (req, res) => {
    try {
      const headshotData = insertHeadshotSchema.parse(req.body);
      
      // In production, upload file to cloud storage and get URL
      const imageUrl = req.file ? `/uploads/headshots/${Date.now()}-${req.file.originalname}` : "/placeholder-image.jpg";
      
      const headshot = await storage.createHeadshot({
        ...headshotData,
        imageUrl
      });
      
      res.json(headshot);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Event endpoints
  app.get("/api/events", async (req, res) => {
    try {
      const events = await storage.getAllEvents();
      res.json(events);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/events/:id", async (req, res) => {
    try {
      const event = await storage.getEvent(parseInt(req.params.id));
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      res.json(event);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/events", async (req, res) => {
    try {
      const eventData = insertEventSchema.parse(req.body);
      const event = await storage.createEvent(eventData);
      res.json(event);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.put("/api/events/:id", async (req, res) => {
    try {
      const updates = insertEventSchema.partial().parse(req.body);
      const event = await storage.updateEvent(parseInt(req.params.id), updates);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      res.json(event);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Event payment processing endpoint
  app.post("/api/create-event-payment-intent", async (req, res) => {
    try {
      const { eventId, amount, registrationData } = req.body;
      
      // Validate event exists
      const event = await storage.getEvent(eventId);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }

      // Check if event has available spots
      if (event.currentParticipants >= event.maxParticipants) {
        return res.status(400).json({ message: "Event is full" });
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: "usd",
        metadata: {
          eventId: eventId.toString(),
          eventTitle: event.title,
          participantName: registrationData.fullName,
          participantEmail: registrationData.email,
          participantPhone: registrationData.phone,
          danceExperience: registrationData.danceExperience || "",
          specialRequests: registrationData.specialRequests || "",
        },
      });

      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      res.status(500).json({ message: "Error creating payment intent: " + error.message });
    }
  });

  // Newsletter endpoints
  app.get("/api/newsletters", async (req, res) => {
    try {
      const { creatorId } = req.query;
      if (creatorId) {
        const newsletters = await storage.getNewslettersByCreator(parseInt(creatorId as string));
        res.json(newsletters);
      } else {
        res.status(400).json({ message: "Creator ID required" });
      }
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/newsletters", async (req, res) => {
    try {
      const newsletterData = insertNewsletterSchema.parse(req.body);
      
      // Use AI to analyze newsletter content
      if (newsletterData.content) {
        const analysis = await analyzeNewsletterContent(JSON.stringify(newsletterData.content));
        console.log("Newsletter analysis:", analysis);
      }
      
      const newsletter = await storage.createNewsletter(newsletterData);
      res.json(newsletter);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.put("/api/newsletters/:id", async (req, res) => {
    try {
      const updates = insertNewsletterSchema.partial().parse(req.body);
      const newsletter = await storage.updateNewsletter(parseInt(req.params.id), updates);
      if (!newsletter) {
        return res.status(404).json({ message: "Newsletter not found" });
      }
      res.json(newsletter);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Tip endpoints (Anonymous)
  app.post("/api/tips", async (req, res) => {
    try {
      const { toUserId, videoId, amount, message } = req.body;
      const tipData = {
        toUserId: parseInt(toUserId),
        videoId: videoId ? parseInt(videoId) : null,
        amount: amount.toString(),
        message: message || null,
        anonymousId: `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      };
      const tip = await storage.createTip(tipData);
      res.json(tip);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/users/:userId/tips", async (req, res) => {
    try {
      const tips = await storage.getTipsByUser(parseInt(req.params.userId));
      res.json(tips);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Like endpoints (Anonymous)
  app.post("/api/likes", async (req, res) => {
    try {
      const { videoId, anonymousId } = req.body;
      const likeData = {
        videoId: parseInt(videoId),
        anonymousId: anonymousId || `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      };
      const like = await storage.createLike(likeData);
      res.json(like);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/likes", async (req, res) => {
    try {
      const { anonymousId, videoId } = req.body;
      const success = await storage.deleteLike(anonymousId, videoId);
      if (!success) {
        return res.status(404).json({ message: "Like not found" });
      }
      res.json({ message: "Like removed successfully" });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Subscription endpoints (Anonymous)
  app.post("/api/subscriptions", async (req, res) => {
    try {
      const { creatorId, anonymousId } = req.body;
      const finalAnonymousId = anonymousId || `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const subscription = await storage.createSubscription(finalAnonymousId, parseInt(creatorId));
      res.json(subscription);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/subscriptions", async (req, res) => {
    try {
      const { anonymousId, creatorId } = req.body;
      const success = await storage.deleteSubscription(anonymousId, parseInt(creatorId));
      if (!success) {
        return res.status(404).json({ message: "Subscription not found" });
      }
      res.json({ message: "Subscription removed successfully" });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/subscriptions", async (req, res) => {
    try {
      const { subscriberId, creatorId } = req.body;
      const success = await storage.deleteSubscription(subscriberId, creatorId);
      if (!success) {
        return res.status(404).json({ message: "Subscription not found" });
      }
      res.json({ message: "Unsubscribed successfully" });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // AI endpoints
  app.get("/api/ai/insights/:userId", async (req, res) => {
    try {
      const insights = await generateAIInsights(parseInt(req.params.userId));
      res.json(insights);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Subscription Stats endpoint
  app.get("/api/subscription-stats/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      const subscriptions = await storage.getSubscriptionsByCreator(userId);
      
      const totalSubscribers = subscriptions.length;
      const monthlyRevenue = totalSubscribers * 7.49; // $7.49 is creator's cut (75%) from $9.99
      const dailyEarnings = monthlyRevenue / 30; // Approximate daily earnings
      
      // Get recent subscribers (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const recentSubscribers = subscriptions
        .filter(sub => sub.createdAt && new Date(sub.createdAt) >= thirtyDaysAgo)
        .slice(0, 5)
        .map(sub => ({
          id: sub.anonymousId,
          subscribedAt: sub.createdAt ? sub.createdAt.toISOString() : new Date().toISOString(),
          amount: 7.49
        }));

      res.json({
        totalSubscribers,
        monthlyRevenue,
        dailyEarnings,
        recentSubscribers
      });
    } catch (error: any) {
      console.error("Error fetching subscription stats:", error);
      res.status(500).json({ message: "Failed to fetch subscription stats" });
    }
  });

  app.post("/api/ai/training-recommendations", async (req, res) => {
    try {
      const { userStyles } = req.body;
      const recommendations = await generateTrainingRecommendations(userStyles || []);
      res.json(recommendations);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Stripe payment routes for tipping
  app.post("/api/create-tip-payment", async (req, res) => {
    try {
      const { amount, videoId, anonymousId } = req.body;
      
      if (!amount || amount < 0.50) {
        return res.status(400).json({ message: "Minimum tip amount is $0.50" });
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: "usd",
        metadata: {
          videoId: videoId.toString(),
          anonymousId: anonymousId,
          type: "tip"
        }
      });

      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      res.status(500).json({ message: "Error creating tip payment: " + error.message });
    }
  });

  // Create subscription for a creator
  app.post("/api/create-subscription", async (req, res) => {
    try {
      const { creatorId, anonymousId } = req.body;
      
      // Check if subscription already exists
      const existingSubscriptions = await storage.getSubscriptionsByCreator(creatorId);
      const hasSubscription = existingSubscriptions.some(sub => sub.anonymousId === anonymousId);
      
      if (hasSubscription) {
        return res.status(400).json({ message: "Already subscribed to this creator" });
      }

      // Create Stripe subscription (for demo, using a fixed price)
      const subscription = await stripe.subscriptions.create({
        customer: await getOrCreateStripeCustomer(anonymousId),
        items: [{
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Creator Subscription',
            },
            unit_amount: 999, // $9.99 per month
            recurring: {
              interval: 'month',
            },
          },
        }],
        payment_behavior: 'default_incomplete',
        expand: ['latest_invoice.payment_intent'],
        metadata: {
          creatorId: creatorId.toString(),
          anonymousId: anonymousId,
          type: "subscription"
        }
      });

      res.json({ 
        subscriptionId: subscription.id,
        clientSecret: subscription.latest_invoice.payment_intent.client_secret 
      });
    } catch (error: any) {
      res.status(500).json({ message: "Error creating subscription: " + error.message });
    }
  });

  // Check subscription status
  app.get("/api/subscription-status/:creatorId/:anonymousId", async (req, res) => {
    try {
      const { creatorId, anonymousId } = req.params;
      
      const subscriptions = await storage.getSubscriptionsByCreator(parseInt(creatorId));
      const hasSubscription = subscriptions.some(sub => sub.anonymousId === anonymousId);
      
      res.json({ hasSubscription });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Helper function to get or create Stripe customer
  async function getOrCreateStripeCustomer(anonymousId: string) {
    try {
      // Try to find existing customer
      const customers = await stripe.customers.list({
        metadata: { anonymousId },
        limit: 1
      });

      if (customers.data.length > 0) {
        return customers.data[0].id;
      }

      // Create new customer
      const customer = await stripe.customers.create({
        metadata: { anonymousId }
      });

      return customer.id;
    } catch (error) {
      throw new Error('Failed to create or retrieve customer');
    }
  }

  // Stripe webhook for handling successful payments
  app.post("/api/stripe-webhook", async (req, res) => {
    try {
      const eventType = req.body.type;
      const object = req.body.data.object;
      
      if (eventType === "payment_intent.succeeded") {
        if (object.metadata?.type === "tip") {
          // Handle tip payment
          const video = await storage.getVideo(parseInt(object.metadata.videoId));
          if (video) {
            const tipData = {
              toUserId: video.userId,
              anonymousId: object.metadata.anonymousId,
              videoId: parseInt(object.metadata.videoId),
              amount: (object.amount / 100).toString(),
              message: "Anonymous tip"
            };

            await storage.createTip(tipData);
            
            const newTipAmount = parseFloat(video.tipAmount || "0") + (object.amount / 100);
            await storage.updateVideo(parseInt(object.metadata.videoId), { 
              tipAmount: newTipAmount.toString() 
            });
          }
        } else if (object.metadata?.eventId) {
          // Handle event registration payment
          const eventId = parseInt(object.metadata.eventId);
          const event = await storage.getEvent(eventId);
          
          if (event) {
            // Increment participant count
            const updatedParticipants = (event.currentParticipants || 0) + 1;
            await storage.updateEvent(eventId, {
              currentParticipants: updatedParticipants
            });
            
            console.log(`Event registration successful for ${object.metadata.participantName} to ${object.metadata.eventTitle}`);
            // In a production app, you would also:
            // - Send confirmation email to participant
            // - Store registration details in a separate registrations table
            // - Send notification to event organizer
          }
        }
      } else if (eventType === "invoice.payment_succeeded") {
        // Handle subscription payment
        const subscription = object.subscription;
        const metadata = object.metadata || {};
        
        if (metadata.type === "subscription") {
          // Create subscription record in database
          await storage.createSubscription(
            metadata.anonymousId, 
            parseInt(metadata.creatorId)
          );
        }
      }

      res.json({ received: true });
    } catch (error: any) {
      res.status(500).json({ message: "Webhook error: " + error.message });
    }
  });

  // Training Sessions API
  app.get("/api/training-sessions", async (req, res) => {
    try {
      const sessions = await storage.getAllTrainingSessions();
      
      // Get comments for each session
      const sessionsWithComments = await Promise.all(
        sessions.map(async (session) => {
          const comments = await storage.getCommentsBySession(session.id);
          return { ...session, comments };
        })
      );
      
      res.json(sessionsWithComments);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch training sessions: " + error.message });
    }
  });

  app.post("/api/training-sessions", async (req, res) => {
    try {
      const sessionData = req.body;
      const session = await storage.createTrainingSession(sessionData);
      res.json(session);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to create training session: " + error.message });
    }
  });

  // Training Comments API
  app.get("/api/training-comments/:sessionId", async (req, res) => {
    try {
      const sessionId = parseInt(req.params.sessionId);
      const comments = await storage.getCommentsBySession(sessionId);
      res.json(comments);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch comments: " + error.message });
    }
  });

  app.post("/api/training-comments", async (req, res) => {
    try {
      const commentData = req.body;
      const comment = await storage.createTrainingComment(commentData);
      res.json(comment);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to create comment: " + error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
