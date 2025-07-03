import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Header } from "@/components/navigation/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Plus, 
  Star, 
  MessageCircle, 
  Calendar, 
  Clock, 
  MapPin, 
  User,
  Heart,
  Frown,
  Meh,
  Smile,
  Sparkles,
  Target
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { TrainingSession, TrainingComment } from "@shared/schema";

// Feeling icons mapping
const feelingIcons = {
  amazing: { icon: Sparkles, color: "text-purple-500", label: "Amazing" },
  good: { icon: Smile, color: "text-green-500", label: "Good" },
  okay: { icon: Meh, color: "text-yellow-500", label: "Okay" },
  challenging: { icon: Target, color: "text-orange-500", label: "Challenging" },
  frustrated: { icon: Frown, color: "text-red-500", label: "Frustrated" }
};

// Add Training Session Modal
const AddSessionModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    className: "",
    instructor: "",
    studio: "",
    danceStyle: "",
    difficulty: "",
    duration: "",
    feeling: "",
    notes: ""
  });

  const getAnonymousId = () => {
    let anonymousId = localStorage.getItem('anonymousId');
    if (!anonymousId) {
      anonymousId = 'anon_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('anonymousId', anonymousId);
    }
    return anonymousId;
  };

  const addSessionMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/training-sessions", {
        ...formData,
        duration: formData.duration ? parseInt(formData.duration) : null,
        anonymousId: getAnonymousId()
      });
    },
    onSuccess: () => {
      toast({
        title: "Training session added!",
        description: "Your anonymous training session has been shared with the community.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/training-sessions"] });
      onClose();
      setFormData({
        className: "",
        instructor: "",
        studio: "",
        danceStyle: "",
        difficulty: "",
        duration: "",
        feeling: "",
        notes: ""
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error adding session",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.className || !formData.feeling) {
      toast({
        title: "Missing Information",
        description: "Please fill in the class name and how you felt.",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    addSessionMutation.mutate();
    setIsLoading(false);
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
          <DialogTitle className="text-xl font-bold">Add Training Session</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Class Name */}
          <div>
            <Label htmlFor="className" className="text-sm font-medium mb-2 block">
              Class Name *
            </Label>
            <Input
              id="className"
              value={formData.className}
              onChange={(e) => setFormData({ ...formData, className: e.target.value })}
              placeholder="e.g., Beginner Hip Hop, Advanced Ballet"
              className="bg-dark border-gray-600"
            />
          </div>

          {/* Instructor & Studio */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="instructor" className="text-sm font-medium mb-2 block">
                Instructor
              </Label>
              <Input
                id="instructor"
                value={formData.instructor}
                onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                placeholder="Instructor name"
                className="bg-dark border-gray-600"
              />
            </div>
            <div>
              <Label htmlFor="studio" className="text-sm font-medium mb-2 block">
                Studio/Location
              </Label>
              <Input
                id="studio"
                value={formData.studio}
                onChange={(e) => setFormData({ ...formData, studio: e.target.value })}
                placeholder="Studio name"
                className="bg-dark border-gray-600"
              />
            </div>
          </div>

          {/* Dance Style & Difficulty */}
          <div className="grid grid-cols-2 gap-4">
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
            <div>
              <Label className="text-sm font-medium mb-2 block">Difficulty</Label>
              <Select onValueChange={(value) => setFormData({ ...formData, difficulty: value })}>
                <SelectTrigger className="bg-dark border-gray-600">
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Duration */}
          <div>
            <Label htmlFor="duration" className="text-sm font-medium mb-2 block">
              Duration (minutes)
            </Label>
            <Input
              id="duration"
              type="number"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              placeholder="60"
              className="bg-dark border-gray-600"
            />
          </div>

          {/* How did you feel? */}
          <div>
            <Label className="text-sm font-medium mb-3 block">How did you feel during this class? *</Label>
            <div className="grid grid-cols-5 gap-2">
              {Object.entries(feelingIcons).map(([feeling, { icon: Icon, color, label }]) => (
                <Button
                  key={feeling}
                  type="button"
                  variant={formData.feeling === feeling ? "default" : "outline"}
                  className={`flex flex-col items-center p-4 h-auto ${
                    formData.feeling === feeling ? "bg-primary" : ""
                  }`}
                  onClick={() => setFormData({ ...formData, feeling })}
                >
                  <Icon className={`w-6 h-6 mb-1 ${formData.feeling === feeling ? "text-white" : color}`} />
                  <span className="text-xs">{label}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes" className="text-sm font-medium mb-2 block">
              Notes & Thoughts
            </Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Share your thoughts about the class, what you learned, challenges you faced..."
              rows={3}
              className="bg-dark border-gray-600 resize-none"
            />
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
              {isLoading ? "Saving..." : "Share Anonymously"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Training Session Card Component
const TrainingSessionCard = ({ session }: { session: TrainingSession & { comments?: TrainingComment[] } }) => {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const getAnonymousId = () => {
    let anonymousId = localStorage.getItem('anonymousId');
    if (!anonymousId) {
      anonymousId = 'anon_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('anonymousId', anonymousId);
    }
    return anonymousId;
  };

  const addCommentMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/training-comments", {
        sessionId: session.id,
        comment: newComment,
        anonymousId: getAnonymousId()
      });
    },
    onSuccess: () => {
      toast({
        title: "Comment added!",
        description: "Your anonymous comment has been posted.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/training-sessions"] });
      setNewComment("");
    },
    onError: (error: any) => {
      toast({
        title: "Error adding comment",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    addCommentMutation.mutate();
  };

  const feelingInfo = feelingIcons[session.feeling as keyof typeof feelingIcons];
  const FeelingIcon = feelingInfo?.icon || Meh;

  return (
    <Card className="bg-surface border-gray-700 hover:border-gray-600 transition-colors">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{session.className}</CardTitle>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
              {session.instructor && (
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {session.instructor}
                </div>
              )}
              {session.studio && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {session.studio}
                </div>
              )}
              {session.duration && (
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {session.duration}m
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-1 ${feelingInfo?.color || "text-gray-400"}`}>
              <FeelingIcon className="w-5 h-5" />
              <span className="text-sm">{feelingInfo?.label || session.feeling}</span>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {session.danceStyle && (
              <Badge variant="secondary">{session.danceStyle}</Badge>
            )}
            {session.difficulty && (
              <Badge variant="outline" className="capitalize">{session.difficulty}</Badge>
            )}
          </div>

          {/* Notes */}
          {session.notes && (
            <p className="text-gray-300 text-sm leading-relaxed">{session.notes}</p>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-700">
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span>{new Date(session.createdAt).toLocaleDateString()}</span>
              <span>Anonymous dancer</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowComments(!showComments)}
              className="text-gray-400 hover:text-white"
            >
              <MessageCircle className="w-4 h-4 mr-1" />
              {session.comments?.length || 0} comments
            </Button>
          </div>

          {/* Comments Section */}
          {showComments && (
            <div className="border-t border-gray-700 pt-4 space-y-4">
              {/* Existing Comments */}
              {session.comments?.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-gray-600 text-xs">A</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="bg-gray-800 rounded-lg p-3">
                      <p className="text-sm">{comment.comment}</p>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                      <span>Anonymous</span>
                      <span>•</span>
                      <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Add Comment */}
              <form onSubmit={handleAddComment} className="flex gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-primary/20 text-primary text-xs">You</AvatarFallback>
                </Avatar>
                <div className="flex-1 flex gap-2">
                  <Input
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add an anonymous comment..."
                    className="bg-gray-800 border-gray-600 flex-1"
                  />
                  <Button type="submit" size="sm" disabled={!newComment.trim()}>
                    Post
                  </Button>
                </div>
              </form>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default function Training() {
  const [showAddModal, setShowAddModal] = useState(false);

  const { data: sessions, isLoading } = useQuery<(TrainingSession & { comments?: TrainingComment[] })[]>({
    queryKey: ["/api/training-sessions"],
  });

  // Mock data for demo
  const mockSessions: (TrainingSession & { comments?: TrainingComment[] })[] = [
    {
      id: 1,
      userId: null,
      anonymousId: "anon_123",
      className: "Hip Hop Foundations",
      instructor: "Alex Rodriguez",
      studio: "Downtown Dance Studio",
      danceStyle: "Hip Hop",
      difficulty: "beginner",
      duration: 60,
      feeling: "amazing",
      notes: "Amazing class! Finally nailed the isolation moves. The instructor was super patient and broke down each step perfectly.",
      rating: null,
      createdAt: new Date("2024-07-02"),
      comments: [
        {
          id: 1,
          sessionId: 1,
          anonymousId: "anon_456",
          comment: "I took this class last week too! Alex is incredible at teaching the fundamentals.",
          createdAt: new Date("2024-07-02")
        }
      ]
    },
    {
      id: 2,
      userId: null,
      anonymousId: "anon_789",
      className: "Contemporary Flow",
      instructor: "Maya Chen",
      studio: "Studio Luna",
      danceStyle: "Contemporary",
      difficulty: "intermediate",
      duration: 90,
      feeling: "challenging",
      notes: "This was tough but so worth it. The floor work combinations pushed me out of my comfort zone. Need to work on my flexibility more.",
      rating: null,
      createdAt: new Date("2024-07-01"),
      comments: []
    },
    {
      id: 3,
      userId: null,
      anonymousId: "anon_101",
      className: "Ballet Technique",
      instructor: "Elena Volkov",
      studio: "Classical Arts Academy",
      danceStyle: "Ballet",
      difficulty: "advanced",
      duration: 75,
      feeling: "frustrated",
      notes: "Struggled with the adagio combination today. My turns were off and I couldn't seem to find my center. Going to practice more at home.",
      rating: null,
      createdAt: new Date("2024-06-30"),
      comments: [
        {
          id: 2,
          sessionId: 3,
          anonymousId: "anon_202",
          comment: "Don't be hard on yourself! Advanced ballet is incredibly challenging. You'll get it with practice.",
          createdAt: new Date("2024-06-30")
        },
        {
          id: 3,
          sessionId: 3,
          anonymousId: "anon_303",
          comment: "Elena's classes are always tough but they make you grow so much as a dancer.",
          createdAt: new Date("2024-07-01")
        }
      ]
    }
  ];

  const displaySessions = sessions && sessions.length > 0 ? sessions : mockSessions;

  return (
    <div className="min-h-screen bg-dark text-gray-100">
      <Header />
      
      <div className="container mx-auto px-4 pt-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Training Sessions</h1>
            <p className="text-gray-400">Share your dance class experiences anonymously with the community</p>
          </div>
          <Button onClick={() => setShowAddModal(true)} className="bg-primary hover:bg-primary/80">
            <Plus className="w-4 h-4 mr-2" />
            Add Session
          </Button>
        </div>

        {/* Training Sessions Feed */}
        <div className="max-w-4xl mx-auto space-y-6">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-400">Loading training sessions...</p>
            </div>
          ) : displaySessions.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No training sessions yet</h3>
              <p className="text-gray-400 mb-6">Be the first to share your class experience!</p>
              <Button onClick={() => setShowAddModal(true)} className="bg-primary hover:bg-primary/80">
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Session
              </Button>
            </div>
          ) : (
            displaySessions.map((session) => (
              <TrainingSessionCard key={session.id} session={session} />
            ))
          )}
        </div>

        {/* Information Card */}
        <div className="max-w-4xl mx-auto mt-8">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Heart className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Anonymous & Supportive Community</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Share your training experiences, challenges, and victories with fellow dancers. 
                    All posts and comments are completely anonymous, creating a safe space to be honest 
                    about your dance journey. Support others and get encouragement from the community!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add Session Modal */}
      <AddSessionModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} />
    </div>
  );
}