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
import { Upload, CheckCircle2, Download, Users, Plus, X } from 'lucide-react';
import phonePeQR from '@/assets/phonepe-qr.png';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { getAllEvents, Event } from '@/data/events';
export default function Registration() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [availableEvents, setAvailableEvents] = useState<any[]>([]);
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [errorDialog, setErrorDialog] = useState<{ open: boolean; title: string; message: string }>({
    open: false,
    title: '',
    message: ''
  });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    branch: '',
    year: '',
    transactionId: '',
    consent: false,
    isIeeeMember: false,
    ieeeMemberId: '',
    teamMembers: {} as Record<string, Array<{ name: string; email: string; phone: string }>>
  });
  const [teamMemberCounts, setTeamMemberCounts] = useState<Record<string, number>>({});
  const steps = ['Registration Details', 'Payment', 'Confirmation'];
  useEffect(() => {
    fetchEvents();
    const eventId = searchParams.get('event');
    if (eventId) {
      setSelectedEvents([eventId]);
    }
  }, [searchParams]);
  const fetchEvents = async () => {
    const {
      data,
      error
    } = await supabase.from('events').select('*, chapters(code)').order('day', {
      ascending: true
    });
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
  const handleNext = async () => {
    if (currentStep === 0) {
      // Validate step 1
      if (!formData.name || !formData.email || !formData.phone || !formData.branch || !formData.year || selectedEvents.length === 0) {
        setErrorDialog({
          open: true,
          title: 'Required Fields Missing',
          message: 'Please fill all required fields and select at least one event to continue.'
        });
        return;
      }
      if (formData.isIeeeMember && !formData.ieeeMemberId) {
        setErrorDialog({
          open: true,
          title: 'IEEE Member ID Required',
          message: 'You have indicated that you are an IEEE member. Please enter your IEEE Member ID to continue.'
        });
        return;
      }
      if (!formData.consent) {
        setErrorDialog({
          open: true,
          title: 'Consent Required',
          message: 'Please accept the terms and conditions to proceed with your registration.'
        });
        return;
      }

      // Check for conflicts across all selected events
      try {
        // First check for time conflicts between selected events
        const selectedEventData = availableEvents.filter(e => selectedEvents.includes(e.id));
        for (let i = 0; i < selectedEventData.length; i++) {
          for (let j = i + 1; j < selectedEventData.length; j++) {
            const event1 = selectedEventData[i];
            const event2 = selectedEventData[j];

            // Check if events are on the same date
            if (event1.date === event2.date) {
              const start1 = event1.start_time || '00:00:00';
              const end1 = event1.end_time || '23:59:59';
              const start2 = event2.start_time || '00:00:00';
              const end2 = event2.end_time || '23:59:59';

              // Check time overlap
              if (start1 <= end2 && end1 >= start2) {
                setErrorDialog({
                  open: true,
                  title: 'Schedule Conflict Detected',
                  message: `The events "${event1.title}" and "${event2.title}" have overlapping schedules. Please select events with different time slots.`
                });
                return;
              }
            }
          }
        }

        // Check each selected event for conflicts with existing registrations
        for (const eventId of selectedEvents) {
          const {
            data: conflictData,
            error: conflictError
          } = await supabase.rpc('check_registration_conflict', {
            p_event_id: eventId,
            p_user_id: null,
            // Guest registration
            p_participant_email: formData.email,
            p_participant_phone: formData.phone
          });
          if (conflictError) {
            console.error('Conflict check error:', conflictError);
            toast.error('Failed to verify registration eligibility');
            return;
          }
          const conflict = conflictData as {
            exists_same_event: boolean;
            exists_overlap: boolean;
          } | null;
          const eventTitle = availableEvents.find(e => e.id === eventId)?.title || 'Selected event';
          if (conflict?.exists_same_event) {
            setErrorDialog({
              open: true,
              title: 'Duplicate Registration',
              message: `You have already registered for "${eventTitle}". Each participant can only register once per event.`
            });
            return;
          }
          if (conflict?.exists_overlap) {
            setErrorDialog({
              open: true,
              title: 'Schedule Conflict',
              message: `"${eventTitle}" overlaps with another event you are already registered for. Please choose events with different time slots.`
            });
            return;
          }
        }
      } catch (error) {
        console.error('Error checking conflicts:', error);
        toast.error('Failed to verify registration eligibility');
        return;
      }
    } else if (currentStep === 1) {
      // Validate step 2
      if (!paymentProof || !formData.transactionId) {
        setErrorDialog({
          open: true,
          title: 'Payment Information Required',
          message: 'Please upload your payment proof screenshot and enter the transaction ID to complete your registration.'
        });
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
    const {
      error: uploadError
    } = await supabase.storage.from('payment-proofs').upload(filePath, paymentProof);
    if (uploadError) {
      console.error('Upload error:', uploadError);
      return null;
    }
    const {
      data: {
        publicUrl
      }
    } = supabase.storage.from('payment-proofs').getPublicUrl(filePath);
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

  // Calculate final amounts with SPS and APS combo pricing
      const selectedEventsData = availableEvents.filter(e => selectedEvents.includes(e.id));
      const spsEventsInSelection = selectedEventsData.filter(e => e.chapters?.code === 'SPS');
      const apsEventsInSelection = selectedEventsData.filter(e => e.chapters?.code === 'APS');
      const otherEventsInSelection = selectedEventsData.filter(e => e.chapters?.code !== 'SPS' && e.chapters?.code !== 'APS');
      
      const spsCombo = spsEventsInSelection.length > 0 ? calculateSPSComboPrice(spsEventsInSelection.length) : 0;
      const spsPerEventPrice = spsEventsInSelection.length > 0 ? spsCombo / spsEventsInSelection.length : 0;
      
      const apsCombo = apsEventsInSelection.length > 0 ? calculateAPSComboPrice(apsEventsInSelection.length) : 0;
      const apsPerEventPrice = apsEventsInSelection.length > 0 ? apsCombo / apsEventsInSelection.length : 0;
      
      // Create registrations for all selected events
      const registrations = selectedEvents.map(eventId => {
        const event = availableEvents.find(e => e.id === eventId);
        const isSPSEvent = event?.chapters?.code === 'SPS';
        const isAPSEvent = event?.chapters?.code === 'APS';
        
        // Use combo price for SPS/APS events (no IEEE discount), regular price with IEEE discount for others
        const eventAmount = isSPSEvent ? spsPerEventPrice : isAPSEvent ? apsPerEventPrice : (Number(event?.registration_amount) || 200);
        const finalAmount = (isSPSEvent || isAPSEvent) ? eventAmount : (formData.isIeeeMember ? Math.max(eventAmount - IEEE_DISCOUNT_PER_EVENT, 0) : eventAmount);
        
        // Get event details from events data
        const eventDetails = getAllEvents().find(e => e.id === eventId);
        const teamMembers = formData.teamMembers[eventId] || [];
        
        return {
          participant_name: formData.name,
          participant_email: formData.email,
          participant_phone: formData.phone,
          participant_branch: formData.branch,
          participant_year: formData.year,
          event_id: eventId,
          payment_proof_url: paymentProofUrl,
          transaction_id: formData.transactionId,
          payment_status: 'pending',
          status: 'submitted',
          is_ieee_member: formData.isIeeeMember,
          ieee_member_id: formData.isIeeeMember ? formData.ieeeMemberId : null,
          team_size: eventDetails?.team_size?.max || null,
          team_members: teamMembers.length > 0 ? teamMembers : null,
          team_leader_name: teamMembers.length > 0 ? formData.name : null
        };
      });
      const {
        error
      } = await supabase.from('registrations').insert(registrations);
      if (error) {
        console.error('Registration error:', error);
        toast.error('Failed to submit registration');
        setUploading(false);
        return;
      }
      setCurrentStep(2);
      toast.success(`Successfully registered for ${selectedEvents.length} event(s)!`);
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred during registration');
    } finally {
      setUploading(false);
    }
  };
  const selectedEventData = availableEvents.filter(e => selectedEvents.includes(e.id));
  const preSelectedEvent = searchParams.get('event') ? selectedEventData[0] : null;
  const handleEventToggle = (eventId: string) => {
    setSelectedEvents(prev => prev.includes(eventId) ? prev.filter(id => id !== eventId) : [...prev, eventId]);
  };

  // Handle team member changes
  const handleTeamMemberChange = (eventId: string, memberIndex: number, field: string, value: string) => {
    setFormData(prev => {
      const teamMembers = { ...prev.teamMembers };
      if (!teamMembers[eventId]) {
        teamMembers[eventId] = [];
      }
      if (!teamMembers[eventId][memberIndex]) {
        teamMembers[eventId][memberIndex] = { name: '', email: '', phone: '' };
      }
      teamMembers[eventId][memberIndex] = {
        ...teamMembers[eventId][memberIndex],
        [field]: value
      };
      return { ...prev, teamMembers };
    });
  };

  // Get team events from selected events
  const getTeamEvents = () => {
    const eventsData = getAllEvents();
    return selectedEvents
      .map(eventId => eventsData.find(e => e.id === eventId))
      .filter(event => event && event.team_size);
  };

  // Add team member for an event
  const addTeamMember = (eventId: string, maxSize: number) => {
    const currentCount = teamMemberCounts[eventId] || 0;
    if (currentCount < maxSize - 1) {
      setTeamMemberCounts(prev => ({
        ...prev,
        [eventId]: currentCount + 1
      }));
    }
  };

  // Remove team member for an event
  const removeTeamMember = (eventId: string, memberIndex: number) => {
    setFormData(prev => {
      const teamMembers = { ...prev.teamMembers };
      if (teamMembers[eventId]) {
        teamMembers[eventId] = teamMembers[eventId].filter((_, idx) => idx !== memberIndex);
      }
      return { ...prev, teamMembers };
    });
    setTeamMemberCounts(prev => ({
      ...prev,
      [eventId]: Math.max(0, (prev[eventId] || 0) - 1)
    }));
  };

  // SPS Combo pricing calculation
  const calculateSPSComboPrice = (spsEventCount: number): number => {
    if (spsEventCount === 1) return 150;
    if (spsEventCount === 2) return 250;
    if (spsEventCount === 3) return 350;
    return spsEventCount * 150; // Fallback to per-event pricing
  };

  // APS Combo pricing calculation
  const calculateAPSComboPrice = (apsEventCount: number): number => {
    if (apsEventCount === 1) return 200;
    if (apsEventCount === 2) return 250;
    if (apsEventCount === 3) return 350;
    return apsEventCount * 200; // Fallback to per-event pricing
  };

  // Calculate total with SPS and APS combo pricing and IEEE discount (only for non-SPS/APS events)
  const IEEE_DISCOUNT_PER_EVENT = 50;
  
  // Separate SPS, APS, and other events
  const spsEvents = selectedEventData.filter(e => e.chapters?.code === 'SPS');
  const apsEvents = selectedEventData.filter(e => e.chapters?.code === 'APS');
  const otherEvents = selectedEventData.filter(e => e.chapters?.code !== 'SPS' && e.chapters?.code !== 'APS');
  
  // Calculate SPS combo price (no IEEE discount for SPS)
  const spsComboPrice = spsEvents.length > 0 ? calculateSPSComboPrice(spsEvents.length) : 0;
  
  // Calculate APS combo price (no IEEE discount for APS)
  const apsComboPrice = apsEvents.length > 0 ? calculateAPSComboPrice(apsEvents.length) : 0;
  
  // Calculate other events price with IEEE discount
  const otherEventsPrice = otherEvents.reduce((sum, event) => {
    const eventAmount = Number(event.registration_amount) || 200;
    const discountedAmount = formData.isIeeeMember ? Math.max(eventAmount - IEEE_DISCOUNT_PER_EVENT, 0) : eventAmount;
    return sum + discountedAmount;
  }, 0);
  
  // Total amount
  const totalAmount = spsComboPrice + apsComboPrice + otherEventsPrice;
  
  // Calculate original amount (without combo or discounts)
  const originalAmount = selectedEventData.reduce((sum, event) => sum + (Number(event.registration_amount) || 200), 0);
  
  // Calculate total discount (combo savings + IEEE discount for non-SPS/APS events only)
  const spsComboSavings = spsEvents.length > 0 ? (spsEvents.reduce((sum, e) => sum + (Number(e.registration_amount) || 150), 0) - spsComboPrice) : 0;
  const apsComboSavings = apsEvents.length > 0 ? (apsEvents.reduce((sum, e) => sum + (Number(e.registration_amount) || 200), 0) - apsComboPrice) : 0;
  const ieeeDiscount = formData.isIeeeMember ? otherEvents.length * IEEE_DISCOUNT_PER_EVENT : 0;
  const totalDiscount = spsComboSavings + apsComboSavings + ieeeDiscount;
  return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary/10 p-6">
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
            {currentStep === 0 && <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {preSelectedEvent && <div className="col-span-full bg-primary/10 border border-primary/20 rounded-lg p-4 mb-4">
                      <p className="text-sm font-medium text-primary">
                        Pre-selected Event: {preSelectedEvent.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        You can select additional events below
                      </p>
                    </div>}

                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input id="name" required value={formData.name} onChange={e => setFormData({
                  ...formData,
                  name: e.target.value
                })} />
                  </div>

                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input id="email" type="email" required value={formData.email} onChange={e => setFormData({
                  ...formData,
                  email: e.target.value
                })} />
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input id="phone" type="tel" required value={formData.phone} onChange={e => setFormData({
                  ...formData,
                  phone: e.target.value
                })} />
                  </div>

                  <div>
                    <Label htmlFor="branch">Branch *</Label>
                    <Input id="branch" required value={formData.branch} onChange={e => setFormData({
                  ...formData,
                  branch: e.target.value
                })} />
                  </div>

                  <div>
                    <Label htmlFor="year">Year *</Label>
                    <Select value={formData.year} onValueChange={value => setFormData({
                  ...formData,
                  year: value
                })}>
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
                    <Label>Select Events * (You can select multiple events)</Label>
                    <div className="mt-2 border rounded-lg p-4 max-h-64 overflow-y-auto space-y-3">
                      {availableEvents.map(event => {
                        const isRegistrationClosed = event.registration_open === false;
                        return (
                          <div key={event.id} className={`flex items-start space-x-3 p-3 rounded-md transition-colors ${isRegistrationClosed ? 'opacity-50 bg-muted/30' : 'hover:bg-muted/50'}`}>
                            <Checkbox 
                              id={`event-${event.id}`} 
                              checked={selectedEvents.includes(event.id)} 
                              onCheckedChange={() => handleEventToggle(event.id)}
                              disabled={isRegistrationClosed}
                            />
                            <label htmlFor={`event-${event.id}`} className={`flex-1 text-sm ${isRegistrationClosed ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">Day {event.day} - {event.title}</span>
                                {isRegistrationClosed && (
                                  <span className="px-2 py-0.5 text-xs font-medium bg-destructive/20 text-destructive rounded">
                                    Registrations Closed
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">
                                {event.date} • {event.start_time || 'TBA'} - {event.end_time || 'TBA'}
                                {event.venue && ` • ${event.venue}`}
                              </div>
                              <div className="text-xs font-medium text-primary mt-1">
                                ₹{event.registration_amount || 200}
                              </div>
                            </label>
                          </div>
                        );
                      })}
                    </div>
                    {selectedEvents.length > 0 && <div className="mt-3 p-3 bg-primary/10 rounded-lg space-y-1">
                        <p className="text-sm font-medium">
                          {selectedEvents.length} event(s) selected
                        </p>
                        {((spsComboSavings + apsComboSavings) > 0 || (formData.isIeeeMember && ieeeDiscount > 0)) && <>
                            <p className="text-xs text-muted-foreground">
                              Original Amount: ₹{originalAmount}
                            </p>
                            {spsComboSavings > 0 && <p className="text-xs text-blue-600 font-medium">
                              SPS Combo Savings: -₹{spsComboSavings.toFixed(0)}
                            </p>}
                            {apsComboSavings > 0 && <p className="text-xs text-purple-600 font-medium">
                              APS Combo Savings: -₹{apsComboSavings.toFixed(0)}
                            </p>}
                            {formData.isIeeeMember && ieeeDiscount > 0 && <p className="text-xs text-green-600 font-medium">
                              IEEE Discount (non-SPS/APS events): -₹{ieeeDiscount}
                            </p>}
                            <p className="text-xs font-medium text-green-600">
                              Total Savings: -₹{totalDiscount.toFixed(0)}
                            </p>
                          </>}
                        <p className="text-sm font-semibold">
                          Total Amount: ₹{totalAmount}
                        </p>
                      </div>}
                  </div>

                  {/* Team Members Section */}
                  {getTeamEvents().length > 0 && (
                    <div className="col-span-full border-t pt-4 space-y-6">
                      <div className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-primary" />
                        <h3 className="font-semibold">Team Member Details</h3>
                      </div>
                      
                      {getTeamEvents().map(event => {
                        if (!event) return null;
                        const maxTeamSize = event.team_size!.max;
                        const currentMembers = formData.teamMembers[event.id] || [];
                        const memberCount = teamMemberCounts[event.id] || 0;
                        
                        return (
                          <div key={event.id} className="space-y-3 p-4 bg-muted/50 rounded-lg">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium">{event.title}</h4>
                                <p className="text-xs text-muted-foreground">
                                  Team Size: {event.team_size!.min}-{event.team_size!.max} members
                                  {event.prizes && (
                                    <span className="ml-2 text-primary font-medium">
                                      • Prizes: {event.prizes.map(p => `${p.position}: ₹${p.amount}`).join(', ')}
                                    </span>
                                  )}
                                </p>
                                {event.template_url && (
                                  <a 
                                    href={event.template_url} 
                                    download
                                    className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-1"
                                  >
                                    <Download className="h-3 w-3" />
                                    Download Template
                                  </a>
                                )}
                              </div>
                            </div>
                            
                            <div className="text-xs text-muted-foreground bg-background/50 p-2 rounded">
                              You are the team leader. Add {event.team_size!.min === 1 ? 'up to' : 'additional'} {maxTeamSize - 1} team member(s) below.
                            </div>

                            {Array.from({ length: memberCount }).map((_, idx) => (
                              <div key={idx} className="space-y-2 p-3 bg-background rounded border">
                                <div className="flex items-center justify-between">
                                  <p className="text-sm font-medium">Team Member {idx + 1}</p>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeTeamMember(event.id, idx)}
                                    className="h-7 w-7 p-0"
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                  <div>
                                    <Label htmlFor={`team-${event.id}-${idx}-name`} className="text-xs">Name</Label>
                                    <Input 
                                      id={`team-${event.id}-${idx}-name`}
                                      value={currentMembers[idx]?.name || ''}
                                      onChange={(e) => handleTeamMemberChange(event.id, idx, 'name', e.target.value)}
                                      placeholder="Enter name"
                                      className="h-9"
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor={`team-${event.id}-${idx}-email`} className="text-xs">Email</Label>
                                    <Input 
                                      id={`team-${event.id}-${idx}-email`}
                                      type="email"
                                      value={currentMembers[idx]?.email || ''}
                                      onChange={(e) => handleTeamMemberChange(event.id, idx, 'email', e.target.value)}
                                      placeholder="Enter email"
                                      className="h-9"
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor={`team-${event.id}-${idx}-phone`} className="text-xs">Phone</Label>
                                    <Input 
                                      id={`team-${event.id}-${idx}-phone`}
                                      type="tel"
                                      value={currentMembers[idx]?.phone || ''}
                                      onChange={(e) => handleTeamMemberChange(event.id, idx, 'phone', e.target.value)}
                                      placeholder="Enter phone"
                                      className="h-9"
                                    />
                                  </div>
                                </div>
                              </div>
                            ))}

                            {memberCount < maxTeamSize - 1 && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => addTeamMember(event.id, maxTeamSize)}
                                className="w-full"
                              >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Team Member
                              </Button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="space-y-4 border-t pt-4">
                  <div className="flex items-start space-x-2">
                    <Checkbox id="ieee-member" checked={formData.isIeeeMember} onCheckedChange={checked => setFormData({
                  ...formData,
                  isIeeeMember: checked as boolean
                })} />
                    <label htmlFor="ieee-member" className="text-sm leading-none font-medium">
                      I am an IEEE Member
                    </label>
                  </div>

                  {formData.isIeeeMember && <div>
                      <Label htmlFor="ieee-id">IEEE Member ID *</Label>
                      <Input id="ieee-id" required value={formData.ieeeMemberId} onChange={e => setFormData({
                  ...formData,
                  ieeeMemberId: e.target.value
                })} placeholder="Enter your IEEE Member ID" />
                    </div>}
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox id="consent" checked={formData.consent} onCheckedChange={checked => setFormData({
                ...formData,
                consent: checked as boolean
              })} />
                  <label htmlFor="consent" className="text-sm leading-none">
                    I consent to the collection and processing of my personal data for this event registration *
                  </label>
                </div>
              </>}

            {currentStep === 1 && <div className="space-y-6">
                <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-4">
                  <h3 className="font-semibold mb-2">Payment Summary</h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Events Selected:</span>
                      <span className="font-medium">{selectedEvents.length}</span>
                    </div>
                    {((spsComboSavings + apsComboSavings) > 0 || (formData.isIeeeMember && ieeeDiscount > 0)) && <>
                        <div className="flex justify-between text-muted-foreground">
                          <span>Original Amount:</span>
                          <span>₹{originalAmount}</span>
                        </div>
                        {spsComboSavings > 0 && <div className="flex justify-between text-blue-600">
                          <span>SPS Combo Savings:</span>
                          <span>-₹{spsComboSavings.toFixed(0)}</span>
                        </div>}
                        {apsComboSavings > 0 && <div className="flex justify-between text-purple-600">
                          <span>APS Combo Savings:</span>
                          <span>-₹{apsComboSavings.toFixed(0)}</span>
                        </div>}
                        {formData.isIeeeMember && ieeeDiscount > 0 && <div className="flex justify-between text-green-600">
                          <span>IEEE Discount (non-SPS/APS):</span>
                          <span>-₹{ieeeDiscount}</span>
                        </div>}
                        {totalDiscount > 0 && <div className="flex justify-between text-green-600 font-medium">
                          <span>Total Savings:</span>
                          <span>-₹{totalDiscount.toFixed(0)}</span>
                        </div>}
                      </>}
                    <div className="flex justify-between font-semibold text-base pt-2 border-t">
                      <span>Amount to Pay:</span>
                      <span className="text-primary">₹{totalAmount}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-muted p-6 rounded-lg text-center">
                  <h3 className="font-semibold mb-4">Payment QR Code</h3>
                  <div className="bg-white p-4 inline-block rounded-lg">
                    <img src={phonePeQR} alt="PhonePe Payment QR Code" className="w-64 h-auto max-w-full" />
                  </div>
                  <p className="text-sm text-muted-foreground mt-4">
                    Scan the QR code using PhonePe to make payment of ₹{totalAmount}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">Payment to: Gedela Tejaswini</p>
                </div>

                <div>
                  <Label htmlFor="payment-proof">Upload Payment Screenshot *</Label>
                  <div className="mt-2">
                    <label htmlFor="payment-proof" className="flex items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary transition-colors">
                      <div className="text-center">
                        <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                        <p className="mt-2 text-sm text-muted-foreground">
                          {paymentProof ? paymentProof.name : 'Click to upload payment proof'}
                        </p>
                      </div>
                    </label>
                    <input id="payment-proof" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                  </div>
                </div>

                <div>
                  <Label htmlFor="transaction-id">Transaction ID *</Label>
                  <Input id="transaction-id" required value={formData.transactionId} onChange={e => setFormData({
                ...formData,
                transactionId: e.target.value
              })} placeholder="Enter your transaction ID" />
                </div>
              </div>}

            {currentStep === 2 && <div className="text-center py-8">
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
                <Button className="mt-6" onClick={() => navigate('/events')}>
                  Browse More Events
                </Button>
              </div>}

            {currentStep < 2 && <div className="flex justify-between pt-4">
                <Button type="button" variant="outline" onClick={handleBack} disabled={currentStep === 0}>
                  Back
                </Button>
                <Button type="button" onClick={currentStep === 1 ? handleSubmit : handleNext} disabled={uploading}>
                  {uploading ? 'Submitting...' : currentStep === 1 ? 'Submit Registration' : 'Next'}
                </Button>
              </div>}
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={errorDialog.open} onOpenChange={(open) => setErrorDialog({ ...errorDialog, open })}>
        <AlertDialogContent className="max-w-lg">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl">{errorDialog.title}</AlertDialogTitle>
            <AlertDialogDescription className="text-base">
              {errorDialog.message}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setErrorDialog({ ...errorDialog, open: false })}>
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>;
}