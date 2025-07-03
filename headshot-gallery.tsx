import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera } from "lucide-react";
import { Headshot } from "@shared/schema";

export function HeadshotGallery() {
  const { data: headshots, isLoading } = useQuery<Headshot[]>({
    queryKey: ["/api/headshots"],
  });

  if (isLoading) {
    return (
      <Card className="bg-surface">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Camera className="mr-2 text-accent" />
            Featured Professional Headshots
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-[4/5] bg-gray-700 rounded-lg animate-pulse"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const featuredHeadshots = [
    {
      id: 1,
      imageUrl: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500",
      name: "Alex Thompson",
      specialty: "Jazz Specialist"
    },
    {
      id: 2,
      imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500",
      name: "Sofia Martinez",
      specialty: "Contemporary"
    },
    {
      id: 3,
      imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500",
      name: "Jordan Kim",
      specialty: "Hip-Hop Choreographer"
    },
    {
      id: 4,
      imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500",
      name: "Chris Anderson",
      specialty: "Ballet Master"
    }
  ];

  return (
    <Card className="bg-surface">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Camera className="mr-2 text-accent" />
          Featured Professional Headshots
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {featuredHeadshots.map((headshot) => (
            <div key={headshot.id} className="relative group cursor-pointer">
              <img 
                src={headshot.imageUrl} 
                alt={`Professional headshot of ${headshot.name}`}
                className="w-full aspect-[4/5] object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-end">
                <div className="p-4 text-white">
                  <p className="font-semibold">{headshot.name}</p>
                  <p className="text-sm">{headshot.specialty}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
