import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle, Share, DollarSign, Play, MoreHorizontal } from "lucide-react";
import { VideoWithUser } from "@/lib/types";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest } from "@/lib/queryClient";
import { TipModal } from "@/components/modals/tip-modal";

interface VideoPostProps {
  video: VideoWithUser;
}

export function VideoPost({ video }: VideoPostProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isLiked, setIsLiked] = useState(false);
  const [showTipModal, setShowTipModal] = useState(false);
  
  // Generate a persistent anonymous ID for this session
  const getAnonymousId = () => {
    let anonymousId = localStorage.getItem('defiantfeet_anonymous_id');
    if (!anonymousId) {
      anonymousId = `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('defiantfeet_anonymous_id', anonymousId);
    }
    return anonymousId;
  };

  const likeMutation = useMutation({
    mutationFn: async () => {
      const anonymousId = getAnonymousId();
      if (isLiked) {
        return apiRequest("DELETE", "/api/likes", {
          anonymousId,
          videoId: video.id,
        });
      } else {
        return apiRequest("POST", "/api/likes", {
          anonymousId,
          videoId: video.id,
        });
      }
    },
    onSuccess: () => {
      setIsLiked(!isLiked);
      queryClient.invalidateQueries({ queryKey: ["/api/videos"] });
    },
  });

  const handleLike = () => {
    if (user) {
      likeMutation.mutate();
    }
  };

  const formatTime = (seconds?: number) => {
    if (!seconds) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <Card className="bg-surface overflow-hidden">
        <CardContent className="p-0">
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={video.user?.profileImage} />
                <AvatarFallback>{video.user?.displayName?.[0] || "U"}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{video.user?.displayName || "Unknown User"}</p>
                <p className="text-sm text-gray-400">
                  {video.danceStyle} • {new Date(video.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="relative group">
            <img 
              src={video.thumbnailUrl || "https://images.unsplash.com/photo-1547036967-23d11aacaee0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"} 
              alt={video.title}
              className="w-full aspect-video object-cover"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center">
              <Button className="bg-white/20 backdrop-blur-sm rounded-full p-4 hover:bg-white/30 transition-colors">
                <Play className="text-white h-6 w-6" />
              </Button>
            </div>
            {video.duration && (
              <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1">
                <span className="text-white text-sm">{formatTime(video.duration)}</span>
              </div>
            )}
            {video.isAiEnhanced && (
              <div className="absolute top-4 right-4">
                <Badge className="bg-accent text-black">AI Enhanced</Badge>
              </div>
            )}
          </div>

          <div className="p-4">
            <p className="mb-3">{video.title}</p>
            {video.description && (
              <p className="text-sm text-gray-400 mb-3">{video.description}</p>
            )}
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLike}
                  className={`flex items-center space-x-2 ${
                    isLiked ? "text-red-400" : "text-gray-400 hover:text-red-400"
                  }`}
                >
                  <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
                  <span>{video.likeCount}</span>
                </Button>
                <Button variant="ghost" size="sm" className="flex items-center space-x-2 text-gray-400 hover:text-blue-400">
                  <MessageCircle className="h-4 w-4" />
                  <span>89</span>
                </Button>
                <Button variant="ghost" size="sm" className="flex items-center space-x-2 text-gray-400 hover:text-green-400">
                  <Share className="h-4 w-4" />
                  <span>34</span>
                </Button>
              </div>
              <div className="flex items-center space-x-2">
                <Button 
                  onClick={() => setShowTipModal(true)}
                  className="bg-accent text-black hover:bg-accent/80 transition-colors flex items-center space-x-1"
                >
                  <DollarSign className="h-4 w-4" />
                  <span>Tip</span>
                </Button>
                <Button className="bg-secondary text-white hover:bg-secondary/80 transition-colors">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <TipModal
        isOpen={showTipModal}
        onClose={() => setShowTipModal(false)}
        video={video}
      />
    </>
  );
}
