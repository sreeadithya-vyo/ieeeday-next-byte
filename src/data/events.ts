import mlAntennaImage from "@/assets/ml-antenna.jpg";
import pptContestImage from "@/assets/ppt-contest.jpg";
import circuitManiaImage from "@/assets/circuit-mania.jpg";
import escapeRoomImage from "@/assets/escape-room.jpg";
import reverseCodingImage from "@/assets/reverse-coding.jpg";
import mindsphereQuizImage from "@/assets/mindsphere-quiz.jpg";
import digitalPresenceImage from "@/assets/digital-presence-workshop.jpg";
import techQuizImage from "@/assets/tech-quiz.jpg";
import aiArenaImage from "@/assets/ai-arena.jpg";
import ideathonImage from "@/assets/ideathon.jpg";
import webcraftImage from "@/assets/webcraft.jpg";

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
  "escape-room": {
    id: "escape-room",
    title: "Escape Room Challenge",
    organizer: "Sasi IEEE Signal Processing Society Chapter",
    date: "31 October 2025",
    day: 1,
    start_time: "09:00",
    end_time: "16:20",
    venue: "Nikola Tesla Block, SITE",
    short_desc: "Interactive experience where teams solve clues, puzzles, and challenges to escape before time runs out.",
    long_desc: "An immersive escape room event combining technical challenges with problem-solving. Teams are placed in a themed scenario and must work collaboratively to solve a series of engineering-based puzzles and challenges within a time limit. This event tests both technical knowledge and teamwork under pressure.",
    image: escapeRoomImage,
    coordinators: [
      { name: "Ch. Keerthi Sri", phone: "+91XXXXXXXXXX" },
      { name: "P. Likhhita", phone: "+91XXXXXXXXXX" }
    ],
    schedule: [
      { time: "09:00 AM – 11:00 AM", activity: "Inauguration of CSG Chapter" },
      { time: "11:00 AM – 11:30 AM", activity: "Address by Dr. Naveen Kishore (HOD)" },
      { time: "11:30 AM – 12:30 PM", activity: "1st Round of Escape Room" },
      { time: "12:30 PM – 01:30 PM", activity: "Lunch Break" },
      { time: "01:30 PM – 03:30 PM", activity: "2nd Round (Puzzles/Challenges)" },
      { time: "03:30 PM – 03:45 PM", activity: "Tea Break" },
      { time: "03:45 PM – 04:20 PM", activity: "Cash Prize & Certificate Distribution" }
    ],
    program_outcomes: [
      "Technical Knowledge Application: Apply core ECE concepts to solve practical, time-bound challenges",
      "Problem-Solving and Critical Thinking: Analyze complex problems and use systematic reasoning",
      "Teamwork and Collaboration: Effectively collaborate and leverage team dynamics under pressure"
    ]
  },
  "digital-presence-workshop": {
    id: "digital-presence-workshop",
    title: "Professional Empowerment Workshop: Shaping Your Digital Presence in Industry 4.0",
    organizer: "Sasi IEEE Professional Communication Society Chapter",
    date: "31 October 2025",
    day: 1,
    start_time: "09:30",
    end_time: "15:45",
    venue: "Sasi Institute of Technology and Engineering",
    short_desc: "Build your digital identity, personal brand, and professional portfolio for Industry 4.0.",
    long_desc: "A comprehensive workshop focusing on building a strong digital presence in the modern professional world. Learn to craft compelling portfolios, optimize LinkedIn profiles, and develop effective personal branding strategies from industry experts.",
    image: digitalPresenceImage,
    guest: {
      name: "Mr. Niranjan",
      designation: "IEEE YP Representative",
      institution: "IEEE Professional Communication Society",
      role: "Guest of Honour and Resource Person"
    },
    coordinators: [
      { name: "N. Mohana Raja", phone: "+91XXXXXXXXXX" },
      { name: "G. Rambabu", phone: "+91XXXXXXXXXX" },
      { name: "K. Tejaswani Devi", phone: "+91XXXXXXXXXX" }
    ],
    schedule: [
      { time: "09:30 AM – 10:00 AM", activity: "Inaugural Ceremony & Icebreaker Session" },
      { time: "10:00 AM – 11:00 AM", activity: "Session 1: Content Building for Personal Portfolio – Part 1" },
      { time: "11:00 AM – 11:30 AM", activity: "Networking Break" },
      { time: "11:30 AM – 12:30 PM", activity: "Session 2: Content Building for Personal Portfolio – Part 2" },
      { time: "12:30 PM – 01:30 PM", activity: "Networking Lunch" },
      { time: "01:30 PM – 03:30 PM", activity: "IEEE Day Celebrations & Events" },
      { time: "03:30 PM – 03:45 PM", activity: "Closing of Day 1" }
    ],
    program_outcomes: [
      "Gained strategies to build a strong digital identity and personal brand",
      "Developed professionalism and career readiness aligned with Industry 4.0",
      "Learned effective digital communication and online portfolio management for career growth"
    ],
    topics: [
      "Identifying strengths and professional highlights",
      "Developing personalized statements",
      "Project summaries and achievements documentation",
      "LinkedIn optimization strategies"
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
  },
  "reverse-coding": {
    id: "reverse-coding",
    title: "Reverse Coding Contest",
    organizer: "Sasi IEEE Signal Processing Society",
    date: "1 November 2025",
    day: 2,
    start_time: "09:30",
    end_time: "12:00",
    venue: "Sasi Institute of Technology and Engineering",
    short_desc: "Challenge your debugging skills by analyzing code output and reconstructing the logic.",
    long_desc: "A unique coding competition where participants are given the output of a program and must reverse-engineer the code to match the given results. This event tests debugging abilities, algorithmic thinking, and problem-solving under pressure.",
    image: reverseCodingImage,
    coordinators: [
      { name: "P. Rajeswari", phone: "+91XXXXXXXXXX" }
    ],
    schedule: [
      { time: "09:00 AM – 09:15 AM", activity: "Welcome Note and Opening Ceremony" },
      { time: "09:15 AM – 09:30 AM", activity: "Introduction to Events" },
      { time: "09:30 AM – 12:00 PM", activity: "Reverse Coding Contest" },
      { time: "12:00 PM – 01:00 PM", activity: "Lunch Break" }
    ],
    program_outcomes: [
      "Enhanced Problem-Solving Skills: Develop ability to think backwards from output to code",
      "Improved Debugging Abilities: Master techniques for identifying and fixing code issues",
      "Deeper Understanding of Algorithms: Strengthen grasp of logic and algorithmic patterns",
      "Exposure to Real-World Coding Practices: Experience practical debugging scenarios"
    ]
  },
  "mindsphere-quiz": {
    id: "mindsphere-quiz",
    title: "Mindsphere Quiz",
    organizer: "Sasi IEEE Signal Processing Society",
    date: "1 November 2025",
    day: 2,
    start_time: "13:00",
    end_time: "15:30",
    venue: "Sasi Institute of Technology and Engineering",
    short_desc: "Test your knowledge across engineering concepts, current affairs, and general knowledge.",
    long_desc: "An engaging quiz competition covering diverse topics from core engineering concepts to current affairs and general knowledge. Teams compete through multiple rounds testing quick thinking, recall ability, and breadth of knowledge.",
    image: mindsphereQuizImage,
    coordinators: [
      { name: "Ch. Venkateswara Rao", phone: "+91XXXXXXXXXX" }
    ],
    schedule: [
      { time: "01:00 PM – 03:30 PM", activity: "Mindsphere Quiz Competition" },
      { time: "03:30 PM – 03:40 PM", activity: "Break" },
      { time: "03:40 PM – 04:00 PM", activity: "Prize Distribution Ceremony – Winners from All IEEE Chapters" },
      { time: "04:00 PM – 04:20 PM", activity: "Vote of Thanks" },
      { time: "04:20 PM – 04:30 PM", activity: "Group Photo & Closing of IEEE Day 2025" }
    ],
    program_outcomes: [
      "Enhanced general knowledge by staying updated on current affairs and global events",
      "Encouraged teamwork and quick thinking through competitive quizzing",
      "Strengthened understanding of core engineering concepts",
      "Fostered healthy competition and boosted confidence in recalling information under pressure"
    ]
  },
  "tech-quiz": {
    id: "tech-quiz",
    title: "Tech Quiz Championship",
    organizer: "Sasi IEEE Professional Communication Society Chapter",
    date: "1 November 2025",
    day: 2,
    start_time: "09:30",
    end_time: "15:30",
    venue: "Sasi Institute of Technology and Engineering",
    short_desc: "Multi-round quiz covering mathematics, technology, and aptitude challenges.",
    long_desc: "A comprehensive quiz competition integrated with professional portfolio building sessions. Participants compete in multiple rounds covering mathematics, general knowledge, technology, and aptitude while learning to create digital portfolios and enhance their professional presence.",
    image: techQuizImage,
    guest: {
      name: "Mr. Heyram & Mr. Ashvanth",
      designation: "Industry Professionals",
      institution: "Zoho Corporations & MassMutual India",
      role: "Workshop Speakers and Quiz Mentors"
    },
    coordinators: [
      { name: "P. Sai Ganesh", phone: "+91XXXXXXXXXX" },
      { name: "V. Tejaswini", phone: "+91XXXXXXXXXX" }
    ],
    schedule: [
      { time: "09:30 AM – 11:00 AM", activity: "Session: Creating Your Digital Portfolio & Website – Part 1" },
      { time: "11:00 AM – 11:30 AM", activity: "Networking Break" },
      { time: "11:30 AM – 12:00 PM", activity: "Session Continued: Launching Website Live" },
      { time: "12:00 PM – 12:30 PM", activity: "Session: Personal Branding & Presentation Skills" },
      { time: "12:30 PM – 01:30 PM", activity: "Networking Lunch" },
      { time: "01:30 PM – 03:00 PM", activity: "Session: Design, Layout & Visual Identity" },
      { time: "03:00 PM – 03:30 PM", activity: "Closing Ceremony & Vote of Thanks" }
    ],
    program_outcomes: [
      "Enhanced knowledge and problem-solving skills across mathematics, general knowledge, and technology",
      "Improved aptitude, observation, and memory through multi-round challenges",
      "Developed quick thinking and analytical skills by solving diverse quiz rounds",
      "Learned to create professional digital portfolios and personal brands"
    ],
    topics: [
      "GitHub Pages and WordPress portfolio creation",
      "LinkedIn optimization strategies",
      "Design principles using Canva/Figma",
      "Mathematics and technology quiz rounds"
    ]
  },
  "ai-arena": {
    id: "ai-arena",
    title: "AI ARENA",
    organizer: "IEEE Student Branch",
    date: "1 November 2025",
    day: 2,
    start_time: "09:00",
    end_time: "16:30",
    venue: "Alan Turing Block",
    short_desc: "Competitive Machine Learning challenge with real-world datasets and AI problem-solving.",
    long_desc: "AI ARENA is a competitive Machine Learning challenge designed to inspire participants to apply artificial intelligence concepts to real-world data. Teams will receive predefined datasets and must develop ML models that achieve the highest accuracy and efficiency. The event promotes analytical thinking, coding skills, and AI problem-solving abilities — a true battle of intelligence, innovation, and performance.",
    image: aiArenaImage,
    coordinators: [
      { name: "S. Sai Suma Sri", phone: "+91 6281659776" },
      { name: "S. Bhagya Rekha", phone: "+91XXXXXXXXXX" }
    ],
    schedule: [
      { time: "09:00 AM – 09:30 AM", activity: "Registration & Setup" },
      { time: "09:30 AM – 10:00 AM", activity: "Inauguration & Welcome Address" },
      { time: "10:00 AM – 10:30 AM", activity: "Dataset & Problem Statement Reveal" },
      { time: "10:30 AM – 12:45 PM", activity: "Model Building & Training Phase" },
      { time: "12:45 PM – 01:30 PM", activity: "Lunch Break" },
      { time: "01:30 PM – 03:30 PM", activity: "Model Finalization & Submission" },
      { time: "03:30 PM – 04:00 PM", activity: "Evaluation & Leaderboard Results" },
      { time: "04:00 PM – 04:30 PM", activity: "Prize Distribution & Closing Ceremony" }
    ],
    program_outcomes: [
      "Enhanced analytical thinking and AI problem-solving abilities",
      "Hands-on experience with machine learning model development",
      "Practical skills in data analysis and model optimization",
      "Exposure to competitive AI/ML challenges and real-world datasets"
    ],
    rules: [
      "Teams of 1–2 members",
      "Each team receives the same dataset and must build a model to achieve maximum accuracy",
      "Pre-trained models or external datasets are not allowed",
      "Code must be original and well-documented",
      "Participants can use Python, Jupyter Notebook, or Google Colab",
      "Submissions must include: final accuracy score, model explanation, and execution code file"
    ],
    criteria: [
      { name: "Model Accuracy", points: 60 },
      { name: "Code Efficiency", points: 20 },
      { name: "Execution Speed", points: 10 },
      { name: "Approach Explanation", points: 10 }
    ]
  },
  "ideathon": {
    id: "ideathon",
    title: "IDEATHON 2025",
    organizer: "IEEE Student Branch",
    date: "1 November 2025",
    day: 2,
    start_time: "09:00",
    end_time: "16:00",
    venue: "AIML Seminar Hall / Open Lab",
    short_desc: "Creative innovation challenge to present unique ideas that make real-world impact.",
    long_desc: "IDEATHON 2025 is a creative innovation challenge designed to inspire students to think critically and present unique ideas that can make a real-world impact. Participants will work collaboratively in teams to brainstorm and present their innovative solutions based on predefined themes. The event promotes creativity, innovation, and teamwork with 5 compelling themes: AI for Social Good, Sustainability and Green Innovation, Smart Education Systems, Digital Transformation and Automation, and HealthTech and Wellbeing.",
    image: ideathonImage,
    coordinators: [
      { name: "Coordinator Name", phone: "+91XXXXXXXXXX" }
    ],
    schedule: [
      { time: "09:00 AM – 01:00 PM", activity: "Preparation Time (4 hours)" },
      { time: "01:00 PM – 02:00 PM", activity: "Lunch Break" },
      { time: "02:00 PM – 04:00 PM", activity: "Team Presentations (2-3 min each)" },
      { time: "04:00 PM – 04:30 PM", activity: "Jury Evaluation & Results" },
      { time: "04:30 PM – 05:00 PM", activity: "Prize Distribution" }
    ],
    program_outcomes: [
      "Enhanced creative thinking and problem-solving abilities",
      "Improved presentation and communication skills",
      "Experience in collaborative team-based innovation",
      "Exposure to real-world problem themes and solution development"
    ],
    topics: [
      "AI for Social Good – Using AI to solve healthcare, education, or environmental problems",
      "Sustainability and Green Innovation – Eco-friendly practices and waste management",
      "Smart Education Systems – Technologies to improve learning and accessibility",
      "Digital Transformation and Automation – Automating processes in industries and daily life",
      "HealthTech and Wellbeing – Technology solutions for physical and mental health"
    ],
    rules: [
      "Teams of 2–4 members (maximum 4)",
      "Total of 30 teams maximum",
      "5 themes provided – participants must choose one theme",
      "4 hours of preparation time before presentation",
      "Each team has 2–3 minutes to present their idea",
      "Registration fee: ₹200 per team (₹150 for IEEE members)"
    ],
    criteria: [
      { name: "Innovation and Originality", points: 25 },
      { name: "Relevance to Theme", points: 20 },
      { name: "Practical Feasibility", points: 20 },
      { name: "Presentation and Communication", points: 20 },
      { name: "Teamwork and Effort", points: 15 }
    ]
  },
  "webcraft": {
    id: "webcraft",
    title: "WEBCRAFT",
    organizer: "IEEE Student Branch",
    date: "1 November 2025",
    day: 2,
    start_time: "10:00",
    end_time: "15:00",
    venue: "Alan Turing Block",
    short_desc: "Turn ideas into interactive web designs using Figma, HTML, CSS, JavaScript, and Bootstrap.",
    long_desc: "WEBCRAFT is a web development competition designed to enhance students' creativity and front-end development skills through modern web design and development challenges. Participants will design and build responsive, interactive websites using Figma, HTML, CSS, JavaScript, and Bootstrap. Teams will receive themes at the event start and must create functional, visually appealing websites within the time limit.",
    image: webcraftImage,
    coordinators: [
      { name: "N. Jahnavi", phone: "+91XXXXXXXXXX" },
      { name: "B. Tejasree", phone: "+91XXXXXXXXXX" }
    ],
    schedule: [
      { time: "10:00 AM – 12:00 PM", activity: "Website Design & Development Phase" },
      { time: "12:00 PM – 01:00 PM", activity: "Lunch Break" },
      { time: "01:00 PM – 03:00 PM", activity: "Final Presentations & Project Showcase" }
    ],
    program_outcomes: [
      "Enhanced front-end development skills with modern web technologies",
      "Improved creativity and UI/UX design abilities",
      "Practical experience with responsive web design and interactivity",
      "Strengthened problem-solving and time management under pressure"
    ],
    topics: [
      "Figma design and prototyping",
      "HTML, CSS, and JavaScript fundamentals",
      "Bootstrap framework for responsive design",
      "UI/UX design principles",
      "Web interactivity and optimization"
    ],
    rules: [
      "Themes will be provided at the event start",
      "Use Figma, HTML, CSS, JavaScript, and Bootstrap",
      "Focus on responsiveness, design consistency, and interactivity",
      "Registration fee: ₹200 per team (₹150 for IEEE members)",
      "Original work only – plagiarism will lead to disqualification"
    ],
    criteria: [
      { name: "Creativity and Visual Design", points: 30 },
      { name: "Code Efficiency & Optimization", points: 25 },
      { name: "Responsiveness and Interactivity", points: 25 },
      { name: "Execution Time", points: 20 }
    ]
  }
};

export const getAllEvents = (): Event[] => Object.values(eventsData);

export const getEventById = (id: string): Event | null => eventsData[id] || null;

export const getEventsByDay = (day: number): Event[] => 
  getAllEvents().filter(event => event.day === day);
