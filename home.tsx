import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/navigation/header";
import { VideoPost } from "@/components/video/video-post";
import { AIInsights } from "@/components/ai/ai-insights";
import { EventCard } from "@/components/events/event-card";
import { HeadshotGallery } from "@/components/headshots/headshot-gallery";
import { NewsletterManager } from "@/components/newsletter/newsletter-manager";
import { SubscriptionModal } from "@/components/modals/subscription-modal";
import { VideoWithUser } from "@/lib/types";
import { Event } from "@shared/schema";
import { TrainingRecommendations } from "@/components/training/training-recommendations";
import { Calendar, Lock, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  const [subscriptionModal, setSubscriptionModal] = useState<{
    isOpen: boolean;
    creatorId: number;
    creatorName: string;
  }>({
    isOpen: false,
    creatorId: 0,
    creatorName: ""
  });

  const { data: videos, isLoading: videosLoading } = useQuery<VideoWithUser[]>({
    queryKey: ["/api/videos"],
  });

  const { data: events, isLoading: eventsLoading } = useQuery<Event[]>({
    queryKey: ["/api/events"],
  });

  // Mock data for demo
  const mockVideos: VideoWithUser[] = [
    {
      id: 1,
      userId: 1,
      title: "New choreography piece inspired by urban landscapes 🏙️",
      description: "What do you think about this style fusion? #HipHop #Contemporary #UrbanDance",
      videoUrl: "/video1.mp4",
      thumbnailUrl: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      duration: 154,
      category: "performance",
      danceStyle: "Hip-Hop",
      isAiEnhanced: true,
      isSubscriptionOnly: false,
      viewCount: 3420,
      likeCount: 1200,
      tipAmount: "247.50",
      createdAt: new Date(),
      user: {
        displayName: "Marcus Rodriguez",
        username: "marcus_dance",
        profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
        isVerified: true
      }
    },
    {
      id: 2,
      userId: 2,
      title: "Complete barre workout for beginners",
      description: "Focusing on proper form and muscle memory. Perfect your fundamentals! 🩰 #Ballet #Training #Technique",
      videoUrl: "/video2.mp4",
      thumbnailUrl: "https://images.unsplash.com/photo-1518834107812-67b0b7c58434?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      duration: 495,
      category: "training",
      danceStyle: "Ballet",
      isAiEnhanced: false,
      isSubscriptionOnly: true,
      viewCount: 1856,
      likeCount: 856,
      tipAmount: "128.75",
      createdAt: new Date(),
      user: {
        displayName: "Elena Volkov",
        username: "elena_ballet",
        profileImage: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
        isVerified: true
      }
    }
  ];

  const mockEvents: Event[] = [
    {
      id: 1,
      creatorId: 1,
      title: "Urban Dance Championship",
      description: "Open registration - All styles welcome",
      imageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
      location: "Downtown Arts Center",
      startDate: new Date("2024-03-15"),
      endDate: null,
      eventType: "competition",
      registrationRequired: true,
      maxParticipants: 100,
      currentParticipants: 47,
      price: "50.00",
      createdAt: new Date()
    },
    {
      id: 2,
      creatorId: 2,
      title: "Contemporary Masterclass",
      description: "With guest instructor Maya Chen",
      imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
      location: "Studio Luna",
      startDate: new Date("2024-03-20"),
      endDate: null,
      eventType: "workshop",
      registrationRequired: true,
      maxParticipants: 25,
      currentParticipants: 18,
      price: "75.00",
      createdAt: new Date()
    },
    {
      id: 3,
      creatorId: 3,
      title: "Spring Showcase",
      description: "Student and professional performances",
      imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
      location: "Metropolitan Theater",
      startDate: new Date("2024-04-05"),
      endDate: null,
      eventType: "showcase",
      registrationRequired: false,
      maxParticipants: null,
      currentParticipants: 0,
      price: "25.00",
      createdAt: new Date()
    }
  ];

  const displayVideos = videos && videos.length > 0 ? videos : mockVideos;
  const displayEvents = events && events.length > 0 ? events : mockEvents;

  // Component for subscription-locked videos
  const SubscriptionLockedVideo = ({ video }: { video: VideoWithUser }) => {
    const handleSubscribe = () => {
      setSubscriptionModal({
        isOpen: true,
        creatorId: video.userId,
        creatorName: video.user?.displayName || "Creator"
      });
    };

    return (
      <div className="bg-surface rounded-xl overflow-hidden border border-gray-700">
        <div className="relative">
          <img
            src={video.thumbnailUrl}
            alt={video.title}
            className="w-full h-64 object-cover filter blur-sm"
          />
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <div className="text-center">
              <Lock className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
              <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30 mb-4">
                <Crown className="w-4 h-4 mr-2" />
                Premium Content
              </Badge>
              <h3 className="text-xl font-semibold mb-2">{video.title}</h3>
              <p className="text-gray-300 mb-4 max-w-md mx-auto">{video.description}</p>
              <Button onClick={handleSubscribe} className="bg-primary hover:bg-primary/80">
                Subscribe to Watch • $9.99/month
              </Button>
            </div>
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-center gap-3">
            <img
              src={video.user?.profileImage}
              alt={video.user?.displayName}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="font-medium">{video.user?.displayName}</p>
              <p className="text-sm text-gray-400">Subscription required</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-dark text-gray-100">
      <Header />
      
      <div className="container mx-auto px-4 pt-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Your Dance Community</h1>
          <p className="text-gray-400">Discover amazing dance content from creators worldwide</p>
        </div>

        {/* Main Content */}
        <div className="p-4 lg:p-6 space-y-6">
          {/* AI Insights Dashboard */}
          <AIInsights />

          {/* Video Feed */}
          <div className="max-w-4xl mx-auto space-y-6">
            {displayVideos.map((video) => (
              video.isSubscriptionOnly ? (
                <SubscriptionLockedVideo key={video.id} video={video} />
              ) : (
                <VideoPost key={video.id} video={video} />
              )
            ))}
          </div>

          {/* Events Section */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-surface rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Calendar className="mr-2 text-secondary" />
                Upcoming Events
              </h3>
              <div className="space-y-4">
                {displayEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </div>
          </div>

          {/* Professional Headshots Gallery */}
          <div className="max-w-4xl mx-auto">
            <HeadshotGallery />
          </div>

          {/* Newsletter Management */}
          <div className="max-w-4xl mx-auto">
            <NewsletterManager />
          </div>

          {/* Training Recommendations */}
          <div className="max-w-4xl mx-auto">
            <TrainingRecommendations />
          </div>
        </div>
      </div>

      {/* Subscription Modal */}
      <SubscriptionModal 
        isOpen={subscriptionModal.isOpen}
        onClose={() => setSubscriptionModal({ isOpen: false, creatorId: 0, creatorName: "" })}
        creatorId={subscriptionModal.creatorId}
        creatorName={subscriptionModal.creatorName}
      />
    </div>
  );
}
