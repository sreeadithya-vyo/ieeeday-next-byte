export interface Registration {
  id: number;
  name: string;
  email: string;
  event: string;
  chapter: string;
  payment: 'verified' | 'unverified' | 'pending';
  status: 'pending' | 'confirmed' | 'rejected';
  amount: number;
  proof?: string;
  branch?: string;
}

export interface Event {
  id: number;
  name: string;
  chapter: string;
  day: string;
  venue: string;
  registrations: number;
  pending: number;
  status: 'active' | 'completed' | 'upcoming';
  assignedAdmin: string;
}

export interface Admin {
  id: number;
  name: string;
  email: string;
  role: string;
  chapter?: string;
  status: 'active' | 'inactive';
  eventsAssigned?: number;
}

export interface AuditLog {
  id: number;
  actor: string;
  action: string;
  target: string;
  timestamp: string;
  notes: string;
}

export const registrations: Registration[] = [
  { id: 101, name: "Sree Kumar", email: "sree@student.edu", event: "ML Antenna Design", chapter: "APS", payment: "verified", status: "confirmed", amount: 200, branch: "ECE" },
  { id: 102, name: "Rahul Sharma", email: "rahul@student.edu", event: "Circuit Mania", chapter: "CS", payment: "pending", status: "pending", amount: 150, branch: "EEE" },
  { id: 103, name: "Priya Reddy", email: "priya@student.edu", event: "Tech Quiz", chapter: "PES", payment: "verified", status: "confirmed", amount: 100, branch: "CSE" },
  { id: 104, name: "Amit Patel", email: "amit@student.edu", event: "AI Arena", chapter: "CS", payment: "unverified", status: "pending", amount: 250, branch: "IT" },
  { id: 105, name: "Sneha Iyer", email: "sneha@student.edu", event: "Webcraft Workshop", chapter: "PROCOMM", payment: "verified", status: "confirmed", amount: 180, branch: "CSE" },
];

export const events: Event[] = [
  { id: 1, name: "ML Antenna Design", chapter: "APS", day: "Day 1", venue: "ECE Lab", registrations: 45, pending: 5, status: "active", assignedAdmin: "APS Admin" },
  { id: 2, name: "Circuit Mania", chapter: "CS", day: "Day 1", venue: "EEE Lab", registrations: 38, pending: 8, status: "active", assignedAdmin: "CS Admin" },
  { id: 3, name: "Tech Quiz", chapter: "PES", day: "Day 2", venue: "Seminar Hall", registrations: 60, pending: 3, status: "upcoming", assignedAdmin: "PES Admin" },
  { id: 4, name: "AI Arena", chapter: "CS", day: "Day 2", venue: "Computer Lab", registrations: 52, pending: 12, status: "upcoming", assignedAdmin: "CS Admin" },
  { id: 5, name: "Webcraft Workshop", chapter: "PROCOMM", day: "Day 1", venue: "IT Lab", registrations: 40, pending: 6, status: "active", assignedAdmin: "PROCOMM Admin" },
  { id: 6, name: "Digital Presence Workshop", chapter: "PROCOMM", day: "Day 2", venue: "Seminar Hall 2", registrations: 35, pending: 4, status: "upcoming", assignedAdmin: "PROCOMM Admin" },
  { id: 7, name: "Reverse Coding", chapter: "CS", day: "Day 1", venue: "Lab 3", registrations: 30, pending: 2, status: "completed", assignedAdmin: "CS Admin" },
  { id: 8, name: "PPT Contest", chapter: "SPS", day: "Day 2", venue: "Auditorium", registrations: 55, pending: 7, status: "upcoming", assignedAdmin: "SPS Admin" },
];

export const admins: Admin[] = [
  { id: 1, name: "Elite Master", email: "elite@ieee.org", role: "elite_master", status: "active" },
  { id: 2, name: "Super Admin", email: "super@ieee.org", role: "super_admin", status: "active", eventsAssigned: 12 },
  { id: 3, name: "APS Admin", email: "aps@ieee.org", role: "aps_admin", chapter: "APS", status: "active", eventsAssigned: 2 },
  { id: 4, name: "CS Admin", email: "cs@ieee.org", role: "cs_admin", chapter: "CS", status: "active", eventsAssigned: 3 },
  { id: 5, name: "PES Admin", email: "pes@ieee.org", role: "pes_admin", chapter: "PES", status: "active", eventsAssigned: 1 },
  { id: 6, name: "PROCOMM Admin", email: "procomm@ieee.org", role: "procomm_admin", chapter: "PROCOMM", status: "active", eventsAssigned: 2 },
  { id: 7, name: "SPS Admin", email: "sps@ieee.org", role: "sps_admin", chapter: "SPS", status: "active", eventsAssigned: 1 },
];

export const auditLogs: AuditLog[] = [
  { id: 1, actor: "Elite Master", action: "Approved Registration", target: "RegID 101", timestamp: "2025-01-15 10:30 AM", notes: "Payment verified" },
  { id: 2, actor: "Super Admin", action: "Created Event", target: "AI Arena", timestamp: "2025-01-14 02:15 PM", notes: "Day 2 event" },
  { id: 3, actor: "APS Admin", action: "Rejected Registration", target: "RegID 99", timestamp: "2025-01-14 11:00 AM", notes: "Invalid payment proof" },
  { id: 4, actor: "Elite Master", action: "Added Admin", target: "CS Admin", timestamp: "2025-01-13 09:45 AM", notes: "New chapter admin" },
];
