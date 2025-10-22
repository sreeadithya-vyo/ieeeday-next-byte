import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, MapPin } from "lucide-react";
import mlAntennaImage from "@/assets/ml-antenna.jpg";
import pptContestImage from "@/assets/ppt-contest.jpg";
import circuitManiaImage from "@/assets/circuit-mania.jpg";

const Events = () => {
  const events = [
    {
      id: "ml-antenna",
      title: "Integration of Machine Learning in Antenna Modelling, Design, and Optimization",
      description: "Hands-on workshop integrating ML with antenna design using HFSS tools.",
      image: mlAntennaImage,
      date: "31 October 2025",
      day: 1,
      venue: "SITE Campus",
      time: "09:00 AM – 04:15 PM",
      organizer: "Sasi IEEE APS Chapter",
    },
    {
      id: "ppt-contest",
      title: "PPT Presentation Contest",
      description: "Showcase your ideas in front of expert judges on emerging technologies.",
      image: pptContestImage,
      date: "1 November 2025",
      day: 2,
      venue: "Seminar Hall",
      time: "01:00 PM – 04:00 PM",
      organizer: "IEEE Student Branch",
    },
    {
      id: "circuit-mania",
      title: "Circuit Mania",
      description: "Competitive circuit debugging and design challenge for engineering minds.",
      image: circuitManiaImage,
      date: "1 November 2025",
      day: 2,
      venue: "ECE Lab",
      time: "10:00 AM – 04:00 PM",
      organizer: "IEEE Student Branch",
    },
  ];

  const day1Events = events.filter(event => event.day === 1);
  const day2Events = events.filter(event => event.day === 2);

  const renderEventCards = (eventList: typeof events) => (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {eventList.map((event) => (
        <Card key={event.id} className="group overflow-hidden hover-lift">
          <div className="relative h-48 overflow-hidden">
            <img
              src={event.image}
              alt={event.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
          
          <CardHeader>
            <CardTitle className="text-xl">{event.title}</CardTitle>
            <CardDescription className="flex flex-col gap-2 text-sm">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {event.date}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {event.venue}
              </span>
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              {event.description}
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
