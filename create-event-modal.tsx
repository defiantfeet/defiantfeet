import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest } from "@/lib/queryClient";
import { Calendar, MapPin, Users, DollarSign } from "lucide-react";

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface EventFormData {
  title: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  eventType: string;
  registrationRequired: boolean;
  maxParticipants: string;
  price: string;
  imageUrl: string;
}

export function CreateEventModal({ isOpen, onClose }: CreateEventModalProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<EventFormData>({
    title: "",
    description: "",
    location: "",
    startDate: "",
    endDate: "",
    eventType: "workshop",
    registrationRequired: true,
    maxParticipants: "",
    price: "",
    imageUrl: ""
  });

  const createEventMutation = useMutation({
    mutationFn: async (eventData: any) => {
      const response = await apiRequest("POST", "/api/events", eventData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Event created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/events"] });
      onClose();
      resetForm();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create event. Please try again.",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      location: "",
      startDate: "",
      endDate: "",
      eventType: "workshop",
      registrationRequired: true,
      maxParticipants: "",
      price: "",
      imageUrl: ""
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to create events.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.title || !formData.location || !formData.startDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const eventData = {
      creatorId: user.id,
      title: formData.title,
      description: formData.description || null,
      location: formData.location,
      startDate: new Date(formData.startDate),
      endDate: formData.endDate ? new Date(formData.endDate) : null,
      eventType: formData.eventType,
      registrationRequired: formData.registrationRequired,
      maxParticipants: formData.maxParticipants ? parseInt(formData.maxParticipants) : null,
      currentParticipants: 0,
      price: formData.price || "0.00",
      imageUrl: formData.imageUrl || null
    };

    createEventMutation.mutate(eventData);
  };

  const handleClose = () => {
    if (!createEventMutation.isPending) {
      resetForm();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] bg-gray-900 border-gray-800 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Create New Event
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="title" className="text-gray-300">Event Title *</Label>
              <Input
                id="title"
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter event title"
                className="bg-gray-800 border-gray-700 text-white"
                required
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="description" className="text-gray-300">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe your event..."
                rows={3}
                className="bg-gray-800 border-gray-700 text-white resize-none"
              />
            </div>

            <div>
              <Label htmlFor="eventType" className="text-gray-300">Event Type *</Label>
              <Select value={formData.eventType} onValueChange={(value) => setFormData(prev => ({ ...prev, eventType: value }))}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Select event type" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="workshop">Workshop</SelectItem>
                  <SelectItem value="competition">Competition</SelectItem>
                  <SelectItem value="showcase">Showcase</SelectItem>
                  <SelectItem value="audition">Audition</SelectItem>
                  <SelectItem value="social">Social Event</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="location" className="text-gray-300 flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                Location *
              </Label>
              <Input
                id="location"
                type="text"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="Event location"
                className="bg-gray-800 border-gray-700 text-white"
                required
              />
            </div>

            <div>
              <Label htmlFor="startDate" className="text-gray-300">Start Date & Time *</Label>
              <Input
                id="startDate"
                type="datetime-local"
                value={formData.startDate}
                onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                className="bg-gray-800 border-gray-700 text-white"
                required
              />
            </div>

            <div>
              <Label htmlFor="endDate" className="text-gray-300">End Date & Time</Label>
              <Input
                id="endDate"
                type="datetime-local"
                value={formData.endDate}
                onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>

            <div>
              <Label htmlFor="maxParticipants" className="text-gray-300 flex items-center gap-1">
                <Users className="w-4 h-4" />
                Max Participants
              </Label>
              <Input
                id="maxParticipants"
                type="number"
                value={formData.maxParticipants}
                onChange={(e) => setFormData(prev => ({ ...prev, maxParticipants: e.target.value }))}
                placeholder="Leave empty for unlimited"
                min="1"
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>

            <div>
              <Label htmlFor="price" className="text-gray-300 flex items-center gap-1">
                <DollarSign className="w-4 h-4" />
                Price (USD)
              </Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                placeholder="0.00"
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="imageUrl" className="text-gray-300">Event Image URL</Label>
              <Input
                id="imageUrl"
                type="url"
                value={formData.imageUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                placeholder="https://example.com/image.jpg"
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>

            <div className="md:col-span-2 flex items-center space-x-2">
              <Switch
                id="registrationRequired"
                checked={formData.registrationRequired}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, registrationRequired: checked }))}
              />
              <Label htmlFor="registrationRequired" className="text-gray-300">
                Require registration and payment
              </Label>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-700">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={createEventMutation.isPending}
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createEventMutation.isPending}
              className="bg-primary hover:bg-primary/80"
            >
              {createEventMutation.isPending ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating...
                </div>
              ) : (
                "Create Event"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}