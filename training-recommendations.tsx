import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dumbbell, Calendar, Clock, Target } from "lucide-react";
import { TrainingRecommendation } from "@/lib/types";
import { useAuth } from "@/hooks/use-auth";

export function TrainingRecommendations() {
  const { user } = useAuth();
  
  const { data: recommendations, isLoading } = useQuery<TrainingRecommendation[]>({
    queryKey: ["/api/ai/training-recommendations"],
    queryFn: async () => {
      const response = await fetch("/api/ai/training-recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userStyles: user?.danceStyles || [] }),
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch recommendations");
      return response.json();
    },
    enabled: !!user,
  });

  if (isLoading) {
    return (
      <Card className="bg-surface">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Dumbbell className="mr-2 text-secondary" />
            AI Training Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="bg-dark/50 rounded-lg p-4 animate-pulse">
                <div className="h-6 bg-gray-700 rounded mb-3"></div>
                <div className="h-16 bg-gray-700 rounded mb-3"></div>
                <div className="flex space-x-4">
                  <div className="h-4 bg-gray-700 rounded w-16"></div>
                  <div className="h-4 bg-gray-700 rounded w-20"></div>
                  <div className="h-4 bg-gray-700 rounded w-24"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const mockRecommendations: TrainingRecommendation[] = [
    {
      title: "Flexibility Focus Week",
      description: "Based on your recent performances, improve your range of motion with targeted stretching routines.",
      duration: "30 min/day",
      frequency: "5 days",
      targetStyles: ["hip-hop", "contemporary"],
      priority: "recommended"
    },
    {
      title: "Core Strength Building",
      description: "Enhance your stability and control with these ballet-inspired core exercises.",
      duration: "20 min/day",
      frequency: "3 days",
      targetStyles: ["ballet", "contemporary"],
      priority: "suggested"
    }
  ];

  const displayRecommendations = recommendations && recommendations.length > 0 ? recommendations : mockRecommendations;

  return (
    <Card className="bg-surface">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Dumbbell className="mr-2 text-secondary" />
          AI Training Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayRecommendations.map((rec, index) => (
            <div 
              key={index} 
              className={`rounded-lg p-4 border ${
                rec.priority === 'recommended' 
                  ? 'bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20' 
                  : 'bg-dark/50 border-gray-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold">{rec.title}</h4>
                <Badge className={rec.priority === 'recommended' ? 'bg-primary text-white' : 'bg-gray-600 text-white'}>
                  {rec.priority}
                </Badge>
              </div>
              <p className="text-sm text-gray-300 mb-3">{rec.description}</p>
              <div className="flex items-center space-x-4 text-xs text-gray-400">
                <span className="flex items-center space-x-1">
                  <Calendar className="h-3 w-3" />
                  <span>{rec.frequency}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Clock className="h-3 w-3" />
                  <span>{rec.duration}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Target className="h-3 w-3" />
                  <span>{rec.targetStyles.join(", ")}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
