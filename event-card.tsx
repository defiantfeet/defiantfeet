import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users } from "lucide-react";
import { Event } from "@shared/schema";
import { useLocation } from "wouter";

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const [, setLocation] = useLocation();
  
  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleRegisterClick = () => {
    setLocation(`/event-register?eventId=${event.id}`);
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'competition':
        return 'bg-secondary text-white';
      case 'workshop':
        return 'bg-primary text-white';
      case 'showcase':
        return 'bg-accent text-black';
      default:
        return 'bg-gray-600 text-white';
    }
  };

  return (
    <Card className="bg-surface">
      <CardContent className="p-0">
        <div className="flex items-center space-x-4 p-4">
          <img 
            src={event.imageUrl || "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150"} 
            alt={event.title}
            className="w-16 h-16 rounded-lg object-cover"
          />
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-semibold">{event.title}</h4>
              <Badge className={getEventTypeColor(event.eventType)}>
                {event.eventType}
              </Badge>
            </div>
            <div className="space-y-1 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>{event.location}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(event.startDate)}</span>
              </div>
              {event.maxParticipants && (
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>{event.currentParticipants}/{event.maxParticipants} participants</span>
                </div>
              )}
            </div>
            {event.description && (
              <p className="text-sm text-gray-400 mt-2 line-clamp-2">{event.description}</p>
            )}
          </div>
          <Button 
            onClick={handleRegisterClick}
            className="bg-primary text-white hover:bg-primary/80"
          >
            {event.registrationRequired ? "Register" : "Join"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
