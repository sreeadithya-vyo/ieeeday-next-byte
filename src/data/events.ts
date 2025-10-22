import mlAntennaImage from "@/assets/ml-antenna.jpg";
import pptContestImage from "@/assets/ppt-contest.jpg";
import circuitManiaImage from "@/assets/circuit-mania.jpg";

export interface Event {
  id: string;
  title: string;
  organizer: string;
  date: string;
  day: number;
  start_time: string;
  end_time: string;
  venue: string;
  short_desc: string;
  long_desc: string;
  image: string;
  guest?: {
    name: string;
    designation: string;
    institution: string;
    role: string;
  };
  coordinators: Array<{
    name: string;
    phone: string;
  }>;
  schedule: Array<{
    time: string;
    activity: string;
  }>;
  program_outcomes: string[];
  topics?: string[];
  rules?: string[];
  criteria?: Array<{
    name: string;
    points: number;
  }>;
}

export const eventsData: Record<string, Event> = {
  "ml-antenna": {
    id: "ml-antenna",
    title: "Integration of Machine Learning in Antenna Modelling, Design, and Optimization",
    organizer: "Sasi IEEE APS Chapter",
    date: "31 October 2025",
    day: 1,
    start_time: "09:00",
    end_time: "16:15",
    venue: "SITE Campus",
    short_desc: "Hands-on workshop integrating ML with antenna design using HFSS tools.",
    long_desc: "This comprehensive workshop bridges the gap between machine learning and antenna engineering. Participants will learn to leverage ML algorithms for antenna parameter optimization, design automation, and performance prediction using industry-standard HFSS tools.",
    image: mlAntennaImage,
    guest: {
      name: "Dr. K. Vasu Babu",
      designation: "Professor",
      institution: "BVRIT Hyderabad College of Engineering for Women",
      role: "Guest of Honour"
    },
    coordinators: [
      { name: "Y. Rakesh", phone: "+91XXXXXXXXXX" },
      { name: "S. Divya Sri", phone: "+91XXXXXXXXXX" }
    ],
    schedule: [
      { time: "09:00 AM – 09:20 AM", activity: "Inauguration & Welcome" },
      { time: "09:20 AM – 09:50 AM", activity: "Keynote Address" },
      { time: "10:00 AM – 11:20 AM", activity: "Session I: ML Fundamentals for EM Applications" },
      { time: "11:20 AM – 13:00 PM", activity: "Hands-on Exercise: Antenna Design in HFSS" },
      { time: "13:00 PM – 14:00 PM", activity: "Lunch Break" },
      { time: "14:00 PM – 15:30 PM", activity: "Lab Session: ML-driven Optimization" },
      { time: "15:30 PM – 15:45 PM", activity: "Q&A Session" },
      { time: "15:45 PM – 16:15 PM", activity: "Certificate Distribution & Closing" }
    ],
    program_outcomes: [
      "Enhanced understanding of ML-based antenna optimization techniques",
      "Hands-on experience with HFSS and Python integration",
      "Practical skills in genetic algorithm implementation for antenna design",
      "Encouraged research interest in computational electromagnetics"
    ],
    topics: [
      "Basics of ML models for EM applications",
      "Antenna design workflow in HFSS",
      "Optimization using Genetic Algorithm",
      "Real-time performance analysis"
    ]
  },
  "ppt-contest": {
    id: "ppt-contest",
    title: "PPT Presentation Contest",
    organizer: "IEEE Student Branch",
    date: "1 November 2025",
    day: 2,
    start_time: "13:00",
    end_time: "16:00",
    venue: "Seminar Hall",
    short_desc: "Showcase your ideas in front of expert judges on emerging technologies.",
    long_desc: "A platform for students to present innovative ideas and research in emerging technologies. Teams will compete before a panel of industry experts and academia, demonstrating their technical depth, presentation skills, and ability to handle critical questions.",
    image: pptContestImage,
    coordinators: [
      { name: "M. Priya", phone: "+91XXXXXXXXXX" },
      { name: "K. Arjun", phone: "+91XXXXXXXXXX" }
    ],
    schedule: [
      { time: "13:00 PM – 15:00 PM", activity: "Team Presentations (7 min + 3 min Q&A each)" },
      { time: "15:00 PM – 15:30 PM", activity: "Jury Deliberation" },
      { time: "15:30 PM – 16:00 PM", activity: "Results Announcement & Prize Distribution" }
    ],
    program_outcomes: [
      "Improved presentation and public speaking skills",
      "Enhanced ability to articulate technical concepts clearly",
      "Experience in handling critical questions under pressure",
      "Exposure to industry expectations and evaluation criteria"
    ],
    rules: [
      "Maximum 3 participants per team",
      "Presentation time: 7 minutes + 3 minutes Q&A",
      "Topics: Emerging Technologies, Future Energy Systems, AI Applications, Sustainability",
      "Original content only – plagiarism will lead to disqualification"
    ],
    criteria: [
      { name: "Innovation & Originality", points: 30 },
      { name: "Technical Depth", points: 25 },
      { name: "Presentation Clarity", points: 25 },
      { name: "Q&A Handling", points: 20 }
    ]
  },
  "circuit-mania": {
    id: "circuit-mania",
    title: "Circuit Mania",
    organizer: "IEEE Student Branch",
    date: "1 November 2025",
    day: 2,
    start_time: "10:00",
    end_time: "16:00",
    venue: "ECE Lab",
    short_desc: "Competitive circuit debugging and design challenge for engineering minds.",
    long_desc: "An intense, real-time circuit design and debugging competition that tests participants' electronics fundamentals, problem-solving speed, and practical implementation skills. Teams will work with provided components to build and troubleshoot circuits under time constraints.",
    image: circuitManiaImage,
    coordinators: [
      { name: "R. Santhosh", phone: "+91XXXXXXXXXX" },
      { name: "P. Lakshmi", phone: "+91XXXXXXXXXX" }
    ],
    schedule: [
      { time: "10:00 AM – 10:15 AM", activity: "Registration & Problem Statement Distribution" },
      { time: "10:15 AM – 12:00 PM", activity: "Circuit Design & Implementation Phase" },
      { time: "12:00 PM – 12:30 PM", activity: "Circuit Testing & Evaluation" },
      { time: "12:30 PM – 13:00 PM", activity: "Break" },
      { time: "15:30 PM – 16:00 PM", activity: "Results Announcement & Prize Distribution" }
    ],
    program_outcomes: [
      "Strengthened understanding of circuit fundamentals",
      "Improved debugging and troubleshooting skills",
      "Enhanced teamwork under pressure",
      "Practical experience with circuit design and implementation"
    ],
    rules: [
      "Teams of 2–3 members",
      "All components and tools provided by organizers",
      "No external help or mobile device usage allowed during competition",
      "Safety protocols must be followed at all times"
    ],
    criteria: [
      { name: "Circuit Correctness", points: 35 },
      { name: "Design Efficiency", points: 25 },
      { name: "Safety & Build Quality", points: 20 },
      { name: "Time Efficiency", points: 20 }
    ]
  }
};

export const getAllEvents = (): Event[] => Object.values(eventsData);

export const getEventById = (id: string): Event | null => eventsData[id] || null;

export const getEventsByDay = (day: number): Event[] => 
  getAllEvents().filter(event => event.day === day);
