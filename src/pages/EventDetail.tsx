import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, MapPin, ArrowLeft, Users } from "lucide-react";
import mlAntennaImage from "@/assets/ml-antenna.jpg";
import pptContestImage from "@/assets/ppt-contest.jpg";
import circuitManiaImage from "@/assets/circuit-mania.jpg";

const EventDetail = () => {
  const { eventId } = useParams();

  const eventsData: Record<string, any> = {
    "ml-antenna": {
      title: "ML for Antenna Design",
      image: mlAntennaImage,
      date: "31 October 2025",
      venue: "ECE Lab",
      time: "09:00 AM – 04:15 PM",
      about: "Hands-on technical workshop that integrates machine learning techniques into antenna design and optimization. Students learn how to automate antenna parameter tuning using Python and HFSS tools.",
      topics: [
        "Basics of ML models for EM applications",
        "Antenna design workflow in HFSS",
        "Optimization using Genetic Algorithm",
        "Real-time performance analysis",
      ],
      schedule: [
        { time: "09:00 – 09:20", activity: "Inauguration" },
        { time: "09:20 – 09:50", activity: "Keynote" },
        { time: "10:00 – 11:20", activity: "Session I — Lecture & Demo" },
        { time: "11:20 – 13:00", activity: "Hands-on Exercise" },
        { time: "13:00 – 14:00", activity: "Lunch Break" },
        { time: "14:00 – 15:30", activity: "Lab Session + Q&A" },
        { time: "15:45 – 16:15", activity: "Certificate Distribution" },
      ],
      jury: [
        "Dr. Rajesh Kumar, Professor, ECE Dept.",
        "Mr. Ankit Sharma, Senior Engineer, Tech Innovations",
      ],
      deliverables: [
        "Participation Certificate",
        "Project File Submission",
      ],
    },
    "ppt-contest": {
      title: "PPT Presentation Contest",
      image: pptContestImage,
      date: "1 November 2025",
      venue: "Seminar Hall",
      time: "01:00 PM – 04:00 PM",
      about: "Showcase innovative ideas in technology, energy, and sustainability before a panel of experts.",
      rules: [
        "Max 3 participants per team",
        "Presentation time: 7 minutes + 3 minutes Q&A",
        "Topics: Emerging Technologies, Future Energy Systems, AI Applications",
      ],
      schedule: [
        { time: "13:00 – 15:00", activity: "PPT Presentations" },
        { time: "15:00 – 15:30", activity: "Jury Discussion" },
        { time: "15:30 – 16:00", activity: "Prize Distribution" },
      ],
      criteria: [
        { name: "Innovation", points: 30 },
        { name: "Technical Depth", points: 25 },
        { name: "Presentation Clarity", points: 25 },
        { name: "Q&A Handling", points: 20 },
      ],
    },
    "circuit-mania": {
      title: "Circuit Mania",
      image: circuitManiaImage,
      date: "1 November 2025",
      venue: "ECE Lab",
      time: "10:00 AM – 04:00 PM",
      about: "A real-time circuit design and debugging competition. Participants test electronics skills under time pressure.",
      rules: [
        "Teams of 2–3",
        "Components and tools provided",
        "No external help or mobile usage allowed",
      ],
      schedule: [
        { time: "10:00 – 12:00", activity: "Circuit Design & Debugging" },
        { time: "12:00 – 12:30", activity: "Evaluation" },
        { time: "15:30 – 16:00", activity: "Results Announcement" },
      ],
      criteria: [
        { name: "Correctness", points: 35 },
        { name: "Design Efficiency", points: 25 },
        { name: "Safety & Build Quality", points: 20 },
        { name: "Time Efficiency", points: 20 },
      ],
    },
  };

  const event = eventId ? eventsData[eventId] : null;

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

        <h1 className="mb-6 text-4xl font-bold">{event.title}</h1>

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
            <span className="font-medium">{event.time}</span>
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>About</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{event.about}</p>
          </CardContent>
        </Card>

        {event.topics && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Topics Covered</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {event.topics.map((topic: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                    <span className="text-muted-foreground">{topic}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {event.rules && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Rules</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {event.rules.map((rule: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                    <span className="text-muted-foreground">{rule}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Schedule</CardTitle>
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
                  {event.schedule.map((item: any, index: number) => (
                    <tr key={index} className="border-b border-border/50">
                      <td className="py-3 pr-4 font-medium text-primary">{item.time}</td>
                      <td className="py-3 text-muted-foreground">{item.activity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {event.jury && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Jury Members
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {event.jury.map((member: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                    <span className="text-muted-foreground">{member}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {event.criteria && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Judging Criteria</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {event.criteria.map((criterion: any, index: number) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-muted-foreground">{criterion.name}</span>
                    <span className="font-semibold text-primary">{criterion.points} points</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {event.deliverables && (
          <Card>
            <CardHeader>
              <CardTitle>Deliverables</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {event.deliverables.map((item: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default EventDetail;
