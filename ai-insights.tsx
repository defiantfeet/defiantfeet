import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Bot, Clock, TrendingUp, Users } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { AIInsights as AIInsightsType } from "@/lib/types";

export function AIInsights() {
  const { user } = useAuth();
  
  const { data: insights, isLoading } = useQuery<AIInsightsType>({
    queryKey: ["/api/ai/insights", user?.id],
    enabled: !!user?.id,
  });

  if (isLoading) {
    return (
      <Card className="bg-gradient-to-r from-primary/20 to-secondary/20 border-primary/20">
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-700 rounded mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-surface/50 rounded-lg p-4">
                  <div className="h-4 bg-gray-700 rounded mb-2"></div>
                  <div className="h-6 bg-gray-700 rounded mb-2"></div>
                  <div className="h-3 bg-gray-700 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!insights) return null;

  return (
    <Card className="bg-gradient-to-r from-primary/20 to-secondary/20 border-primary/20">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Bot className="mr-2 text-primary" />
          AI Insights Dashboard
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-surface/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Optimal Post Time</span>
              <Clock className="text-accent h-4 w-4" />
            </div>
            <p className="text-lg font-semibold">{insights.optimalPostTime}</p>
            <p className="text-xs text-gray-400">Based on your audience activity</p>
          </div>
          
          <div className="bg-surface/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Trending Style</span>
              <TrendingUp className="text-secondary h-4 w-4" />
            </div>
            <p className="text-lg font-semibold">{insights.trendingStyle}</p>
            <p className="text-xs text-gray-400">+24% engagement this week</p>
          </div>
          
          <div className="bg-surface/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Collaboration Match</span>
              <Users className="text-primary h-4 w-4" />
            </div>
            <p className="text-lg font-semibold">{insights.collaborationMatches} Available</p>
            <p className="text-xs text-gray-400">In your area</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
