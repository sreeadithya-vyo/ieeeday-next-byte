import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Mail, Phone, MapPin, User } from "lucide-react";
const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all fields");
      return;
    }
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success("Message sent successfully! We'll get back to you soon.");
    setFormData({
      name: "",
      email: "",
      message: ""
    });
    setIsSubmitting(false);
  };
  const contacts = [{
    role: "Student Branch Councilor",
    name: "Dr. P. Siva Kumar",
    phone: "+91 8074480076",
    email: "sivakumarperumal@ieee.org"
  }, {
    role: "Student Coordinator",
    name: "Narayanapurapu Ganesh",
    phone: "+91 9398689925",
    email: "Ieeedaycelebrations@gmail.com"
  }, {
    role: "Student Coordinator",
    name: "V. Vyshnavi",
    email: "Ieeedaycelebrations@gmail.com"
  }];
  return <div className="min-h-screen py-16">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">Contact Us</h1>
          <p className="text-lg text-muted-foreground">
            Get in touch with our team for any queries or information
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Contact Information */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {contacts.map((contact, index) => <div key={index} className="rounded-lg bg-secondary/50 p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <User className="h-5 w-5 text-primary" />
                      <p className="font-semibold">{contact.role}</p>
                    </div>
                    <p className="mb-2 text-sm font-medium">{contact.name}</p>
                    <div className="space-y-1">
                      {contact.phone && <a href={`tel:${contact.phone}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
                          <Phone className="h-4 w-4" />
                          {contact.phone}
                        </a>}
                      <a href={`mailto:${contact.email}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
                        <Mail className="h-4 w-4" />
                        {contact.email}
                      </a>
                    </div>
                  </div>)}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Venue Location
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-sm text-muted-foreground">
                  IEEE Student Branch, Department of Electronics & Communication Engineering
                </p>
                <div className="overflow-hidden rounded-lg">
                  <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3818.783477644317!2d81.51599807515255!3d16.83709428395922!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a37b35461d025f1%3A0x7c40bfdee72b3807!2sSasi%20Institute%20of%20Technology%20%26%20Engineering.!5e0!3m2!1sen!2sin!4v1761212322619!5m2!1sen!2sin" width="100%" height="250" style={{
                  border: 0
                }} allowFullScreen loading="lazy" title="Venue Location" />
                </div>
                <a href="https://www.google.com/maps" target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-sm text-primary hover:underline">
                  Open in Google Maps
                </a>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          
        </div>
      </div>
    </div>;
};
export default Contact;