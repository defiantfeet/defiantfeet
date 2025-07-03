import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/navigation/header";
import { Button } from "@/components/ui/button";
import { Plus, Calendar as CalendarIcon } from "lucide-react";
import { EventCard } from "@/components/events/event-card";
import { CreateEventModal } from "@/components/modals/create-event-modal";
import { Event } from "@shared/schema";

export default function Events() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  const { data: events, isLoading } = useQuery<Event[]>({
    queryKey: ["/api/events"],
  });

  const mockEvents: Event[] = [
    {
      id: 1,
      creatorId: 1,
      title: "Urban Dance Championship",
      description: "Open registration - All styles welcome. Join dancers from around the city for this exciting competition featuring multiple categories and age groups.",
      imageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
      location: "Downtown Arts Center",
      startDate: new Date("2024-03-15"),
      endDate: null,
      eventType: "competition",
      registrationRequired: true,
      maxParticipants: 100,
      currentParticipants: 47,
      price: "50.00",
      createdAt: new Date()
    },
    {
      id: 2,
      creatorId: 2,
      title: "Contemporary Masterclass",
      description: "With guest instructor Maya Chen, former principal dancer with the National Ballet. Learn advanced contemporary techniques and choreography.",
      imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
      location: "Studio Luna",
      startDate: new Date("2024-03-20"),
      endDate: null,
      eventType: "workshop",
      registrationRequired: true,
      maxParticipants: 25,
      currentParticipants: 18,
      price: "75.00",
      createdAt: new Date()
    },
    {
      id: 3,
      creatorId: 3,
      title: "Spring Showcase",
      description: "Student and professional performances featuring works from our community's most talented dancers and choreographers.",
      imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
      location: "Metropolitan Theater",
      startDate: new Date("2024-04-05"),
      endDate: null,
      eventType: "showcase",
      registrationRequired: false,
      maxParticipants: null,
      currentParticipants: 0,
      price: "25.00",
      createdAt: new Date()
    },
    {
      id: 4,
      creatorId: 1,
      title: "Hip-Hop Intensive Weekend",
      description: "Two-day intensive workshop covering foundations, freestyle, and battle techniques with industry professionals.",
      imageUrl: "https://images.unsplash.com/photo-1534329539061-64caeb388c42?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
      location: "Urban Movement Studio",
      startDate: new Date("2024-03-30"),
      endDate: new Date("2024-03-31"),
      eventType: "workshop",
      registrationRequired: true,
      maxParticipants: 40,
      currentParticipants: 32,
      price: "150.00",
      createdAt: new Date()
    }
  ];

  const displayEvents = events && events.length > 0 ? events : mockEvents;

  return (
    <div className="min-h-screen bg-dark text-gray-100">
      <Header />
      
      <div className="container mx-auto px-4 pt-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2 flex items-center">
              <CalendarIcon className="mr-3" />
              Events
            </h1>
            <p className="text-gray-400">Discover workshops, competitions, and showcases</p>
          </div>
          <Button 
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-primary hover:bg-primary/80"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Event
          </Button>
        </div>

        {/* Events List */}
        <div className="p-4 lg:p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {displayEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      </div>

      <CreateEventModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}
