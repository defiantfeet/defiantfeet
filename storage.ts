import { 
  users, videos, headshots, events, newsletters, subscriptions, tips, likes,
  trainingSessions, trainingComments,
  type User, type InsertUser, type Video, type InsertVideo, 
  type Headshot, type InsertHeadshot, type Event, type InsertEvent,
  type Newsletter, type InsertNewsletter, type Tip, type InsertTip,
  type Like, type InsertLike, type Subscription, 
  type TrainingSession, type InsertTrainingSession,
  type TrainingComment, type InsertTrainingComment
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User | undefined>;

  // Videos
  getVideo(id: number): Promise<Video | undefined>;
  getVideosByUser(userId: number): Promise<Video[]>;
  getAllVideos(): Promise<Video[]>;
  createVideo(video: InsertVideo): Promise<Video>;
  updateVideo(id: number, video: Partial<InsertVideo>): Promise<Video | undefined>;
  deleteVideo(id: number): Promise<boolean>;

  // Headshots
  getHeadshot(id: number): Promise<Headshot | undefined>;
  getHeadshotsByUser(userId: number): Promise<Headshot[]>;
  getAllHeadshots(): Promise<Headshot[]>;
  createHeadshot(headshot: InsertHeadshot): Promise<Headshot>;
  deleteHeadshot(id: number): Promise<boolean>;

  // Events
  getEvent(id: number): Promise<Event | undefined>;
  getAllEvents(): Promise<Event[]>;
  getEventsByCreator(creatorId: number): Promise<Event[]>;
  createEvent(event: InsertEvent): Promise<Event>;
  updateEvent(id: number, event: Partial<InsertEvent>): Promise<Event | undefined>;
  deleteEvent(id: number): Promise<boolean>;

  // Newsletters
  getNewsletter(id: number): Promise<Newsletter | undefined>;
  getNewslettersByCreator(creatorId: number): Promise<Newsletter[]>;
  createNewsletter(newsletter: InsertNewsletter): Promise<Newsletter>;
  updateNewsletter(id: number, newsletter: Partial<InsertNewsletter>): Promise<Newsletter | undefined>;

  // Tips
  createTip(tip: InsertTip): Promise<Tip>;
  getTipsByUser(userId: number): Promise<Tip[]>;
  getTipsByVideo(videoId: number): Promise<Tip[]>;

  // Likes (Anonymous)
  createLike(like: InsertLike): Promise<Like>;
  deleteLike(anonymousId: string, videoId: number): Promise<boolean>;
  getLikesByVideo(videoId: number): Promise<Like[]>;

  // Subscriptions (Anonymous)
  createSubscription(anonymousId: string, creatorId: number): Promise<Subscription>;
  deleteSubscription(anonymousId: string, creatorId: number): Promise<boolean>;
  getSubscriptionsByCreator(creatorId: number): Promise<Subscription[]>;

  // Training Sessions
  getTrainingSession(id: number): Promise<TrainingSession | undefined>;
  getAllTrainingSessions(): Promise<TrainingSession[]>;
  createTrainingSession(session: InsertTrainingSession): Promise<TrainingSession>;

  // Training Comments
  getTrainingComment(id: number): Promise<TrainingComment | undefined>;
  getCommentsBySession(sessionId: number): Promise<TrainingComment[]>;
  createTrainingComment(comment: InsertTrainingComment): Promise<TrainingComment>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }



  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(id: number, updates: Partial<InsertUser>): Promise<User | undefined> {
    const [user] = await db.update(users).set(updates).where(eq(users.id, id)).returning();
    return user || undefined;
  }

  // Videos
  async getVideo(id: number): Promise<Video | undefined> {
    const [video] = await db.select().from(videos).where(eq(videos.id, id));
    return video || undefined;
  }

  async getVideosByUser(userId: number): Promise<Video[]> {
    return await db.select().from(videos).where(eq(videos.userId, userId));
  }

  async getAllVideos(): Promise<Video[]> {
    return await db.select().from(videos).orderBy(videos.createdAt);
  }

  async createVideo(insertVideo: InsertVideo): Promise<Video> {
    const [video] = await db.insert(videos).values({
      ...insertVideo,
      viewCount: 0,
      likeCount: 0,
      tipAmount: "0.00"
    }).returning();
    return video;
  }

  async updateVideo(id: number, updates: Partial<InsertVideo>): Promise<Video | undefined> {
    const [video] = await db.update(videos).set(updates).where(eq(videos.id, id)).returning();
    return video || undefined;
  }

  async deleteVideo(id: number): Promise<boolean> {
    const result = await db.delete(videos).where(eq(videos.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Headshots
  async getHeadshot(id: number): Promise<Headshot | undefined> {
    const [headshot] = await db.select().from(headshots).where(eq(headshots.id, id));
    return headshot || undefined;
  }

  async getHeadshotsByUser(userId: number): Promise<Headshot[]> {
    return await db.select().from(headshots).where(eq(headshots.userId, userId));
  }

  async getAllHeadshots(): Promise<Headshot[]> {
    return await db.select().from(headshots);
  }

  async createHeadshot(insertHeadshot: InsertHeadshot): Promise<Headshot> {
    const [headshot] = await db.insert(headshots).values(insertHeadshot).returning();
    return headshot;
  }

  async deleteHeadshot(id: number): Promise<boolean> {
    const result = await db.delete(headshots).where(eq(headshots.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Events  
  async getEvent(id: number): Promise<Event | undefined> {
    const [event] = await db.select().from(events).where(eq(events.id, id));
    return event || undefined;
  }

  async getAllEvents(): Promise<Event[]> {
    return await db.select().from(events).orderBy(events.startDate);
  }

  async getEventsByCreator(creatorId: number): Promise<Event[]> {
    return await db.select().from(events).where(eq(events.creatorId, creatorId));
  }

  async createEvent(insertEvent: InsertEvent): Promise<Event> {
    const [event] = await db.insert(events).values({
      ...insertEvent,
      currentParticipants: 0
    }).returning();
    return event;
  }

  async updateEvent(id: number, updates: Partial<InsertEvent>): Promise<Event | undefined> {
    const [event] = await db.update(events).set(updates).where(eq(events.id, id)).returning();
    return event || undefined;
  }

  async deleteEvent(id: number): Promise<boolean> {
    const result = await db.delete(events).where(eq(events.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Newsletters
  async getNewsletter(id: number): Promise<Newsletter | undefined> {
    const [newsletter] = await db.select().from(newsletters).where(eq(newsletters.id, id));
    return newsletter || undefined;
  }

  async getNewslettersByCreator(creatorId: number): Promise<Newsletter[]> {
    return await db.select().from(newsletters).where(eq(newsletters.creatorId, creatorId));
  }

  async createNewsletter(insertNewsletter: InsertNewsletter): Promise<Newsletter> {
    const [newsletter] = await db.insert(newsletters).values({
      ...insertNewsletter,
      subscriberCount: 0,
      status: insertNewsletter.status || "draft"
    }).returning();
    return newsletter;
  }

  async updateNewsletter(id: number, updates: Partial<InsertNewsletter>): Promise<Newsletter | undefined> {
    const [newsletter] = await db.update(newsletters).set(updates).where(eq(newsletters.id, id)).returning();
    return newsletter || undefined;
  }

  // Tips
  async createTip(insertTip: InsertTip): Promise<Tip> {
    const [tip] = await db.insert(tips).values(insertTip).returning();
    
    // Update video tip amount
    if (insertTip.videoId) {
      const [video] = await db.select().from(videos).where(eq(videos.id, insertTip.videoId));
      if (video) {
        const currentAmount = parseFloat(video.tipAmount || "0");
        const newAmount = currentAmount + parseFloat(insertTip.amount);
        await db.update(videos)
          .set({ tipAmount: newAmount.toFixed(2) })
          .where(eq(videos.id, insertTip.videoId));
      }
    }
    
    return tip;
  }

  async getTipsByUser(userId: number): Promise<Tip[]> {
    return await db.select().from(tips).where(eq(tips.toUserId, userId));
  }

  async getTipsByVideo(videoId: number): Promise<Tip[]> {
    return await db.select().from(tips).where(eq(tips.videoId, videoId));
  }

  // Likes
  async createLike(insertLike: InsertLike): Promise<Like> {
    const [like] = await db.insert(likes).values(insertLike).returning();
    
    // Update video like count
    const [video] = await db.select().from(videos).where(eq(videos.id, insertLike.videoId));
    if (video) {
      await db.update(videos)
        .set({ likeCount: (video.likeCount || 0) + 1 })
        .where(eq(videos.id, insertLike.videoId));
    }
    
    return like;
  }

  async deleteLike(anonymousId: string, videoId: number): Promise<boolean> {
    const result = await db.delete(likes)
      .where(and(eq(likes.anonymousId, anonymousId), eq(likes.videoId, videoId)));
    
    if ((result.rowCount ?? 0) > 0) {
      // Update video like count
      const [video] = await db.select().from(videos).where(eq(videos.id, videoId));
      if (video && video.likeCount && video.likeCount > 0) {
        await db.update(videos)
          .set({ likeCount: video.likeCount - 1 })
          .where(eq(videos.id, videoId));
      }
      return true;
    }
    
    return false;
  }

  async getLikesByVideo(videoId: number): Promise<Like[]> {
    return await db.select().from(likes).where(eq(likes.videoId, videoId));
  }

  // Subscriptions (Anonymous)
  async createSubscription(anonymousId: string, creatorId: number): Promise<Subscription> {
    const [subscription] = await db.insert(subscriptions).values({
      anonymousId,
      creatorId,
      isActive: true
    }).returning();
    return subscription;
  }

  async deleteSubscription(anonymousId: string, creatorId: number): Promise<boolean> {
    const result = await db.delete(subscriptions)
      .where(and(eq(subscriptions.anonymousId, anonymousId), eq(subscriptions.creatorId, creatorId)));
    return (result.rowCount ?? 0) > 0;
  }

  async getSubscriptionsByCreator(creatorId: number): Promise<Subscription[]> {
    return await db.select().from(subscriptions).where(eq(subscriptions.creatorId, creatorId));
  }

  // Training Sessions
  async getTrainingSession(id: number): Promise<TrainingSession | undefined> {
    const [session] = await db.select().from(trainingSessions).where(eq(trainingSessions.id, id));
    return session || undefined;
  }

  async getAllTrainingSessions(): Promise<TrainingSession[]> {
    return await db.select().from(trainingSessions).orderBy(desc(trainingSessions.createdAt));
  }

  async createTrainingSession(insertSession: InsertTrainingSession): Promise<TrainingSession> {
    const [session] = await db.insert(trainingSessions).values(insertSession).returning();
    return session;
  }

  // Training Comments
  async getTrainingComment(id: number): Promise<TrainingComment | undefined> {
    const [comment] = await db.select().from(trainingComments).where(eq(trainingComments.id, id));
    return comment || undefined;
  }

  async getCommentsBySession(sessionId: number): Promise<TrainingComment[]> {
    return await db.select().from(trainingComments)
      .where(eq(trainingComments.sessionId, sessionId))
      .orderBy(trainingComments.createdAt);
  }

  async createTrainingComment(insertComment: InsertTrainingComment): Promise<TrainingComment> {
    const [comment] = await db.insert(trainingComments).values(insertComment).returning();
    return comment;
  }
}

export const storage = new DatabaseStorage();
