import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { ChevronLeft, ChevronRight, Upload, Loader2 } from 'lucide-react';
import { z } from 'zod';

const personalDetailsSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email'),
  phone: z.string().min(10, 'Phone must be at least 10 digits').max(15),
  branch: z.string().min(1, 'Branch is required'),
  year: z.string().min(1, 'Year is required'),
});

export default function RegistrationWizard() {
  const [searchParams] = useSearchParams();
  const eventId = searchParams.get('event');
  const navigate = useNavigate();
  const { user } = useAuth();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [event, setEvent] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    branch: '',
    year: '',
    transactionId: '',
    paymentProof: null as File | null,
  });

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    if (!eventId) {
      navigate('/events');
      return;
    }

    fetchEvent();
  }, [user, eventId]);

  const fetchEvent = async () => {
    const { data } = await supabase
      .from('events')
      .select('*')
      .eq('id', eventId)
      .single();

    setEvent(data);
  };

  const handleNext = async () => {
    if (step === 1) {
      try {
        personalDetailsSchema.parse({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          branch: formData.branch,
          year: formData.year,
        });
        setStep(2);
      } catch (error: any) {
        toast.error(error.errors[0].message);
      }
    } else if (step === 2) {
      if (!formData.transactionId || !formData.paymentProof) {
        toast.error('Please provide transaction ID and payment proof');
        return;
      }
      setStep(3);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }
      setFormData({ ...formData, paymentProof: file });
    }
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      // Upload payment proof
      const fileExt = formData.paymentProof!.name.split('.').pop();
      const fileName = `${user!.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('payment-proofs')
        .upload(fileName, formData.paymentProof!);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('payment-proofs')
        .getPublicUrl(fileName);

      // Create registration
      const { error: insertError } = await supabase
        .from('registrations')
        .insert({
          event_id: eventId,
          user_id: user!.id,
          participant_name: formData.name,
          participant_email: formData.email,
          participant_phone: formData.phone,
          participant_branch: formData.branch,
          participant_year: formData.year,
          transaction_id: formData.transactionId,
          payment_proof_url: publicUrl,
          status: 'submitted',
          payment_status: 'pending',
        });

      if (insertError) throw insertError;

      // Send confirmation email
      await supabase.functions.invoke('send-registration-email', {
        body: {
          email: formData.email,
          name: formData.name,
          eventTitle: event.title,
          type: 'submitted',
        },
      });

      toast.success('Registration submitted successfully!');
      navigate('/register/confirmation');
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit registration');
    } finally {
      setLoading(false);
    }
  };

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/10 p-6">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Event Registration</CardTitle>
            <CardDescription>
              Registering for: <strong>{event.title}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Progress Steps */}
            <div className="flex items-center justify-between mb-8">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      step >= s ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {s}
                  </div>
                  {s < 3 && <div className={`w-24 h-1 ${step > s ? 'bg-primary' : 'bg-muted'}`} />}
                </div>
              ))}
            </div>

            {/* Step 1: Personal Details */}
            {step === 1 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold mb-4">Personal Details</h3>
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="branch">Branch</Label>
                  <Input
                    id="branch"
                    value={formData.branch}
                    onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="year">Year</Label>
                  <Select value={formData.year} onValueChange={(value) => setFormData({ ...formData, year: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1st Year</SelectItem>
                      <SelectItem value="2">2nd Year</SelectItem>
                      <SelectItem value="3">3rd Year</SelectItem>
                      <SelectItem value="4">4th Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold mb-4">Payment Information</h3>
                <div className="bg-muted p-6 rounded-lg text-center">
                  <p className="text-lg font-semibold mb-2">Scan QR Code to Pay</p>
                  <div className="bg-white p-4 rounded-lg inline-block mb-4">
                    {/* QR Code Placeholder */}
                    <div className="w-48 h-48 bg-gray-200 flex items-center justify-center">
                      QR Code
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">Event Fee: ₹100</p>
                </div>
                <div>
                  <Label htmlFor="transactionId">Transaction ID</Label>
                  <Input
                    id="transactionId"
                    value={formData.transactionId}
                    onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })}
                    placeholder="Enter transaction ID"
                  />
                </div>
                <div>
                  <Label htmlFor="paymentProof">Upload Payment Proof</Label>
                  <Input
                    id="paymentProof"
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleFileChange}
                  />
                  {formData.paymentProof && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Selected: {formData.paymentProof.name}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Summary */}
            {step === 3 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold mb-4">Summary</h3>
                <div className="bg-muted p-4 rounded-lg space-y-2">
                  <p><strong>Event:</strong> {event.title}</p>
                  <p><strong>Name:</strong> {formData.name}</p>
                  <p><strong>Email:</strong> {formData.email}</p>
                  <p><strong>Phone:</strong> {formData.phone}</p>
                  <p><strong>Branch:</strong> {formData.branch}</p>
                  <p><strong>Year:</strong> {formData.year}</p>
                  <p><strong>Transaction ID:</strong> {formData.transactionId}</p>
                  <p><strong>Payment Proof:</strong> {formData.paymentProof?.name}</p>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              {step > 1 && (
                <Button onClick={handleBack} variant="outline">
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
              )}
              {step < 3 ? (
                <Button onClick={handleNext} className="ml-auto">
                  Next
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} className="ml-auto" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Submit Registration
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
