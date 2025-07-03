var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  events: () => events,
  headshots: () => headshots,
  insertEventSchema: () => insertEventSchema,
  insertHeadshotSchema: () => insertHeadshotSchema,
  insertLikeSchema: () => insertLikeSchema,
  insertNewsletterSchema: () => insertNewsletterSchema,
  insertSubscriptionSchema: () => insertSubscriptionSchema,
  insertTipSchema: () => insertTipSchema,
  insertTrainingCommentSchema: () => insertTrainingCommentSchema,
  insertTrainingSessionSchema: () => insertTrainingSessionSchema,
  insertUserSchema: () => insertUserSchema,
  insertVideoSchema: () => insertVideoSchema,
  likes: () => likes,
  newsletters: () => newsletters,
  subscriptions: () => subscriptions,
  tips: () => tips,
  trainingComments: () => trainingComments,
  trainingSessions: () => trainingSessions,
  users: () => users,
  videos: () => videos
});
import { pgTable, text, serial, integer, boolean, timestamp, json, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  displayName: text("display_name").notNull(),
  bio: text("bio"),
  profileImage: text("profile_image"),
  danceStyles: text("dance_styles").array(),
  location: text("location"),
  agency: text("agency"),
  createdAt: timestamp("created_at").defaultNow()
});
var videos = pgTable("videos", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  videoUrl: text("video_url").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  duration: integer("duration"),
  // in seconds
  category: text("category").notNull(),
  // 'performance', 'training', 'tutorial'
  danceStyle: text("dance_style"),
  isAiEnhanced: boolean("is_ai_enhanced").default(false),
  isSubscriptionOnly: boolean("is_subscription_only").default(false),
  viewCount: integer("view_count").default(0),
  likeCount: integer("like_count").default(0),
  tipAmount: decimal("tip_amount", { precision: 10, scale: 2 }).default("0.00"),
  createdAt: timestamp("created_at").defaultNow()
});
var headshots = pgTable("headshots", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  imageUrl: text("image_url").notNull(),
  title: text("title"),
  description: text("description"),
  tags: text("tags").array(),
  createdAt: timestamp("created_at").defaultNow()
});
var events = pgTable("events", {
  id: serial("id").primaryKey(),
  creatorId: integer("creator_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
  location: text("location").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  eventType: text("event_type").notNull(),
  // 'competition', 'workshop', 'showcase'
  registrationRequired: boolean("registration_required").default(false),
  maxParticipants: integer("max_participants"),
  currentParticipants: integer("current_participants").default(0),
  price: decimal("price", { precision: 10, scale: 2 }).default("0.00"),
  createdAt: timestamp("created_at").defaultNow()
});
var newsletters = pgTable("newsletters", {
  id: serial("id").primaryKey(),
  creatorId: integer("creator_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  content: json("content"),
  // Rich text content
  templateType: text("template_type").notNull(),
  status: text("status").notNull().default("draft"),
  // 'draft', 'scheduled', 'sent'
  scheduledDate: timestamp("scheduled_date"),
  subscriberCount: integer("subscriber_count").default(0),
  createdAt: timestamp("created_at").defaultNow()
});
var subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  creatorId: integer("creator_id").references(() => users.id).notNull(),
  anonymousId: text("anonymous_id").notNull(),
  // Anonymous identifier for the subscriber
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow()
});
var tips = pgTable("tips", {
  id: serial("id").primaryKey(),
  toUserId: integer("to_user_id").references(() => users.id).notNull(),
  videoId: integer("video_id").references(() => videos.id),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  message: text("message"),
  anonymousId: text("anonymous_id").notNull(),
  // Anonymous identifier for the tipper
  createdAt: timestamp("created_at").defaultNow()
});
var likes = pgTable("likes", {
  id: serial("id").primaryKey(),
  videoId: integer("video_id").references(() => videos.id).notNull(),
  anonymousId: text("anonymous_id").notNull(),
  // Anonymous identifier for the liker
  createdAt: timestamp("created_at").defaultNow()
});
var trainingSessions = pgTable("training_sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  anonymousId: text("anonymous_id"),
  className: text("class_name").notNull(),
  instructor: text("instructor"),
  studio: text("studio"),
  danceStyle: text("dance_style"),
  difficulty: text("difficulty"),
  // 'beginner', 'intermediate', 'advanced'
  duration: integer("duration"),
  // in minutes
  feeling: text("feeling").notNull(),
  // 'amazing', 'good', 'okay', 'challenging', 'frustrated'
  notes: text("notes"),
  rating: integer("rating"),
  // 1-5 stars
  createdAt: timestamp("created_at").defaultNow()
});
var trainingComments = pgTable("training_comments", {
  id: serial("id").primaryKey(),
  sessionId: integer("session_id").references(() => trainingSessions.id).notNull(),
  anonymousId: text("anonymous_id").notNull(),
  comment: text("comment").notNull(),
  createdAt: timestamp("created_at").defaultNow()
});
var insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true
});
var insertVideoSchema = createInsertSchema(videos).omit({
  id: true,
  viewCount: true,
  likeCount: true,
  tipAmount: true,
  createdAt: true
});
var insertHeadshotSchema = createInsertSchema(headshots).omit({
  id: true,
  createdAt: true
});
var insertEventSchema = createInsertSchema(events).omit({
  id: true,
  currentParticipants: true,
  createdAt: true
});
var insertNewsletterSchema = createInsertSchema(newsletters).omit({
  id: true,
  subscriberCount: true,
  createdAt: true
});
var insertTipSchema = createInsertSchema(tips).omit({
  id: true,
  createdAt: true
});
var insertLikeSchema = createInsertSchema(likes).omit({
  id: true,
  createdAt: true
});
var insertSubscriptionSchema = createInsertSchema(subscriptions).omit({
  id: true,
  createdAt: true
});
var insertTrainingSessionSchema = createInsertSchema(trainingSessions).omit({
  id: true,
  createdAt: true
});
var insertTrainingCommentSchema = createInsertSchema(trainingComments).omit({
  id: true,
  createdAt: true
});

