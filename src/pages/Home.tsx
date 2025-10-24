import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Lightbulb, Users, Rocket, BookOpen, Trophy, Code } from "lucide-react";
import heroImage from "@/assets/hero-bg.jpg";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
const Home = () => {
  const {
    user
  } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    const checkRoleAndRedirect = async () => {
      if (user) {
        const {
          data
        } = await supabase.from('user_roles').select('role').eq('user_id', user.id).single();
        if (data?.role === 'elite_master') {
          navigate('/admin/elite', {
            replace: true
          });
        }
      }
    };
    checkRoleAndRedirect();
  }, [user, navigate]);
  return <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[600px] overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{
        backgroundImage: `url(${heroImage})`
      }}>
          <div className="absolute inset-0 bg-gradient-to-r from-primary/95 to-accent/95" />
        </div>
        
        <div className="container relative mx-auto flex min-h-[600px] items-center px-4">
          <div className="max-w-3xl animate-fade-in">
            <h1 className="mb-4 text-3xl font-bold leading-tight text-primary-foreground md:text-2xl lg:text-3xl">Sasi IEEE Student Branch</h1>
            <h2 className="mb-3 text-xl font-medium leading-relaxed text-white text-left md:text-3xl lg:text-2xl">Sasi Institute of Technology and Engineering, Tadepalligudem 
Organizes </h2>
            <h3 className="mb-8 text-lg text-primary-foreground/90 md:text-4xl font-extrabold lg:text-5xl">2025 IEEE Day Celebrations</h3>
            <div className="flex flex-wrap gap-4">
              <Link to="/events">
                <Button size="lg" className="gap-2 shadow-glow">
                  View Events
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/register">
                <Button size="lg" variant="outline" className="border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20">
                  Register Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">About IEEE Student Branch  </h2>
            <p className="mx-auto max-w-3xl text-lg text-muted-foreground">IEEE Day celebrates global collaboration among engineers. Join us as we share ideas, innovations, and passiThe Sasi IEEE Student Branch (STB24684) was established in 2016 at Sasi Institute of Technology and Engineering (SITE), Tadepalligudem, Andhra Pradesh, India, under the IEEE Vizag Bay Section and IEEE India Council. Since its inception, the branch has been dedicated to fostering technical innovation, leadership development, and professional growth among students and faculty members. The SB contains 6 Chapters, with more than 200 IEEE Student Members and 8 Senior Members. The branch actively engages students from various engineering disciplines through a vibrant mix of technical workshops, guest lectures, hackathons, project exhibitions, and professional development activities. It provides a dynamic platform for students to explore emerging technologies and connect with the global IEEE community.on for technology that benefits humanity.</p>
          </div>

          <div className="mb-16">
            <h3 className="mb-8 text-center text-2xl font-bold">Why IEEE Matters</h3>
            <div className="grid gap-6 md:grid-cols-3">
              <Card className="hover-lift">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-6 w-6 text-primary" />
                    Innovation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Leading technological advancement through research and development
                  </p>
                </CardContent>
              </Card>
              <Card className="hover-lift">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-6 w-6 text-primary" />
                    Community
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Connecting 400,000+ members across 160 countries globally
                  </p>
                </CardContent>
              </Card>
              <Card className="hover-lift">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Rocket className="h-6 w-6 text-primary" />
                    Impact
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Creating solutions that shape the future of technology
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          <Card className="mb-16 bg-gradient-to-br from-primary/5 to-background">
            <CardHeader>
              <CardTitle className="text-2xl">About IEEE Student Branch</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-muted-foreground">The Sasi IEEE Student Branch (STB24684) was established in 2016 at Sasi Institute of Technology and Engineering (SITE), Tadepalligudem, Andhra Pradesh, India, under the IEEE Vizag Bay Section and IEEE India Council. Since its inception, the branch has been dedicated to fostering technical innovation, leadership development, and professional growth among students and faculty members. The SB contains 6 Chapters, with more than 200 IEEE Student Members and 8 Senior Members.
The branch actively engages students from various engineering disciplines through a vibrant mix of technical workshops, guest lectures, hackathons, project exhibitions, and professional development activities. It provides a dynamic platform for students to explore emerging technologies and connect with the global IEEE community.</p>
            </CardContent>
          </Card>

          <div>
            <h3 className="mb-8 text-center text-2xl font-bold">Event Highlights</h3>
            <div className="grid gap-6 md:grid-cols-3">
              <Card className="hover-lift"><CardHeader><CardTitle className="flex items-center gap-2"><BookOpen className="h-6 w-6 text-primary" />Workshops</CardTitle></CardHeader><CardContent><p className="text-muted-foreground">Hands-on learning with industry tools</p></CardContent></Card>
              <Card className="hover-lift"><CardHeader><CardTitle className="flex items-center gap-2"><Trophy className="h-6 w-6 text-primary" />Competitions</CardTitle></CardHeader><CardContent><p className="text-muted-foreground">Test your skills in circuit design</p></CardContent></Card>
              <Card className="hover-lift"><CardHeader><CardTitle className="flex items-center gap-2"><Code className="h-6 w-6 text-primary" />Innovation</CardTitle></CardHeader><CardContent><p className="text-muted-foreground">ML integration and emerging tech</p></CardContent></Card>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-primary/10 to-background py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold">Join the Celebration</h2>
          <p className="mb-8 text-lg text-muted-foreground">Be part of 2025 IEEE Day Celebrations</p>
          <Link to="/register"><Button size="lg" className="gap-2">Register Now<ArrowRight className="h-5 w-5" /></Button></Link>
        </div>
      </section>
    </div>;
};
export default Home;