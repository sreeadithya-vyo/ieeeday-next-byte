import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowLeft, Calendar, Clock, MapPin, Users, Loader2, User, Award } from "lucide-react";

interface EventDetail {
  id: string;
  title: string;
  date: string;
  day: number;
  start_time: string | null;
  end_time: string | null;
  venue: string | null;
  capacity: number | null;
  short_desc: string | null;
  long_desc: string | null;
  description: string | null;
  image: string | null;
  organizer: string | null;
  guest: string | null;
  criteria: string[] | null;
  rules: string[] | null;
  topics: string[] | null;
  program_outcomes: string[] | null;
  schedule: any;
  chapter: { name: string; code: string } | null;
  prizes?: Array<{ position: string; amount: number }> | null;
  template_url?: string | null;
  registration_open?: boolean;
}

const EventDetail = () => {
  const { id } = useParams();
  const [event, setEvent] = useState<EventDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [registrationCount, setRegistrationCount] = useState(0);

  useEffect(() => {
    if (id) fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*, chapters(name, code)')
        .eq('id', id)
        .single();

      if (error) throw error;

      setEvent({
        ...data,
        chapter: data.chapters as any,
      });

      // Fetch registration count
      const { count } = await supabase
        .from('registrations')
        .select('*', { count: 'exact', head: true })
        .eq('event_id', id);

      setRegistrationCount(count || 0);
    } catch (error) {
      toast.error('Failed to load event details');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Event not found</h1>
        <Link to="/events">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Events
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4 max-w-5xl">
        <Link to="/events">
          <Button variant="ghost" className="mb-6 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Events
          </Button>
        </Link>

        {/* Hero Section */}
        <Card className="overflow-hidden mb-8">
          {event.image && (
            <div className="relative h-80 overflow-hidden">
              <img
                src={event.image}
                alt={event.title}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <Badge className="mb-2">{event.chapter?.code || 'IEEE'}</Badge>
                <h1 className="text-4xl font-bold text-white mb-2">{event.title}</h1>
              </div>
            </div>
          )}
          {!event.image && (
            <CardHeader>
              <Badge className="w-fit mb-2">{event.chapter?.code || 'IEEE'}</Badge>
              <CardTitle className="text-4xl">{event.title}</CardTitle>
            </CardHeader>
          )}
        </Card>

        {/* Quick Info */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardContent className="flex items-center gap-3 pt-6">
              <Calendar className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Date</p>
                <p className="font-semibold">
                  {new Date(event.date).toLocaleDateString('en-US', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
                <p className="text-xs text-muted-foreground">Day {event.day}</p>
              </div>
            </CardContent>
          </Card>

          {(event.start_time || event.end_time) && (
            <Card>
              <CardContent className="flex items-center gap-3 pt-6">
                <Clock className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Time</p>
                  <p className="font-semibold">
                    {event.start_time && (() => {
                      const [hours, minutes] = event.start_time.split(':');
                      const hour = parseInt(hours);
                      const ampm = hour >= 12 ? 'PM' : 'AM';
                      const displayHour = hour % 12 || 12;
                      return `${displayHour}:${minutes} ${ampm}`;
                    })()}
                    {event.start_time && event.end_time && ' - '}
                    {event.end_time && (() => {
                      const [hours, minutes] = event.end_time.split(':');
                      const hour = parseInt(hours);
                      const ampm = hour >= 12 ? 'PM' : 'AM';
                      const displayHour = hour % 12 || 12;
                      return `${displayHour}:${minutes} ${ampm}`;
                    })()}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {event.venue && (
            <Card>
              <CardContent className="flex items-center gap-3 pt-6">
                <MapPin className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Venue</p>
                  <p className="font-semibold">{event.venue}</p>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardContent className="flex items-center gap-3 pt-6">
              <Users className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Capacity</p>
                <p className="font-semibold">
                  {registrationCount} / {event.capacity || '∞'} registered
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>About This Event</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {event.short_desc && (
                  <p className="text-lg text-muted-foreground">{event.short_desc}</p>
                )}
                {event.long_desc && (
                  <div className="prose prose-sm max-w-none">
                    <p className="whitespace-pre-wrap">{event.long_desc}</p>
                  </div>
                )}
                {event.description && !event.long_desc && (
                  <p className="whitespace-pre-wrap">{event.description}</p>
                )}
              </CardContent>
            </Card>

            {/* Topics */}
            {event.topics && event.topics.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Topics Covered</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="grid gap-2 md:grid-cols-2">
                    {event.topics.map((topic, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>{topic}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Criteria */}
            {event.criteria && event.criteria.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Eligibility Criteria</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {event.criteria.map((criterion, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Award className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span>{criterion}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Rules */}
            {event.rules && event.rules.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Rules & Regulations</CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-2 list-decimal list-inside">
                    {event.rules.map((rule, idx) => (
                      <li key={idx}>{rule}</li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            )}

            {/* Prizes */}
            {event.prizes && event.prizes.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Prizes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {event.prizes.map((prize, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-primary/5 rounded-lg border border-primary/20">
                        <span className="font-medium text-lg">{prize.position}</span>
                        <span className="text-2xl font-bold text-primary">₹{prize.amount}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Schedule */}
            {event.schedule && (
              <Card>
                <CardHeader>
                  <CardTitle>Event Schedule</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {typeof event.schedule === 'object' && !Array.isArray(event.schedule) ? (
                      Object.entries(event.schedule).map(([key, value], idx) => (
                        <div key={idx} className="flex gap-4">
                          <div className="font-semibold min-w-[100px]">{key}:</div>
                          <div>{String(value)}</div>
                        </div>
                      ))
                    ) : Array.isArray(event.schedule) ? (
                      event.schedule.map((item, idx) => (
                        <div key={idx} className="flex gap-4 border-l-2 border-primary pl-4">
                          <div className="text-muted-foreground">{item}</div>
                        </div>
                      ))
                    ) : (
                      <p>{String(event.schedule)}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Program Outcomes */}
            {event.program_outcomes && event.program_outcomes.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Learning Outcomes</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {event.program_outcomes.map((outcome, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-primary font-bold">{idx + 1}.</span>
                        <span>{outcome}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Registration CTA */}
            <Card>
              <CardHeader>
                <CardTitle>Register Now</CardTitle>
                <CardDescription>
                  {event.registration_open === false 
                    ? 'Registrations are currently closed' 
                    : 'Secure your spot for this event'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {event.registration_open === false ? (
                  <Button className="w-full" size="lg" disabled>
                    Registrations Closed
                  </Button>
                ) : (
                  <Link to={`/register?event=${event.id}`} className="block">
                    <Button className="w-full" size="lg">
                      Register for Event
                    </Button>
                  </Link>
                )}
                {event.template_url && (
                  <a href={event.template_url} download className="block">
                    <Button variant="outline" className="w-full" size="lg">
                      Sample Template
                    </Button>
                  </a>
                )}
                <Separator />
                <div className="text-sm text-muted-foreground">
                  <p>
                    <strong>Spots Available:</strong>{' '}
                    {event.capacity
                      ? `${event.capacity - registrationCount} / ${event.capacity}`
                      : 'Unlimited'}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Organizer Info */}
            {(event.organizer || event.guest) && (
              <Card>
                <CardHeader>
                  <CardTitle>Event Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {event.organizer && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Organized by</p>
                      <p className="font-semibold flex items-center gap-2">
                        <User className="h-4 w-4" />
                        {event.organizer}
                      </p>
                    </div>
                  )}
                  {event.guest && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Guest Speaker</p>
                      <p className="font-semibold">{event.guest}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
