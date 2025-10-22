import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, ArrowLeft, Users, Award, Phone } from "lucide-react";
import { getEventById } from "@/data/events";

const EventDetail = () => {
  const { eventId } = useParams();
  const event = eventId ? getEventById(eventId) : null;

  if (!event) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-bold">Event Not Found</h1>
          <Link to="/events">
            <Button>Back to Events</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto max-w-4xl px-4">
        <Link to="/events">
          <Button variant="ghost" className="mb-6 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Events
          </Button>
        </Link>

        <div className="mb-8 overflow-hidden rounded-2xl">
          <img
            src={event.image}
            alt={event.title}
            className="h-64 w-full object-cover"
          />
        </div>

        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="mb-2 text-4xl font-bold">{event.title}</h1>
            <p className="text-lg text-muted-foreground">{event.organizer}</p>
          </div>
          <Link to={`/register?event=${event.id}`}>
            <Button size="lg" className="gap-2">
              Register Now
            </Button>
          </Link>
        </div>

        <div className="mb-8 flex flex-wrap gap-4">
          <div className="flex items-center gap-2 rounded-lg bg-secondary px-4 py-2">
            <Calendar className="h-5 w-5 text-primary" />
            <span className="font-medium">{event.date}</span>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-secondary px-4 py-2">
            <MapPin className="h-5 w-5 text-primary" />
            <span className="font-medium">{event.venue}</span>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-secondary px-4 py-2">
            <Clock className="h-5 w-5 text-primary" />
            <span className="font-medium">{event.start_time} – {event.end_time}</span>
          </div>
          <Badge variant="outline" className="px-4 py-2 text-base">
            Day {event.day}
          </Badge>
        </div>

        {event.guest && (
          <Card className="mb-6 border-primary/20 bg-gradient-to-br from-primary/5 to-background">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                {event.guest.role}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <p className="text-xl font-semibold">{event.guest.name}</p>
                <p className="text-muted-foreground">{event.guest.designation}</p>
                <p className="text-sm text-muted-foreground">{event.guest.institution}</p>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>About the Event</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">{event.long_desc}</p>
            <p className="text-sm text-muted-foreground">{event.short_desc}</p>
          </CardContent>
        </Card>

        {event.topics && event.topics.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Topics Covered</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="grid gap-2 sm:grid-cols-2">
                {event.topics.map((topic, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                    <span className="text-muted-foreground">{topic}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {event.rules && event.rules.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Rules & Guidelines</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {event.rules.map((rule, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Badge variant="outline" className="mt-0.5 h-6 w-6 flex-shrink-0 items-center justify-center rounded-full p-0">
                      {index + 1}
                    </Badge>
                    <span className="text-muted-foreground">{rule}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Event Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="pb-3 pr-4 text-left font-semibold">Time</th>
                    <th className="pb-3 text-left font-semibold">Activity</th>
                  </tr>
                </thead>
                <tbody>
                  {event.schedule.map((item, index) => (
                    <tr key={index} className="border-b border-border/50 last:border-0">
                      <td className="py-3 pr-4 font-medium text-primary whitespace-nowrap">{item.time}</td>
                      <td className="py-3 text-muted-foreground">{item.activity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Event Coordinators
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              {event.coordinators.map((coordinator, index) => (
                <div key={index} className="rounded-lg border border-border bg-secondary/30 p-4">
                  <p className="font-semibold">{coordinator.name}</p>
                  <a 
                    href={`tel:${coordinator.phone}`}
                    className="text-sm text-primary hover:underline"
                  >
                    {coordinator.phone}
                  </a>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {event.criteria && event.criteria.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Judging Criteria</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {event.criteria.map((criterion, index) => (
                  <div key={index} className="flex items-center justify-between rounded-lg bg-secondary/30 p-3">
                    <span className="font-medium">{criterion.name}</span>
                    <Badge variant="default" className="text-base">
                      {criterion.points} points
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Program Outcomes</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {event.program_outcomes.map((outcome, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                    {index + 1}
                  </span>
                  <span className="text-muted-foreground">{outcome}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <div className="flex justify-center">
          <Link to={`/register?event=${event.id}`}>
            <Button size="lg" className="gap-2 px-8">
              Register for This Event
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
