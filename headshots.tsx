import { Header } from "@/components/navigation/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera, Upload, Plus, Grid, List, Filter, Star } from "lucide-react";
import { HeadshotGallery } from "@/components/headshots/headshot-gallery";

export default function Headshots() {
  const categories = [
    { name: "All", count: 24, active: true },
    { name: "Studio", count: 12, active: false },
    { name: "Outdoor", count: 8, active: false },
    { name: "Performance", count: 4, active: false }
  ];

  const featuredHeadshots = [
    {
      id: 1,
      url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
      title: "Professional Studio Shot",
      photographer: "Maya Studios",
      category: "Studio",
      featured: true,
      likes: 23
    },
    {
      id: 2,
      url: "https://images.unsplash.com/photo-1494790108755-2616c9d58e93?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
      title: "Natural Light Portrait",
      photographer: "Dance Focus",
      category: "Outdoor",
      featured: true,
      likes: 18
    },
    {
      id: 3,
      url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
      title: "Performance Capture",
      photographer: "Stage Photos",
      category: "Performance",
      featured: false,
      likes: 31
    }
  ];

  return (
    <div className="min-h-screen bg-dark text-gray-100">
      <Header />
      
      <div className="container mx-auto px-4 pt-6">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2 flex items-center">
                <Camera className="mr-3 text-primary" />
                Professional Headshots
              </h1>
              <p className="text-gray-400">Showcase your professional dance portraits</p>
            </div>
            <Button className="bg-primary hover:bg-primary/80">
              <Plus className="h-4 w-4 mr-2" />
              Upload Headshot
            </Button>
          </div>
        </div>

        {/* Upload Section */}
        <div className="mb-8">
          <Card className="bg-surface border-gray-700">
            <CardContent className="p-6">
              <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
                <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Add New Headshots</h3>
                <p className="text-gray-400 mb-4">Upload professional photos to your portfolio</p>
                <div className="flex justify-center space-x-4">
                  <Button variant="outline">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Photos
                  </Button>
                  <Button variant="secondary">
                    Find Photographer
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Categories and Filters */}
        <div className="mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category.name}
                  variant={category.active ? "default" : "outline"}
                  size="sm"
                  className="h-8"
                >
                  {category.name} ({category.count})
                </Button>
              ))}
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button variant="ghost" size="sm">
                <Grid className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Featured Headshots */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Featured Headshots</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredHeadshots.map((headshot) => (
              <Card key={headshot.id} className="bg-surface border-gray-700 hover:border-gray-600 transition-all cursor-pointer group overflow-hidden">
                <div className="aspect-[3/4] bg-gray-800 overflow-hidden relative">
                  <img 
                    src={headshot.url} 
                    alt={headshot.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  {headshot.featured && (
                    <Badge className="absolute top-2 left-2 bg-yellow-500 text-black">
                      <Star className="h-3 w-3 mr-1" />
                      Featured
                    </Badge>
                  )}
                  <div className="absolute bottom-2 right-2 bg-black/50 rounded-full px-2 py-1 text-xs">
                    ❤️ {headshot.likes}
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-1">{headshot.title}</h3>
                  <p className="text-sm text-gray-400 mb-2">{headshot.photographer}</p>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      {headshot.category}
                    </Badge>
                    <div className="flex space-x-1">
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                        📥
                      </Button>
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                        🔗
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Headshot Gallery Component */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Your Portfolio</h2>
          <HeadshotGallery />
        </div>
      </div>
    </div>
  );
}