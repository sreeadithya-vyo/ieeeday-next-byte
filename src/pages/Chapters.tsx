import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const chapters = [
  {
    id: 'APS',
    name: 'Antennas and Propagation Society',
    code: 'SBC64284D',
    logo: '/images/aps-logo.png',
    description: 'Advancing knowledge of antennas, propagation, and electromagnetic theory through technical excellence and innovation.',
  },
  {
    id: 'CS',
    name: 'Computer Society',
    code: 'SBC64284',
    logo: '/images/cs-logo.png',
    description: 'Promoting computational theory, software engineering, and advancing computer science education and research.',
  },
  {
    id: 'PES',
    name: 'Power & Energy Society',
    code: 'SBC64284A',
    logo: '/images/pes-logo.png',
    description: 'Focused on electric power and energy systems, sustainable energy solutions, and power system engineering.',
  },
  {
    id: 'SPS',
    name: 'Signal Processing Society',
    code: 'SBC64284B',
    logo: '/images/sps-logo.png',
    description: 'Advancing signal processing theory, algorithms, and applications in audio, image, and data processing.',
  },
  {
    id: 'PROCOM',
    name: 'Professional Communication Society',
    code: 'SBC64284E',
    logo: '/images/procom-logo.png',
    description: 'Enhancing technical communication skills and promoting effective communication in engineering and technology.',
  },
];

const Chapters = () => {
  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">IEEE Student Branch Chapters</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Our IEEE Student Branch comprises five specialized chapters, each dedicated to advancing knowledge 
            and fostering innovation in their respective domains of electrical and computer engineering.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {chapters.map((chapter) => (
            <Card key={chapter.id} className="group overflow-hidden hover-lift">
              <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary/5 to-background flex items-center justify-center p-6">
                <img
                  src={chapter.logo}
                  alt={`${chapter.name} logo`}
                  className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              
              <CardHeader>
                <CardTitle className="text-xl">{chapter.name}</CardTitle>
                <CardDescription className="font-mono text-xs">
                  SASI IEEE SB CHAPTER - {chapter.code}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {chapter.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16">
          <Card className="bg-gradient-to-br from-primary/10 to-background">
            <CardHeader>
              <CardTitle className="text-2xl">About SASI IEEE Student Branch</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                The SASI IEEE Student Branch is a vibrant community of engineering students committed to 
                advancing technology for humanity. Through our five specialized chapters, we provide students 
                with opportunities to explore their interests, develop professional skills, and contribute to 
                cutting-edge research and innovation.
              </p>
              <p className="text-muted-foreground">
                Each chapter organizes technical events, workshops, seminars, and competitions that help 
                students gain practical knowledge and build connections with industry professionals and 
                researchers in their fields of interest.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Chapters;
