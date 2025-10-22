import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, User } from "lucide-react";

const Coordinators = () => {
  const facultyCoordinators = [
    {
      name: "Dr. Priya Sharma",
      department: "Electronics & Communication Engineering",
      designation: "Professor",
      role: "Faculty Coordinator",
      email: "priya.sharma@college.edu",
      phone: "+91 98765 43210",
    },
    {
      name: "Dr. Amit Kumar",
      department: "Computer Science & Engineering",
      designation: "Associate Professor",
      role: "Faculty Coordinator",
      email: "amit.kumar@college.edu",
      phone: "+91 98765 43211",
    },
  ];

  const studentCoordinators = [
    {
      name: "Rahul Verma",
      branch: "ECE",
      year: "3rd Year",
      role: "Event Head",
      contact: "+91 98765 43212",
      email: "rahul.verma@student.edu",
    },
    {
      name: "Sneha Patel",
      branch: "CSE",
      year: "3rd Year",
      role: "Logistics Head",
      contact: "+91 98765 43213",
      email: "sneha.patel@student.edu",
    },
    {
      name: "Arjun Singh",
      branch: "ECE",
      year: "2nd Year",
      role: "Public Relations",
      contact: "+91 98765 43214",
      email: "arjun.singh@student.edu",
    },
  ];

  const coreCommittee = [
    {
      role: "Chair",
      name: "Vikram Reddy",
      email: "vikram.reddy@student.edu",
    },
    {
      role: "Vice-Chair",
      name: "Ananya Iyer",
      email: "ananya.iyer@student.edu",
    },
    {
      role: "Secretary",
      name: "Karthik Menon",
      email: "karthik.menon@student.edu",
    },
    {
      role: "Treasurer",
      name: "Priyanka Das",
      email: "priyanka.das@student.edu",
    },
  ];

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">Our Team</h1>
          <p className="text-lg text-muted-foreground">
            Meet the dedicated individuals behind IEEE DAY 2025
          </p>
        </div>

        {/* Faculty Coordinators */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-semibold">Faculty Coordinators</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {facultyCoordinators.map((faculty, index) => (
              <Card key={index} className="hover-lift">
                <CardHeader>
                  <div className="mb-4 flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                      <User className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{faculty.name}</CardTitle>
                      <CardDescription>{faculty.designation}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-muted-foreground">{faculty.department}</p>
                  <p className="text-sm font-medium text-primary">{faculty.role}</p>
                  <div className="mt-4 space-y-2">
                    <a
                      href={`mailto:${faculty.email}`}
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
                    >
                      <Mail className="h-4 w-4" />
                      {faculty.email}
                    </a>
                    <a
                      href={`tel:${faculty.phone}`}
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
                    >
                      <Phone className="h-4 w-4" />
                      {faculty.phone}
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Student Coordinators */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-semibold">Student Coordinators</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {studentCoordinators.map((student, index) => (
              <Card key={index} className="hover-lift">
                <CardHeader>
                  <div className="mb-2 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{student.name}</CardTitle>
                      <CardDescription>
                        {student.branch} • {student.year}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm font-medium text-primary">{student.role}</p>
                  <div className="mt-3 space-y-2">
                    <a
                      href={`mailto:${student.email}`}
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
                    >
                      <Mail className="h-4 w-4" />
                      {student.email}
                    </a>
                    <a
                      href={`tel:${student.contact}`}
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
                    >
                      <Phone className="h-4 w-4" />
                      {student.contact}
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Core Committee */}
        <section>
          <h2 className="mb-6 text-2xl font-semibold">Core Committee</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {coreCommittee.map((member, index) => (
              <Card key={index} className="hover-lift">
                <CardHeader>
                  <div className="mb-2 flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{member.name}</CardTitle>
                      <CardDescription className="text-sm">{member.role}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <a
                    href={`mailto:${member.email}`}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
                  >
                    <Mail className="h-4 w-4" />
                    Email
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Coordinators;
