import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import { getEventById, getEventsByDay, getAllEvents, type Event } from "@/data/events";
import { AlertCircle, CheckCircle2 } from "lucide-react";

const Registration = () => {
  const [searchParams] = useSearchParams();
  const preSelectedEventId = searchParams.get("event");

  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<string>("");
  const [availableEvents, setAvailableEvents] = useState<Event[]>([]);
  const [isPreSelected, setIsPreSelected] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    branch: "",
    year: "",
    consent: false
  });

  const [registeredDays, setRegisteredDays] = useState<Set<number>>(new Set());
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedEvent, setSubmittedEvent] = useState<Event | null>(null);

  useEffect(() => {
    if (preSelectedEventId) {
      const event = getEventById(preSelectedEventId);
      if (event) {
        setSelectedDay(event.day);
        setSelectedEventId(event.id);
        setAvailableEvents([event]);
        setIsPreSelected(true);
      }
    }
  }, [preSelectedEventId]);

  useEffect(() => {
    if (selectedDay && !isPreSelected) {
      const events = getEventsByDay(selectedDay);
      setAvailableEvents(events);
      setSelectedEventId("");
    }
  }, [selectedDay, isPreSelected]);

  const handleDayChange = (day: string) => {
    const dayNum = parseInt(day);
    
    if (registeredDays.has(dayNum)) {
      toast({
        title: "Already Registered",
        description: `You have already registered for an event on Day ${dayNum}. You may register for another day.`,
        variant: "destructive"
      });
      return;
    }

    setSelectedDay(dayNum);
    setSelectedEventId("");
    setIsPreSelected(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedDay || !selectedEventId) {
      toast({
        title: "Incomplete Selection",
        description: "Please select both a day and an event.",
        variant: "destructive"
      });
      return;
    }

    if (registeredDays.has(selectedDay)) {
      toast({
        title: "Already Registered",
        description: `You have already registered for an event on Day ${selectedDay}.`,
        variant: "destructive"
      });
      return;
    }

    if (!formData.consent) {
      toast({
        title: "Consent Required",
        description: "Please accept the terms and conditions to proceed.",
        variant: "destructive"
      });
      return;
    }

    // Simulate registration
    const event = getEventById(selectedEventId);
    if (event) {
      setRegisteredDays(prev => new Set(prev).add(selectedDay));
      setSubmittedEvent(event);
      setIsSubmitted(true);
      
      toast({
        title: "Registration Successful!",
        description: `You are registered for ${event.title}`,
      });
    }
  };

  if (isSubmitted && submittedEvent) {
    return (
      <div className="min-h-screen py-16">
        <div className="container mx-auto max-w-2xl px-4">
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-background">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <CheckCircle2 className="h-10 w-10 text-primary" />
              </div>
              <CardTitle className="text-2xl">Registration Confirmed!</CardTitle>
              <CardDescription>
                Thank you for registering for IEEE DAY 2025
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-center">
              <div className="rounded-lg bg-secondary p-6">
                <h3 className="mb-2 text-xl font-semibold">{submittedEvent.title}</h3>
                <p className="text-muted-foreground">
                  <span className="font-medium">Date:</span> {submittedEvent.date}
                </p>
                <p className="text-muted-foreground">
                  <span className="font-medium">Time:</span> {submittedEvent.start_time} – {submittedEvent.end_time}
                </p>
                <p className="text-muted-foreground">
                  <span className="font-medium">Venue:</span> {submittedEvent.venue}
                </p>
              </div>

              <div className="rounded-lg border border-border p-4">
                <h4 className="mb-3 font-semibold">For Assistance, Contact:</h4>
                <div className="space-y-2 text-sm">
                  {submittedEvent.coordinators.map((coordinator, index) => (
                    <p key={index} className="text-muted-foreground">
                      <span className="font-medium">{coordinator.name}</span> – {coordinator.phone}
                    </p>
                  ))}
                </div>
              </div>

              <Button 
                onClick={() => {
                  setIsSubmitted(false);
                  setFormData({
                    fullName: "",
                    email: "",
                    phone: "",
                    branch: "",
                    year: "",
                    consent: false
                  });
                  setSelectedDay(null);
                  setSelectedEventId("");
                  setIsPreSelected(false);
                }}
                className="mt-6"
              >
                Register for Another Event
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto max-w-3xl px-4">
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-4xl font-bold">Event Registration</h1>
          <p className="text-lg text-muted-foreground">
            Register for IEEE DAY 2025 Events
          </p>
        </div>

        {isPreSelected && selectedEventId && (
          <div className="mb-6 rounded-lg border border-primary/30 bg-primary/5 p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-primary">Event Pre-selected</p>
                <p className="text-sm text-muted-foreground">
                  You've selected this event from the events page. Day {selectedDay} has been automatically selected.
                </p>
              </div>
            </div>
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Registration Form</CardTitle>
            <CardDescription>
              Fill in your details to register for the event
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Enter your full name"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="your.email@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91XXXXXXXXXX"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="branch">Branch *</Label>
                  <Select
                    required
                    value={formData.branch}
                    onValueChange={(value) => setFormData({ ...formData, branch: value })}
                  >
                    <SelectTrigger id="branch">
                      <SelectValue placeholder="Select branch" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cse">Computer Science</SelectItem>
                      <SelectItem value="ece">Electronics & Communication</SelectItem>
                      <SelectItem value="eee">Electrical & Electronics</SelectItem>
                      <SelectItem value="mech">Mechanical</SelectItem>
                      <SelectItem value="civil">Civil</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="year">Year *</Label>
                  <Select
                    required
                    value={formData.year}
                    onValueChange={(value) => setFormData({ ...formData, year: value })}
                  >
                    <SelectTrigger id="year">
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1st Year</SelectItem>
                      <SelectItem value="2">2nd Year</SelectItem>
                      <SelectItem value="3">3rd Year</SelectItem>
                      <SelectItem value="4">4th Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="day">Select Day *</Label>
                <Select
                  required
                  value={selectedDay?.toString() || ""}
                  onValueChange={handleDayChange}
                  disabled={isPreSelected}
                >
                  <SelectTrigger id="day">
                    <SelectValue placeholder="Choose event day" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Day 1 — 31 October 2025</SelectItem>
                    <SelectItem value="2">Day 2 — 1 November 2025</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {selectedDay && (
                <div className="space-y-2">
                  <Label htmlFor="event">Select Event *</Label>
                  <Select
                    required
                    value={selectedEventId}
                    onValueChange={setSelectedEventId}
                    disabled={isPreSelected}
                  >
                    <SelectTrigger id="event">
                      <SelectValue placeholder="Choose your event" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableEvents.map((event) => (
                        <SelectItem key={event.id} value={event.id}>
                          {event.title} ({event.start_time} – {event.end_time})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="consent"
                  checked={formData.consent}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, consent: checked as boolean })
                  }
                />
                <Label htmlFor="consent" className="text-sm leading-relaxed">
                  I agree to the terms and conditions and consent to receive event updates via email and SMS.
                </Label>
              </div>

              <Button type="submit" className="w-full" size="lg">
                Submit Registration
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Registration;
