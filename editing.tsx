import { Header } from "@/components/navigation/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit3, Scissors, Palette, Music, Sparkles, Download, Upload } from "lucide-react";

export default function Editing() {
  const editingTools = [
    {
      icon: Scissors,
      title: "Trim & Cut",
      description: "Cut and trim your dance videos to perfect timing",
      features: ["Precise frame cutting", "Multi-clip editing", "Timeline scrubbing"],
      color: "bg-blue-500"
    },
    {
      icon: Palette,
      title: "Color Grading",
      description: "Enhance your videos with professional color correction",
      features: ["Auto color balance", "Custom filters", "Brightness/contrast"],
      color: "bg-purple-500"
    },
    {
      icon: Music,
      title: "Audio Sync",
      description: "Perfect audio synchronization for your performances",
      features: ["Beat detection", "Audio replacement", "Volume leveling"],
      color: "bg-green-500"
    },
    {
      icon: Sparkles,
      title: "AI Enhancement",
      description: "AI-powered video enhancement and stabilization",
      features: ["Motion stabilization", "Noise reduction", "Auto cropping"],
      color: "bg-yellow-500"
    }
  ];

  const recentProjects = [
    {
      id: 1,
      title: "Contemporary Solo Performance",
      thumbnail: "https://images.unsplash.com/photo-1518834107812-67b0b7c58434?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
      duration: "3:24",
      status: "In Progress",
      lastEdited: "2 hours ago"
    },
    {
      id: 2,
      title: "Hip-Hop Battle Compilation",
      thumbnail: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
      duration: "8:15",
      status: "Completed",
      lastEdited: "Yesterday"
    },
    {
      id: 3,
      title: "Ballet Technique Tutorial",
      thumbnail: "https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
      duration: "12:45",
      status: "Draft",
      lastEdited: "3 days ago"
    }
  ];

  return (
    <div className="min-h-screen bg-dark text-gray-100">
      <Header />
      
      <div className="container mx-auto px-4 pt-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center">
            <Edit3 className="mr-3 text-primary" />
            Video Editing Studio
          </h1>
          <p className="text-gray-400">Edit and enhance your dance videos with professional tools</p>
        </div>

        {/* Upload Section */}
        <div className="mb-8">
          <Card className="bg-surface border-gray-700">
            <CardContent className="p-6">
              <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Start New Project</h3>
                <p className="text-gray-400 mb-4">Upload your dance video to begin editing</p>
                <Button className="bg-primary hover:bg-primary/80">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Video
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Editing Tools */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Editing Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {editingTools.map((tool, index) => {
              const Icon = tool.icon;
              return (
                <Card key={index} className="bg-surface border-gray-700 hover:border-gray-600 transition-all cursor-pointer group">
                  <CardHeader>
                    <div className={`w-12 h-12 ${tool.color} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-lg">{tool.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-400 text-sm mb-4">{tool.description}</p>
                    <div className="space-y-1">
                      {tool.features.map((feature, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Recent Projects */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Recent Projects</h2>
            <Button variant="outline" size="sm">View All</Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentProjects.map((project) => (
              <Card key={project.id} className="bg-surface border-gray-700 hover:border-gray-600 transition-all cursor-pointer">
                <div className="aspect-video bg-gray-800 rounded-t-lg overflow-hidden">
                  <img 
                    src={project.thumbnail} 
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-sm">{project.title}</h3>
                    <Badge 
                      variant={project.status === "Completed" ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {project.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <span>{project.duration}</span>
                    <span>{project.lastEdited}</span>
                  </div>
                  <div className="flex space-x-2 mt-3">
                    <Button size="sm" variant="outline" className="flex-1">
                      Continue
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}