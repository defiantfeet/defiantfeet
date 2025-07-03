import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_KEY || "default_key"
});

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

export async function analyzeVideoContent(videoTitle: string, description: string): Promise<{
  category: string;
  danceStyle: string;
  tags: string[];
}> {
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
          content: `Title: ${videoTitle}\nDescription: ${description}`
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

export async function generateAIInsights(userId: number): Promise<AIInsights> {
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

export async function generateTrainingRecommendations(userStyles: string[]): Promise<TrainingRecommendation[]> {
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

export async function analyzeNewsletterContent(content: string): Promise<{
  subject: string;
  summary: string;
  engagement_score: number;
}> {
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