// server/db.ts
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
neonConfig.webSocketConstructor = ws;
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}
var pool = new Pool({ connectionString: process.env.DATABASE_URL });
var db = drizzle({ client: pool, schema: schema_exports });

// server/storage.ts
import { eq, and, desc } from "drizzle-orm";
var DatabaseStorage = class {
  // Users
  async getUser(id) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || void 0;
  }
  async getUserByEmail(email) {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || void 0;
  }
  async createUser(insertUser) {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
  async updateUser(id, updates) {
    const [user] = await db.update(users).set(updates).where(eq(users.id, id)).returning();
    return user || void 0;
  }
  // Videos
  async getVideo(id) {
    const [video] = await db.select().from(videos).where(eq(videos.id, id));
    return video || void 0;
  }
  async getVideosByUser(userId) {
    return await db.select().from(videos).where(eq(videos.userId, userId));
  }
  async getAllVideos() {
    return await db.select().from(videos).orderBy(videos.createdAt);
  }
  async createVideo(insertVideo) {
    const [video] = await db.insert(videos).values({
      ...insertVideo,
      viewCount: 0,
      likeCount: 0,
      tipAmount: "0.00"
    }).returning();
    return video;
  }
  async updateVideo(id, updates) {
    const [video] = await db.update(videos).set(updates).where(eq(videos.id, id)).returning();
    return video || void 0;
  }
  async deleteVideo(id) {
    const result = await db.delete(videos).where(eq(videos.id, id));
    return (result.rowCount ?? 0) > 0;
  }
  // Headshots
  async getHeadshot(id) {
    const [headshot] = await db.select().from(headshots).where(eq(headshots.id, id));
    return headshot || void 0;
  }
  async getHeadshotsByUser(userId) {
    return await db.select().from(headshots).where(eq(headshots.userId, userId));
  }
  async getAllHeadshots() {
    return await db.select().from(headshots);
  }
  async createHeadshot(insertHeadshot) {
    const [headshot] = await db.insert(headshots).values(insertHeadshot).returning();
    return headshot;
  }
  async deleteHeadshot(id) {
    const result = await db.delete(headshots).where(eq(headshots.id, id));
    return (result.rowCount ?? 0) > 0;
  }
  // Events  
  async getEvent(id) {
    const [event] = await db.select().from(events).where(eq(events.id, id));
    return event || void 0;
  }
  async getAllEvents() {
    return await db.select().from(events).orderBy(events.startDate);
  }
  async getEventsByCreator(creatorId) {
    return await db.select().from(events).where(eq(events.creatorId, creatorId));
  }
  async createEvent(insertEvent) {
    const [event] = await db.insert(events).values({
      ...insertEvent,
      currentParticipants: 0
    }).returning();
    return event;
  }
  async updateEvent(id, updates) {
    const [event] = await db.update(events).set(updates).where(eq(events.id, id)).returning();
    return event || void 0;
  }
  async deleteEvent(id) {
    const result = await db.delete(events).where(eq(events.id, id));
    return (result.rowCount ?? 0) > 0;
  }
  // Newsletters
  async getNewsletter(id) {
    const [newsletter] = await db.select().from(newsletters).where(eq(newsletters.id, id));
    return newsletter || void 0;
  }
  async getNewslettersByCreator(creatorId) {
    return await db.select().from(newsletters).where(eq(newsletters.creatorId, creatorId));
  }
  async createNewsletter(insertNewsletter) {
    const [newsletter] = await db.insert(newsletters).values({
      ...insertNewsletter,
      subscriberCount: 0,
      status: insertNewsletter.status || "draft"
    }).returning();
    return newsletter;
  }
  async updateNewsletter(id, updates) {
    const [newsletter] = await db.update(newsletters).set(updates).where(eq(newsletters.id, id)).returning();
    return newsletter || void 0;
  }
  // Tips
  async createTip(insertTip) {
    const [tip] = await db.insert(tips).values(insertTip).returning();
    if (insertTip.videoId) {
      const [video] = await db.select().from(videos).where(eq(videos.id, insertTip.videoId));
      if (video) {
        const currentAmount = parseFloat(video.tipAmount || "0");
        const newAmount = currentAmount + parseFloat(insertTip.amount);
        await db.update(videos).set({ tipAmount: newAmount.toFixed(2) }).where(eq(videos.id, insertTip.videoId));
      }
    }
    return tip;
  }
  async getTipsByUser(userId) {
    return await db.select().from(tips).where(eq(tips.toUserId, userId));
  }
  async getTipsByVideo(videoId) {
    return await db.select().from(tips).where(eq(tips.videoId, videoId));
  }
  // Likes
  async createLike(insertLike) {
    const [like] = await db.insert(likes).values(insertLike).returning();
    const [video] = await db.select().from(videos).where(eq(videos.id, insertLike.videoId));
    if (video) {
      await db.update(videos).set({ likeCount: (video.likeCount || 0) + 1 }).where(eq(videos.id, insertLike.videoId));
    }
    return like;
  }
  async deleteLike(anonymousId, videoId) {
    const result = await db.delete(likes).where(and(eq(likes.anonymousId, anonymousId), eq(likes.videoId, videoId)));
    if ((result.rowCount ?? 0) > 0) {
      const [video] = await db.select().from(videos).where(eq(videos.id, videoId));
      if (video && video.likeCount && video.likeCount > 0) {
        await db.update(videos).set({ likeCount: video.likeCount - 1 }).where(eq(videos.id, videoId));
      }
      return true;
    }
    return false;
  }
  async getLikesByVideo(videoId) {
    return await db.select().from(likes).where(eq(likes.videoId, videoId));
  }
  // Subscriptions (Anonymous)
  async createSubscription(anonymousId, creatorId) {
    const [subscription] = await db.insert(subscriptions).values({
      anonymousId,
      creatorId,
      isActive: true
    }).returning();
    return subscription;
  }
  async deleteSubscription(anonymousId, creatorId) {
    const result = await db.delete(subscriptions).where(and(eq(subscriptions.anonymousId, anonymousId), eq(subscriptions.creatorId, creatorId)));
    return (result.rowCount ?? 0) > 0;
  }
  async getSubscriptionsByCreator(creatorId) {
    return await db.select().from(subscriptions).where(eq(subscriptions.creatorId, creatorId));
  }
  // Training Sessions
  async getTrainingSession(id) {
    const [session] = await db.select().from(trainingSessions).where(eq(trainingSessions.id, id));
    return session || void 0;
  }
  async getAllTrainingSessions() {
    return await db.select().from(trainingSessions).orderBy(desc(trainingSessions.createdAt));
  }
  async createTrainingSession(insertSession) {
    const [session] = await db.insert(trainingSessions).values(insertSession).returning();
    return session;
  }
  // Training Comments
  async getTrainingComment(id) {
    const [comment] = await db.select().from(trainingComments).where(eq(trainingComments.id, id));
    return comment || void 0;
  }
  async getCommentsBySession(sessionId) {
    return await db.select().from(trainingComments).where(eq(trainingComments.sessionId, sessionId)).orderBy(trainingComments.createdAt);
  }
  async createTrainingComment(insertComment) {
    const [comment] = await db.insert(trainingComments).values(insertComment).returning();
    return comment;
  }
};
var storage = new DatabaseStorage();

