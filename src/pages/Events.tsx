import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, MapPin, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Event {
  id: string;
  title: string;
  date: string;
  day: number;
  venue: string | null;
  short_desc: string | null;
  image: string | null;
}

const Events = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const { data, error } = await supabase
      .from('events')
      .select('id, title, date, day, venue, short_desc, image')
      .order('day', { ascending: true })
      .order('start_time', { ascending: true });

    if (error) {
      toast.error('Failed to load events');
      console.error(error);
    } else {
      setEvents(data || []);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const day1Events = events.filter(event => event.day === 1);
  const day2Events = events.filter(event => event.day === 2);

  const renderEventCards = (eventList: Event[]) => (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {eventList.map((event) => (
        <Card key={event.id} className="group overflow-hidden hover-lift">
          <div className="relative h-48 overflow-hidden">
            <img
              src={event.image || "/placeholder.svg"}
              alt={event.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
          
          <CardHeader>
            <CardTitle className="line-clamp-2 text-xl">{event.title}</CardTitle>
            <CardDescription className="flex flex-col gap-2 text-sm">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {new Date(event.date).toLocaleDateString('en-US', { 
                  day: 'numeric', 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </span>
              {event.venue && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {event.venue}
                </span>
              )}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-3">
            <p className="line-clamp-3 text-sm text-muted-foreground">
              {event.short_desc || event.title}
            </p>
            <div className="flex gap-2">
              <Link to={`/events/${event.id}`} className="flex-1">
                <Button variant="outline" className="w-full gap-2">
                  View Details
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to={`/register?event=${event.id}`} className="flex-1">
                <Button className="w-full">
                  Register
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">Events at IEEE DAY 2025</h1>
          <p className="text-lg text-muted-foreground">
            Explore all technical and competitive events
          </p>
        </div>

        <div className="space-y-12">
          <div>
            <h2 className="mb-6 text-3xl font-bold text-primary">Day 1 — 31 October 2025</h2>
            {renderEventCards(day1Events)}
          </div>

          <div>
            <h2 className="mb-6 text-3xl font-bold text-primary">Day 2 — 1 November 2025</h2>
            {renderEventCards(day2Events)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Events;
