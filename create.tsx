import { useState } from "react";
import { Header } from "@/components/navigation/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Upload, Video, Camera, FileText, Calendar, Lock, Globe, Crown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

// Video Upload Modal Component
const VideoUploadModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    danceStyle: "",
    isSubscriptionOnly: false,
    file: null as File | null
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.file || !formData.title || !formData.category) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields and select a video file.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const videoFormData = new FormData();
      videoFormData.append('video', formData.file);
      videoFormData.append('title', formData.title);
      videoFormData.append('description', formData.description);
      videoFormData.append('category', formData.category);
      videoFormData.append('danceStyle', formData.danceStyle);
      videoFormData.append('isSubscriptionOnly', formData.isSubscriptionOnly.toString());

      await apiRequest("POST", "/api/videos", videoFormData);
      
      toast({
        title: "Video Uploaded Successfully!",
        description: formData.isSubscriptionOnly 
          ? "Your subscription-only video is now live for your subscribers."
          : "Your public video is now live and visible to everyone.",
      });
      
      onClose();
      setFormData({ title: "", description: "", category: "", danceStyle: "", isSubscriptionOnly: false, file: null });
    } catch (error: any) {
      toast({
        title: "Upload Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const danceStyles = [
    "Hip Hop", "Contemporary", "Ballet", "Jazz", "Tap", "Breakdancing", 
    "Salsa", "Bachata", "Ballroom", "Modern", "Lyrical", "Commercial",
    "Krump", "Popping", "Locking", "Waacking", "House", "Vogue"
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-surface border-gray-700 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Video className="w-5 h-5" />
            Upload Video
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* File Upload */}
          <div>
            <Label htmlFor="video-file" className="text-sm font-medium mb-2 block">
              Video File *
            </Label>
            <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-primary transition-colors">
              <input
                id="video-file"
                type="file"
                accept="video/*"
                className="hidden"
                onChange={(e) => setFormData({ ...formData, file: e.target.files?.[0] || null })}
              />
              <label htmlFor="video-file" className="cursor-pointer">
                <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-400">
                  {formData.file ? formData.file.name : "Click to upload video file"}
                </p>
                <p className="text-xs text-gray-500 mt-1">MP4, MOV, AVI up to 100MB</p>
              </label>
            </div>
          </div>

          {/* Title */}
          <div>
            <Label htmlFor="title" className="text-sm font-medium mb-2 block">
              Title *
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter video title"
              className="bg-dark border-gray-600"
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description" className="text-sm font-medium mb-2 block">
              Description
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe your video..."
              rows={3}
              className="bg-dark border-gray-600 resize-none"
            />
          </div>

          {/* Category and Dance Style */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium mb-2 block">Category *</Label>
              <Select onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger className="bg-dark border-gray-600">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="performance">Performance</SelectItem>
                  <SelectItem value="training">Training</SelectItem>
                  <SelectItem value="tutorial">Tutorial</SelectItem>
                  <SelectItem value="behind-scenes">Behind the Scenes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium mb-2 block">Dance Style</Label>
              <Select onValueChange={(value) => setFormData({ ...formData, danceStyle: value })}>
                <SelectTrigger className="bg-dark border-gray-600">
                  <SelectValue placeholder="Select style" />
                </SelectTrigger>
                <SelectContent>
                  {danceStyles.map((style) => (
                    <SelectItem key={style} value={style}>{style}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Subscription Option */}
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  {formData.isSubscriptionOnly ? (
                    <Lock className="w-5 h-5 text-yellow-500" />
                  ) : (
                    <Globe className="w-5 h-5 text-green-500" />
                  )}
                  <div>
                    <Label className="text-sm font-medium">
                      {formData.isSubscriptionOnly ? "Subscription Only" : "Public Video"}
                    </Label>
                    <p className="text-xs text-gray-400">
                      {formData.isSubscriptionOnly 
                        ? "Only your subscribers can watch this video" 
                        : "Everyone can watch this video"
                      }
                    </p>
                  </div>
                </div>
                {formData.isSubscriptionOnly && (
                  <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30">
                    <Crown className="w-3 h-3 mr-1" />
                    Premium
                  </Badge>
                )}
              </div>
              <Switch
                checked={formData.isSubscriptionOnly}
                onCheckedChange={(checked) => setFormData({ ...formData, isSubscriptionOnly: checked })}
              />
            </div>
            
            {formData.isSubscriptionOnly && (
              <div className="mt-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <p className="text-xs text-yellow-400 flex items-center gap-1">
                  <Crown className="w-3 h-3" />
                  This video will only be visible to users who subscribe to your content ($9.99/month)
                </p>
              </div>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-primary hover:bg-primary/80"
              disabled={isLoading}
            >
              {isLoading ? "Uploading..." : `Upload ${formData.isSubscriptionOnly ? "Premium" : "Public"} Video`}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default function Create() {
  const [showVideoModal, setShowVideoModal] = useState(false);

  const createOptions = [
    {
      icon: Video,
      title: "Upload Video",
      description: "Share your dance performance or tutorial with public or subscription options",
      action: "upload-video",
      color: "bg-primary"
    },
    {
      icon: Camera,
      title: "Add Headshot",
      description: "Upload professional photos for your portfolio",
      action: "upload-headshot",
      color: "bg-secondary"
    },
    {
      icon: FileText,
      title: "Create Newsletter",
      description: "Write and publish a newsletter for your followers",
      action: "create-newsletter",
      color: "bg-accent"
    },
    {
      icon: Calendar,
      title: "Host Event",
      description: "Organize workshops, competitions, or showcases",
      action: "create-event",
      color: "bg-green-500"
    }
  ];

  const handleCreate = (action: string) => {
    // Handle different create actions
    switch (action) {
      case "upload-video":
        setShowVideoModal(true);
        break;
      case "upload-headshot":
        // Open headshot upload modal
        console.log("Opening headshot upload");
        break;
      case "create-newsletter":
        // Navigate to newsletter creation
        window.location.href = "/newsletter";
        break;
      case "create-event":
        // Navigate to event creation
        window.location.href = "/events";
        break;
    }
  };

  return (
    <div className="min-h-screen bg-dark text-gray-100">
      <Header />
      
      <div className="container mx-auto px-4 pt-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Create Content</h1>
          <p className="text-gray-400">Share your passion for dance with the community</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {createOptions.map((option) => {
            const Icon = option.icon;
            return (
              <Card
                key={option.action}
                className="bg-surface border-gray-700 hover:border-gray-600 transition-all cursor-pointer group"
                onClick={() => handleCreate(option.action)}
              >
                <CardHeader className="text-center pb-4">
                  <div className={`w-16 h-16 ${option.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-lg">{option.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-400 text-sm">{option.description}</p>
                  <Button 
                    className="mt-4 w-full"
                    variant="secondary"
                    size="sm"
                  >
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-12 max-w-4xl mx-auto">
          <div className="bg-surface rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-4">Quick Upload</h2>
            <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-300 mb-2">Drag and drop files here, or click to browse</p>
              <p className="text-gray-500 text-sm">Supports videos, images, and documents</p>
              <Button className="mt-4" variant="outline">
                Choose Files
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Video Upload Modal */}
      <VideoUploadModal isOpen={showVideoModal} onClose={() => setShowVideoModal(false)} />
    </div>
  );
}