// server/services/openai.ts
import OpenAI from "openai";
var openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_KEY || "default_key"
});
async function analyzeVideoContent(videoTitle, description) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a dance expert AI. Analyze dance video content and categorize it. Respond with JSON in this format: { 'category': string, 'danceStyle': string, 'tags': string[] }. Categories should be 'performance', 'training', or 'tutorial'. Dance styles include 'ballet', 'hip-hop', 'contemporary', 'jazz', 'ballroom', etc."
        },
        {
          role: "user",
          content: `Title: ${videoTitle}
Description: ${description}`
        }
      ],
      response_format: { type: "json_object" }
    });
    const result = JSON.parse(response.choices[0].message.content || "{}");
    return {
      category: result.category || "performance",
      danceStyle: result.danceStyle || "contemporary",
      tags: result.tags || []
    };
  } catch (error) {
    console.error("Error analyzing video content:", error);
    return {
      category: "performance",
      danceStyle: "contemporary",
      tags: []
    };
  }
}
async function generateAIInsights(userId) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "Generate AI insights for a dance content creator. Provide realistic recommendations based on general dance industry trends. Respond with JSON in this format: { 'optimalPostTime': string, 'trendingStyle': string, 'collaborationMatches': number, 'engagement': { 'likes': number, 'comments': number, 'shares': number } }"
        },
        {
          role: "user",
          content: "Generate insights for a dance content creator focusing on engagement optimization and collaboration opportunities."
        }
      ],
      response_format: { type: "json_object" }
    });
    const result = JSON.parse(response.choices[0].message.content || "{}");
    return {
      optimalPostTime: result.optimalPostTime || "7:30 PM",
      trendingStyle: result.trendingStyle || "Contemporary",
      collaborationMatches: result.collaborationMatches || 3,
      engagement: result.engagement || { likes: 1200, comments: 89, shares: 34 }
    };
  } catch (error) {
    console.error("Error generating AI insights:", error);
    return {
      optimalPostTime: "7:30 PM",
      trendingStyle: "Contemporary",
      collaborationMatches: 3,
      engagement: { likes: 1200, comments: 89, shares: 34 }
    };
  }
}
async function generateTrainingRecommendations(userStyles) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "Generate personalized dance training recommendations. Respond with JSON array of recommendations in this format: [{ 'title': string, 'description': string, 'duration': string, 'frequency': string, 'targetStyles': string[], 'priority': 'recommended' | 'suggested' }]"
        },
        {
          role: "user",
          content: `Generate training recommendations for a dancer with these styles: ${userStyles.join(", ")}`
        }
      ],
      response_format: { type: "json_object" }
    });
    const result = JSON.parse(response.choices[0].message.content || "{}");
    return result.recommendations || [
      {
        title: "Flexibility Focus Week",
        description: "Improve your range of motion with targeted stretching routines.",
        duration: "30 min/day",
        frequency: "5 days",
        targetStyles: ["hip-hop", "contemporary"],
        priority: "recommended"
      },
      {
        title: "Core Strength Building",
        description: "Enhance your stability and control with ballet-inspired core exercises.",
        duration: "20 min/day",
        frequency: "3 days",
        targetStyles: ["ballet", "contemporary"],
        priority: "suggested"
      }
    ];
  } catch (error) {
    console.error("Error generating training recommendations:", error);
    return [
      {
        title: "Flexibility Focus Week",
        description: "Improve your range of motion with targeted stretching routines.",
        duration: "30 min/day",
        frequency: "5 days",
        targetStyles: ["hip-hop", "contemporary"],
        priority: "recommended"
      }
    ];
  }
}
async function analyzeNewsletterContent(content) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "Analyze newsletter content and provide suggestions. Respond with JSON in this format: { 'subject': string, 'summary': string, 'engagement_score': number }"
        },
        {
          role: "user",
          content: `Analyze this newsletter content: ${content}`
        }
      ],
      response_format: { type: "json_object" }
    });
    const result = JSON.parse(response.choices[0].message.content || "{}");
    return {
      subject: result.subject || "Newsletter Update",
      summary: result.summary || "Weekly dance community updates",
      engagement_score: result.engagement_score || 0.8
    };
  } catch (error) {
    console.error("Error analyzing newsletter content:", error);
    return {
      subject: "Newsletter Update",
      summary: "Weekly dance community updates",
      engagement_score: 0.8
    };
  }
}

