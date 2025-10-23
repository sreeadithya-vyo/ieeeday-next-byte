import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { Stepper } from '@/components/ui/stepper';
import { supabase } from '@/integrations/supabase/client';
import { Upload, CheckCircle2 } from 'lucide-react';
import phonePeQR from '@/assets/phonepe-qr.png';

export default function Registration() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [availableEvents, setAvailableEvents] = useState<any[]>([]);
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    branch: '',
    year: '',
    transactionId: '',
    consent: false,
  });

  const steps = ['Registration Details', 'Payment', 'Confirmation'];

  useEffect(() => {
    fetchEvents();
    const eventId = searchParams.get('event');
    if (eventId) {
      setSelectedEvent(eventId);
    }
  }, [searchParams]);

  const fetchEvents = async () => {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('day', { ascending: true });
    
    if (error) {
      toast.error('Failed to load events');
      return;
    }
    
    setAvailableEvents(data || []);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size should be less than 5MB');
        return;
      }
      setPaymentProof(file);
    }
  };

  const handleNext = () => {
    if (currentStep === 0) {
      // Validate step 1
      if (!formData.name || !formData.email || !formData.phone || !formData.branch || !formData.year || !selectedEvent) {
        toast.error('Please fill all required fields');
        return;
      }
      if (!formData.consent) {
        toast.error('Please accept the terms and conditions');
        return;
      }
    } else if (currentStep === 1) {
      // Validate step 2
      if (!paymentProof || !formData.transactionId) {
        toast.error('Please upload payment proof and enter transaction ID');
        return;
      }
    }
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const uploadPaymentProof = async (): Promise<string | null> => {
    if (!paymentProof) return null;

    const fileExt = paymentProof.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('payment-proofs')
      .upload(filePath, paymentProof);

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('payment-proofs')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleSubmit = async () => {
    setUploading(true);
    
    try {
      // Upload payment proof
      const paymentProofUrl = await uploadPaymentProof();
      
      if (!paymentProofUrl) {
        toast.error('Failed to upload payment proof');
        setUploading(false);
        return;
      }

      // Create registration
      const { error } = await supabase
        .from('registrations')
        .insert({
          participant_name: formData.name,
          participant_email: formData.email,
          participant_phone: formData.phone,
          participant_branch: formData.branch,
          participant_year: formData.year,
          event_id: selectedEvent,
          payment_proof_url: paymentProofUrl,
          transaction_id: formData.transactionId,
          payment_status: 'pending',
          status: 'submitted',
        });

      if (error) {
        console.error('Registration error:', error);
        toast.error('Failed to submit registration');
        setUploading(false);
        return;
      }

      setCurrentStep(2);
      toast.success('Registration submitted successfully!');
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred during registration');
    } finally {
      setUploading(false);
    }
  };

  const selectedEventData = availableEvents.find(e => e.id === selectedEvent);
  const preSelectedEvent = searchParams.get('event') ? selectedEventData : null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary/10 p-6">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle>Event Registration</CardTitle>
          <CardDescription>
            Complete the registration process in three simple steps
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Stepper steps={steps} currentStep={currentStep} />
          
          <div className="mt-8 space-y-6">
            {currentStep === 0 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {preSelectedEvent && (
                    <div className="col-span-full bg-primary/10 border border-primary/20 rounded-lg p-4 mb-4">
                      <p className="text-sm font-medium text-primary">
                        Pre-selected Event: {preSelectedEvent.title}
                      </p>
                    </div>
                  )}

                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="branch">Branch *</Label>
                    <Input
                      id="branch"
                      required
                      value={formData.branch}
                      onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="year">Year *</Label>
                    <Select value={formData.year} onValueChange={(value) => setFormData({ ...formData, year: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Year" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1st Year</SelectItem>
                        <SelectItem value="2">2nd Year</SelectItem>
                        <SelectItem value="3">3rd Year</SelectItem>
                        <SelectItem value="4">4th Year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="col-span-full">
                    <Label htmlFor="event">Select Event *</Label>
                    <Select 
                      value={selectedEvent} 
                      onValueChange={setSelectedEvent}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select an event" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableEvents.map((event) => (
                          <SelectItem key={event.id} value={event.id}>
                            Day {event.day} - {event.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="consent" 
                    checked={formData.consent}
                    onCheckedChange={(checked) => setFormData({ ...formData, consent: checked as boolean })}
                  />
                  <label htmlFor="consent" className="text-sm leading-none">
                    I consent to the collection and processing of my personal data for this event registration *
                  </label>
                </div>
              </>
            )}

            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="bg-muted p-6 rounded-lg text-center">
                  <h3 className="font-semibold mb-4">Payment QR Code</h3>
                  <div className="bg-white p-4 inline-block rounded-lg">
                    <img 
                      src={phonePeQR} 
                      alt="PhonePe Payment QR Code" 
                      className="w-64 h-auto max-w-full"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground mt-4">
                    Scan the QR code using PhonePe to make payment
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Payment to: DASARI PURNA PAVAN KUMAR
                  </p>
                </div>

                <div>
                  <Label htmlFor="payment-proof">Upload Payment Screenshot *</Label>
                  <div className="mt-2">
                    <label 
                      htmlFor="payment-proof"
                      className="flex items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary transition-colors"
                    >
                      <div className="text-center">
                        <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                        <p className="mt-2 text-sm text-muted-foreground">
                          {paymentProof ? paymentProof.name : 'Click to upload payment proof'}
                        </p>
                      </div>
                    </label>
                    <input
                      id="payment-proof"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="transaction-id">Transaction ID *</Label>
                  <Input
                    id="transaction-id"
                    required
                    value={formData.transactionId}
                    onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })}
                    placeholder="Enter your transaction ID"
                  />
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="text-center py-8">
                <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="h-10 w-10 text-green-600" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">Registration Complete!</h3>
                <p className="text-muted-foreground mb-6">
                  Your registration process is completed. Our team will contact you after your payment status is confirmed.
                </p>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm font-medium mb-2">What happens next?</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• We'll verify your payment within 24-48 hours</li>
                    <li>• You'll receive a confirmation email once approved</li>
                    <li>• Check your email for further event details</li>
                  </ul>
                </div>
                <Button 
                  className="mt-6"
                  onClick={() => navigate('/events')}
                >
                  Browse More Events
                </Button>
              </div>
            )}

            {currentStep < 2 && (
              <div className="flex justify-between pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  disabled={currentStep === 0}
                >
                  Back
                </Button>
                <Button
                  type="button"
                  onClick={currentStep === 1 ? handleSubmit : handleNext}
                  disabled={uploading}
                >
                  {uploading ? 'Submitting...' : currentStep === 1 ? 'Submit Registration' : 'Next'}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
