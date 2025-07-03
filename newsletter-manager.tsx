import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Newspaper } from "lucide-react";
import { Newsletter } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";

export function NewsletterManager() {
  const { user } = useAuth();
  
  const { data: newsletters, isLoading } = useQuery<Newsletter[]>({
    queryKey: ["/api/newsletters", user?.id],
    enabled: !!user?.id,
  });

  if (isLoading) {
    return (
      <Card className="bg-surface">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Newspaper className="mr-2 text-primary" />
            Newsletter Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="bg-dark/50 rounded-lg p-4 animate-pulse">
                <div className="h-6 bg-gray-700 rounded mb-3"></div>
                <div className="h-32 bg-gray-800 rounded mb-3"></div>
                <div className="flex justify-between">
                  <div className="h-4 bg-gray-700 rounded w-32"></div>
                  <div className="h-4 bg-gray-700 rounded w-24"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const mockNewsletters = [
    {
      id: 1,
      title: "Weekly Dance Digest",
      status: "active",
      subscriberCount: 1247,
      scheduledDate: "March 18, 2024",
      templateImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400"
    },
    {
      id: 2,
      title: "Event Announcements",
      status: "draft",
      subscriberCount: 892,
      scheduledDate: "March 20, 2024",
      templateImage: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400"
    }
  ];

  return (
    <Card className="bg-surface">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Newspaper className="mr-2 text-primary" />
          Newsletter Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockNewsletters.map((newsletter) => (
            <div key={newsletter.id} className="bg-dark/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold">{newsletter.title}</h4>
                <Badge className={newsletter.status === 'active' ? 'bg-accent text-black' : 'bg-gray-600 text-white'}>
                  {newsletter.status}
                </Badge>
              </div>
              <div className="bg-gray-800 rounded-lg p-4 mb-3">
                <img 
                  src={newsletter.templateImage} 
                  alt="Newsletter template"
                  className="w-full h-32 object-cover rounded"
                />
              </div>
              <div className="flex items-center justify-between text-sm text-gray-400">
                <span>{newsletter.subscriberCount} subscribers</span>
                <span>Next: {newsletter.scheduledDate}</span>
              </div>
            </div>
          ))}
        </div>
        
        <Button className="w-full mt-4 bg-primary text-white hover:bg-primary/80">
          Create New Newsletter
        </Button>
      </CardContent>
    </Card>
  );
}