// server/routes.ts
import multer from "multer";
import Stripe from "stripe";
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("Missing required Stripe secret: STRIPE_SECRET_KEY");
}
var stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-06-30.basil"
});
var upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 100 * 1024 * 1024
    // 100MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("video/") || file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only video and image files are allowed"));
    }
  }
});
async function registerRoutes(app2) {
  app2.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }
      const user = await storage.createUser(userData);
      res.json({ user: { ...user, password: void 0 } });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  app2.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await storage.getUserByEmail(email);
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      res.json({ user: { ...user, password: void 0 } });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  app2.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(parseInt(req.params.id));
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({ ...user, password: void 0 });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  app2.put("/api/users/:id", async (req, res) => {
    try {
      const updates = insertUserSchema.partial().parse(req.body);
      const user = await storage.updateUser(parseInt(req.params.id), updates);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({ ...user, password: void 0 });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  app2.get("/api/videos", async (req, res) => {
    try {
      const videos2 = await storage.getAllVideos();
      res.json(videos2);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.get("/api/videos/:id", async (req, res) => {
    try {
      const video = await storage.getVideo(parseInt(req.params.id));
      if (!video) {
        return res.status(404).json({ message: "Video not found" });
      }
      res.json(video);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  app2.post("/api/videos", upload.single("video"), async (req, res) => {
    try {
      const videoData = insertVideoSchema.parse(req.body);
      const videoUrl = req.file ? `/uploads/videos/${Date.now()}-${req.file.originalname}` : "/placeholder-video.mp4";
      const analysis = await analyzeVideoContent(videoData.title, videoData.description || "");
      const video = await storage.createVideo({
        ...videoData,
        videoUrl,
        category: analysis.category,
        danceStyle: analysis.danceStyle,
        thumbnailUrl: videoData.thumbnailUrl || `/thumbnails/${Date.now()}.jpg`
      });
      res.json(video);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  app2.delete("/api/videos/:id", async (req, res) => {
    try {
      const success = await storage.deleteVideo(parseInt(req.params.id));
      if (!success) {
        return res.status(404).json({ message: "Video not found" });
      }
      res.json({ message: "Video deleted successfully" });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  app2.get("/api/headshots", async (req, res) => {
    try {
      const headshots2 = await storage.getAllHeadshots();
      res.json(headshots2);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.get("/api/users/:userId/headshots", async (req, res) => {
    try {
      const headshots2 = await storage.getHeadshotsByUser(parseInt(req.params.userId));
      res.json(headshots2);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  app2.post("/api/headshots", upload.single("image"), async (req, res) => {
    try {
      const headshotData = insertHeadshotSchema.parse(req.body);
      const imageUrl = req.file ? `/uploads/headshots/${Date.now()}-${req.file.originalname}` : "/placeholder-image.jpg";
      const headshot = await storage.createHeadshot({
        ...headshotData,
        imageUrl
      });
      res.json(headshot);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  app2.get("/api/events", async (req, res) => {
    try {
      const events2 = await storage.getAllEvents();
      res.json(events2);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.get("/api/events/:id", async (req, res) => {
    try {
      const event = await storage.getEvent(parseInt(req.params.id));
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      res.json(event);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  app2.post("/api/events", async (req, res) => {
    try {
      const eventData = insertEventSchema.parse(req.body);
      const event = await storage.createEvent(eventData);
      res.json(event);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  app2.put("/api/events/:id", async (req, res) => {
    try {
      const updates = insertEventSchema.partial().parse(req.body);
      const event = await storage.updateEvent(parseInt(req.params.id), updates);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      res.json(event);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  app2.post("/api/create-event-payment-intent", async (req, res) => {
    try {
      const { eventId, amount, registrationData } = req.body;
      const event = await storage.getEvent(eventId);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      if (event.currentParticipants >= event.maxParticipants) {
        return res.status(400).json({ message: "Event is full" });
      }
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100),
        // Convert to cents
        currency: "usd",
        metadata: {
          eventId: eventId.toString(),
          eventTitle: event.title,
          participantName: registrationData.fullName,
          participantEmail: registrationData.email,
          participantPhone: registrationData.phone,
          danceExperience: registrationData.danceExperience || "",
          specialRequests: registrationData.specialRequests || ""
        }
      });
      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
      res.status(500).json({ message: "Error creating payment intent: " + error.message });
    }
  });
  app2.get("/api/newsletters", async (req, res) => {
    try {
      const { creatorId } = req.query;
      if (creatorId) {
        const newsletters2 = await storage.getNewslettersByCreator(parseInt(creatorId));
        res.json(newsletters2);
      } else {
        res.status(400).json({ message: "Creator ID required" });
      }
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  app2.post("/api/newsletters", async (req, res) => {
    try {
      const newsletterData = insertNewsletterSchema.parse(req.body);
      if (newsletterData.content) {
        const analysis = await analyzeNewsletterContent(JSON.stringify(newsletterData.content));
        console.log("Newsletter analysis:", analysis);
      }
      const newsletter = await storage.createNewsletter(newsletterData);
      res.json(newsletter);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  app2.put("/api/newsletters/:id", async (req, res) => {
    try {
      const updates = insertNewsletterSchema.partial().parse(req.body);
      const newsletter = await storage.updateNewsletter(parseInt(req.params.id), updates);
      if (!newsletter) {
        return res.status(404).json({ message: "Newsletter not found" });
      }
      res.json(newsletter);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  app2.post("/api/tips", async (req, res) => {
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
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  app2.get("/api/users/:userId/tips", async (req, res) => {
    try {
      const tips2 = await storage.getTipsByUser(parseInt(req.params.userId));
      res.json(tips2);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  app2.post("/api/likes", async (req, res) => {
    try {
      const { videoId, anonymousId } = req.body;
      const likeData = {
        videoId: parseInt(videoId),
        anonymousId: anonymousId || `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      };
      const like = await storage.createLike(likeData);
      res.json(like);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  app2.delete("/api/likes", async (req, res) => {
    try {
      const { anonymousId, videoId } = req.body;
      const success = await storage.deleteLike(anonymousId, videoId);
      if (!success) {
        return res.status(404).json({ message: "Like not found" });
      }
      res.json({ message: "Like removed successfully" });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  app2.post("/api/subscriptions", async (req, res) => {
    try {
      const { creatorId, anonymousId } = req.body;
      const finalAnonymousId = anonymousId || `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const subscription = await storage.createSubscription(finalAnonymousId, parseInt(creatorId));
      res.json(subscription);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  app2.delete("/api/subscriptions", async (req, res) => {
    try {
      const { anonymousId, creatorId } = req.body;
      const success = await storage.deleteSubscription(anonymousId, parseInt(creatorId));
      if (!success) {
        return res.status(404).json({ message: "Subscription not found" });
      }
      res.json({ message: "Subscription removed successfully" });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  app2.delete("/api/subscriptions", async (req, res) => {
    try {
      const { subscriberId, creatorId } = req.body;
      const success = await storage.deleteSubscription(subscriberId, creatorId);
      if (!success) {
        return res.status(404).json({ message: "Subscription not found" });
      }
      res.json({ message: "Unsubscribed successfully" });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  app2.get("/api/ai/insights/:userId", async (req, res) => {
    try {
      const insights = await generateAIInsights(parseInt(req.params.userId));
      res.json(insights);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.get("/api/subscription-stats/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      const subscriptions2 = await storage.getSubscriptionsByCreator(userId);
      const totalSubscribers = subscriptions2.length;
      const monthlyRevenue = totalSubscribers * 7.49;
      const dailyEarnings = monthlyRevenue / 30;
      const thirtyDaysAgo = /* @__PURE__ */ new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const recentSubscribers = subscriptions2.filter((sub) => sub.createdAt && new Date(sub.createdAt) >= thirtyDaysAgo).slice(0, 5).map((sub) => ({
        id: sub.anonymousId,
        subscribedAt: sub.createdAt ? sub.createdAt.toISOString() : (/* @__PURE__ */ new Date()).toISOString(),
        amount: 7.49
      }));
      res.json({
        totalSubscribers,
        monthlyRevenue,
        dailyEarnings,
        recentSubscribers
      });
    } catch (error) {
      console.error("Error fetching subscription stats:", error);
      res.status(500).json({ message: "Failed to fetch subscription stats" });
    }
  });
  app2.post("/api/ai/training-recommendations", async (req, res) => {
    try {
      const { userStyles } = req.body;
      const recommendations = await generateTrainingRecommendations(userStyles || []);
      res.json(recommendations);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.post("/api/create-tip-payment", async (req, res) => {
    try {
      const { amount, videoId, anonymousId } = req.body;
      if (!amount || amount < 0.5) {
        return res.status(400).json({ message: "Minimum tip amount is $0.50" });
      }
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100),
        // Convert to cents
        currency: "usd",
        metadata: {
          videoId: videoId.toString(),
          anonymousId,
          type: "tip"
        }
      });
      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
      res.status(500).json({ message: "Error creating tip payment: " + error.message });
    }
  });
  app2.post("/api/create-subscription", async (req, res) => {
    try {
      const { creatorId, anonymousId } = req.body;
      const existingSubscriptions = await storage.getSubscriptionsByCreator(creatorId);
      const hasSubscription = existingSubscriptions.some((sub) => sub.anonymousId === anonymousId);
      if (hasSubscription) {
        return res.status(400).json({ message: "Already subscribed to this creator" });
      }
      const subscription = await stripe.subscriptions.create({
        customer: await getOrCreateStripeCustomer(anonymousId),
        items: [{
          price_data: {
            currency: "usd",
            product_data: {
              name: "Creator Subscription"
            },
            unit_amount: 999,
            // $9.99 per month
            recurring: {
              interval: "month"
            }
          }
        }],
        payment_behavior: "default_incomplete",
        expand: ["latest_invoice.payment_intent"],
        metadata: {
          creatorId: creatorId.toString(),
          anonymousId,
          type: "subscription"
        }
      });
      res.json({
        subscriptionId: subscription.id,
        clientSecret: subscription.latest_invoice.payment_intent.client_secret
      });
    } catch (error) {
      res.status(500).json({ message: "Error creating subscription: " + error.message });
    }
  });
  app2.get("/api/subscription-status/:creatorId/:anonymousId", async (req, res) => {
    try {
      const { creatorId, anonymousId } = req.params;
      const subscriptions2 = await storage.getSubscriptionsByCreator(parseInt(creatorId));
      const hasSubscription = subscriptions2.some((sub) => sub.anonymousId === anonymousId);
      res.json({ hasSubscription });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  async function getOrCreateStripeCustomer(anonymousId) {
    try {
      const customers = await stripe.customers.list({
        metadata: { anonymousId },
        limit: 1
      });
      if (customers.data.length > 0) {
        return customers.data[0].id;
      }
      const customer = await stripe.customers.create({
        metadata: { anonymousId }
      });
      return customer.id;
    } catch (error) {
      throw new Error("Failed to create or retrieve customer");
    }
  }
  app2.post("/api/stripe-webhook", async (req, res) => {
    try {
      const eventType = req.body.type;
      const object = req.body.data.object;
      if (eventType === "payment_intent.succeeded") {
        if (object.metadata?.type === "tip") {
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
            const newTipAmount = parseFloat(video.tipAmount || "0") + object.amount / 100;
            await storage.updateVideo(parseInt(object.metadata.videoId), {
              tipAmount: newTipAmount.toString()
            });
          }
        } else if (object.metadata?.eventId) {
          const eventId = parseInt(object.metadata.eventId);
          const event = await storage.getEvent(eventId);
          if (event) {
            const updatedParticipants = (event.currentParticipants || 0) + 1;
            await storage.updateEvent(eventId, {
              currentParticipants: updatedParticipants
            });
            console.log(`Event registration successful for ${object.metadata.participantName} to ${object.metadata.eventTitle}`);
          }
        }
      } else if (eventType === "invoice.payment_succeeded") {
        const subscription = object.subscription;
        const metadata = object.metadata || {};
        if (metadata.type === "subscription") {
          await storage.createSubscription(
            metadata.anonymousId,
            parseInt(metadata.creatorId)
          );
        }
      }
      res.json({ received: true });
    } catch (error) {
      res.status(500).json({ message: "Webhook error: " + error.message });
    }
  });
  app2.get("/api/training-sessions", async (req, res) => {
    try {
      const sessions = await storage.getAllTrainingSessions();
      const sessionsWithComments = await Promise.all(
        sessions.map(async (session) => {
          const comments = await storage.getCommentsBySession(session.id);
          return { ...session, comments };
        })
      );
      res.json(sessionsWithComments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch training sessions: " + error.message });
    }
  });
  app2.post("/api/training-sessions", async (req, res) => {
    try {
      const sessionData = req.body;
      const session = await storage.createTrainingSession(sessionData);
      res.json(session);
    } catch (error) {
      res.status(500).json({ message: "Failed to create training session: " + error.message });
    }
  });
  app2.get("/api/training-comments/:sessionId", async (req, res) => {
    try {
      const sessionId = parseInt(req.params.sessionId);
      const comments = await storage.getCommentsBySession(sessionId);
      res.json(comments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch comments: " + error.message });
    }
  });
  app2.post("/api/training-comments", async (req, res) => {
    try {
      const commentData = req.body;
      const comment = await storage.createTrainingComment(commentData);
      res.json(comment);
    } catch (error) {
      res.status(500).json({ message: "Failed to create comment: " + error.message });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
async function setupApp() {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  return { app, server };
}
var index_default = app;
(async () => {
  const { app: app2, server } = await setupApp();
  if (process.env.NODE_ENV === "development") {
    const port = 5e3;
    server.listen({
      port,
      host: "0.0.0.0",
      reusePort: true
    }, () => {
      log(`serving on port ${port}`);
    });
  }
  if (process.env.NODE_ENV === "production" && !process.env.VERCEL) {
    const port = process.env.PORT || 5e3;
    server.listen({
      port,
      host: "0.0.0.0",
      reusePort: true
    }, () => {
      log(`serving on port ${port}`);
    });
  }
})();
export {
  index_default as default
};
