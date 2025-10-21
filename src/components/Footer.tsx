import { Instagram, Linkedin, Globe } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-secondary/50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-center text-sm text-muted-foreground">
            © 2025 IEEE Student Branch. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground transition-colors hover:text-primary"
              aria-label="Instagram"
            >
              <Instagram className="h-5 w-5" />
            </a>
            <a
              href="https://www.linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground transition-colors hover:text-primary"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </a>
            <a
              href="https://www.ieee.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground transition-colors hover:text-primary"
              aria-label="IEEE.org"
            >
              <Globe className="h-5 w-5" />
            </a>
          </div>
        </div>
        <div className="mt-4 flex justify-center gap-4 text-xs text-muted-foreground">
          <a href="#" className="hover:text-primary">Privacy Policy</a>
          <span>•</span>
          <a href="#" className="hover:text-primary">Terms & Conditions</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
