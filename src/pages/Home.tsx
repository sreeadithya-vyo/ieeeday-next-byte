import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Sparkles, Users, Trophy } from "lucide-react";
import heroImage from "@/assets/hero-bg.jpg";

const Home = () => {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[600px] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: `url(${heroImage})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/95 to-accent/95" />
        </div>
        
        <div className="container relative mx-auto flex min-h-[600px] items-center px-4">
          <div className="max-w-3xl animate-fade-in">
            <h1 className="mb-4 text-5xl font-bold leading-tight text-primary-foreground md:text-6xl lg:text-7xl">
              IEEE DAY 2025
            </h1>
            <h2 className="mb-6 text-2xl font-semibold text-primary-foreground/90 md:text-3xl">
              Innovate. Inspire. Impact.
            </h2>
            <p className="mb-8 text-lg text-primary-foreground/80 md:text-xl">
              Engineering a Smarter Tomorrow
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/events">
                <Button size="lg" className="gap-2 shadow-glow">
                  View Events
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/coordinators">
                <Button size="lg" variant="outline" className="border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20">
                  Meet Coordinators
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">About IEEE Day</h2>
            <p className="mb-6 text-lg text-muted-foreground">
              IEEE Day celebrates global collaboration among engineers and technology professionals worldwide.
              Join us as we bring together innovators, researchers, and students to shape the future of technology.
            </p>
            <div className="rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 p-8 text-left shadow-card">
              <h3 className="mb-3 flex items-center gap-2 text-2xl font-semibold">
                <Sparkles className="h-6 w-6 text-primary" />
                Theme 2025
              </h3>
              <p className="mb-6 text-xl font-medium text-primary">
                "Engineering a Smarter Tomorrow"
              </p>
              <h3 className="mb-3 flex items-center gap-2 text-2xl font-semibold">
                <Users className="h-6 w-6 text-primary" />
                About IEEE Student Branch
              </h3>
              <p className="text-muted-foreground">
                Our IEEE Student Branch encourages innovation and technical growth through seminars, 
                contests, and hands-on workshops. We provide a platform for students to develop leadership 
                skills, network with industry professionals, and contribute to cutting-edge technological 
                advancements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="bg-secondary/50 py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-3">
            <Card className="hover-lift">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-6 w-6 text-primary" />
                  3 Events
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Technical workshops and competitions designed to enhance your engineering skills
                </p>
              </CardContent>
            </Card>
            
            <Card className="hover-lift">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-6 w-6 text-primary" />
                  Expert Mentors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Learn from industry professionals and experienced faculty members
                </p>
              </CardContent>
            </Card>
            
            <Card className="hover-lift">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-6 w-6 text-primary" />
                  Certificates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Earn participation and achievement certificates from IEEE
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
