export interface CurrentUser {
  id: number;
  email: string;
  displayName: string;
  bio?: string;
  profileImage?: string;
  danceStyles?: string[];
  location?: string;
  agency?: string;
}

export interface VideoWithUser {
  id: number;
  userId: number;
  title: string;
  description?: string;
  videoUrl: string;
  thumbnailUrl?: string;
  duration?: number;
  category: string;
  danceStyle?: string;
  isAiEnhanced: boolean;
  isSubscriptionOnly: boolean;
  viewCount: number;
  likeCount: number;
  tipAmount: string;
  createdAt: Date;
  user?: {
    displayName: string;
    profileImage?: string;
  };
}

export interface AIInsights {
  optimalPostTime: string;
  trendingStyle: string;
  collaborationMatches: number;
  engagement: {
    likes: number;
    comments: number;
    shares: number;
  };
}

export interface TrainingRecommendation {
  title: string;
  description: string;
  duration: string;
  frequency: string;
  targetStyles: string[];
  priority: 'recommended' | 'suggested';
}
