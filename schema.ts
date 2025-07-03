import { pgTable, text, serial, integer, boolean, timestamp, json, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  displayName: text("display_name").notNull(),
  bio: text("bio"),
  profileImage: text("profile_image"),
  danceStyles: text("dance_styles").array(),
  location: text("location"),
  agency: text("agency"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const videos = pgTable("videos", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  videoUrl: text("video_url").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  duration: integer("duration"), // in seconds
  category: text("category").notNull(), // 'performance', 'training', 'tutorial'
  danceStyle: text("dance_style"),
  isAiEnhanced: boolean("is_ai_enhanced").default(false),
  isSubscriptionOnly: boolean("is_subscription_only").default(false),
  viewCount: integer("view_count").default(0),
  likeCount: integer("like_count").default(0),
  tipAmount: decimal("tip_amount", { precision: 10, scale: 2 }).default("0.00"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const headshots = pgTable("headshots", {
  id: serial("id").primaryKey(), 
  userId: integer("user_id").references(() => users.id).notNull(),
  imageUrl: text("image_url").notNull(),
  title: text("title"),
  description: text("description"),
  tags: text("tags").array(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  creatorId: integer("creator_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
  location: text("location").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  eventType: text("event_type").notNull(), // 'competition', 'workshop', 'showcase'
  registrationRequired: boolean("registration_required").default(false),
  maxParticipants: integer("max_participants"),
  currentParticipants: integer("current_participants").default(0),
  price: decimal("price", { precision: 10, scale: 2 }).default("0.00"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const newsletters = pgTable("newsletters", {
  id: serial("id").primaryKey(),
  creatorId: integer("creator_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  content: json("content"), // Rich text content
  templateType: text("template_type").notNull(),
  status: text("status").notNull().default("draft"), // 'draft', 'scheduled', 'sent'
  scheduledDate: timestamp("scheduled_date"),
  subscriberCount: integer("subscriber_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  creatorId: integer("creator_id").references(() => users.id).notNull(),
  anonymousId: text("anonymous_id").notNull(), // Anonymous identifier for the subscriber
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const tips = pgTable("tips", {
  id: serial("id").primaryKey(),
  toUserId: integer("to_user_id").references(() => users.id).notNull(),
  videoId: integer("video_id").references(() => videos.id),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  message: text("message"),
  anonymousId: text("anonymous_id").notNull(), // Anonymous identifier for the tipper
  createdAt: timestamp("created_at").defaultNow(),
});

export const likes = pgTable("likes", {
  id: serial("id").primaryKey(),
  videoId: integer("video_id").references(() => videos.id).notNull(),
  anonymousId: text("anonymous_id").notNull(), // Anonymous identifier for the liker
  createdAt: timestamp("created_at").defaultNow(),
});

export const trainingSessions = pgTable("training_sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  anonymousId: text("anonymous_id"),
  className: text("class_name").notNull(),
  instructor: text("instructor"),
  studio: text("studio"),
  danceStyle: text("dance_style"),
  difficulty: text("difficulty"), // 'beginner', 'intermediate', 'advanced'
  duration: integer("duration"), // in minutes
  feeling: text("feeling").notNull(), // 'amazing', 'good', 'okay', 'challenging', 'frustrated'
  notes: text("notes"),
  rating: integer("rating"), // 1-5 stars
  createdAt: timestamp("created_at").defaultNow(),
});

export const trainingComments = pgTable("training_comments", {
  id: serial("id").primaryKey(),
  sessionId: integer("session_id").references(() => trainingSessions.id).notNull(),
  anonymousId: text("anonymous_id").notNull(),
  comment: text("comment").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertVideoSchema = createInsertSchema(videos).omit({
  id: true,
  viewCount: true,
  likeCount: true,
  tipAmount: true,
  createdAt: true,
});

export const insertHeadshotSchema = createInsertSchema(headshots).omit({
  id: true,
  createdAt: true,
});

export const insertEventSchema = createInsertSchema(events).omit({
  id: true,
  currentParticipants: true,
  createdAt: true,
});

export const insertNewsletterSchema = createInsertSchema(newsletters).omit({
  id: true,
  subscriberCount: true,
  createdAt: true,
});

export const insertTipSchema = createInsertSchema(tips).omit({
  id: true,
  createdAt: true,
});

export const insertLikeSchema = createInsertSchema(likes).omit({
  id: true,
  createdAt: true,
});

export const insertSubscriptionSchema = createInsertSchema(subscriptions).omit({
  id: true,
  createdAt: true,
});

export const insertTrainingSessionSchema = createInsertSchema(trainingSessions).omit({
  id: true,
  createdAt: true,
});

export const insertTrainingCommentSchema = createInsertSchema(trainingComments).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Video = typeof videos.$inferSelect;
export type InsertVideo = z.infer<typeof insertVideoSchema>;
export type Headshot = typeof headshots.$inferSelect;
export type InsertHeadshot = z.infer<typeof insertHeadshotSchema>;
export type Event = typeof events.$inferSelect;
export type InsertEvent = z.infer<typeof insertEventSchema>;
export type Newsletter = typeof newsletters.$inferSelect;
export type InsertNewsletter = z.infer<typeof insertNewsletterSchema>;
export type Tip = typeof tips.$inferSelect;
export type InsertTip = z.infer<typeof insertTipSchema>;
export type Like = typeof likes.$inferSelect;
export type InsertLike = z.infer<typeof insertLikeSchema>;
export type Subscription = typeof subscriptions.$inferSelect;
export type TrainingSession = typeof trainingSessions.$inferSelect;
export type InsertTrainingSession = z.infer<typeof insertTrainingSessionSchema>;
export type TrainingComment = typeof trainingComments.$inferSelect;
export type InsertTrainingComment = z.infer<typeof insertTrainingCommentSchema>;
