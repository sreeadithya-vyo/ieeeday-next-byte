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
      title: "ML for Antenna Design",
      description: "Hands-on workshop integrating Machine Learning with antenna design using HFSS tools.",
      image: mlAntennaImage,
      date: "31 October 2025",
      venue: "ECE Lab",
      time: "09:00 AM – 04:15 PM",
    },
    {
      id: "ppt-contest",
      title: "PPT Presentation Contest",
      description: "Showcase your ideas in front of expert judges on emerging technologies.",
      image: pptContestImage,
      date: "1 November 2025",
      venue: "Seminar Hall",
      time: "01:00 PM – 04:00 PM",
    },
    {
      id: "circuit-mania",
      title: "Circuit Mania",
      description: "Competitive circuit debugging and design challenge for engineering minds.",
      image: circuitManiaImage,
      date: "1 November 2025",
      venue: "ECE Lab",
      time: "10:00 AM – 04:00 PM",
    },
  ];

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">Events at IEEE DAY 2025</h1>
          <p className="text-lg text-muted-foreground">
            Explore all technical and competitive events
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
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
              
              <CardContent>
                <p className="mb-4 text-sm text-muted-foreground">
                  {event.description}
                </p>
                <Link to={`/events/${event.id}`}>
                  <Button className="w-full gap-2">
                    View Details
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Events;
