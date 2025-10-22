import { useParams } from 'react-router-dom';
import { Calendar, Users, Clock, CheckCircle, XCircle } from 'lucide-react';
import DashboardCard from '@/components/dashboard/DashboardCard';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { events, registrations } from '@/data/dashboardData';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

const ChapterDashboard = () => {
  const { chapter } = useParams();
  const { toast } = useToast();
  const [selectedEvent, setSelectedEvent] = useState<number | null>(null);

  const chapterName = chapter?.toUpperCase() || '';
  const chapterEvents = events.filter(e => e.chapter.toLowerCase() === chapter);
  const chapterRegistrations = registrations.filter(r => r.chapter.toLowerCase() === chapter);

  const totalEvents = chapterEvents.length;
  const pendingPayments = chapterRegistrations.filter(r => r.payment === 'pending').length;
  const confirmedParticipants = chapterRegistrations.filter(r => r.status === 'confirmed').length;
  const rejectedRegistrations = chapterRegistrations.filter(r => r.status === 'rejected').length;

  const handleApprove = (id: number) => {
    toast({
      title: "Approved",
      description: `Registration #${id} approved successfully`,
    });
  };

  const handleReject = (id: number) => {
    toast({
      title: "Rejected",
      description: `Registration #${id} has been rejected`,
      variant: "destructive",
    });
  };

  const handleExport = (type: string) => {
    toast({
      title: "Export Started",
      description: `Exporting ${type} participants...`,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{chapterName} Chapter Dashboard</h1>
        <p className="text-muted-foreground mt-1">Manage your chapter events and participants</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard title="Total Events" value={totalEvents} icon={Calendar} />
        <DashboardCard title="Pending Payments" value={pendingPayments} icon={Clock} />
        <DashboardCard title="Confirmed Participants" value={confirmedParticipants} icon={CheckCircle} />
        <DashboardCard title="Rejected" value={rejectedRegistrations} icon={XCircle} />
      </div>

      {/* My Events Table */}
      <div className="bg-card rounded-xl border border-border shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4 text-foreground">My Events</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Event</TableHead>
              <TableHead>Day</TableHead>
              <TableHead>Venue</TableHead>
              <TableHead>Registrations</TableHead>
              <TableHead>Pending</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {chapterEvents.map((event) => (
              <TableRow key={event.id}>
                <TableCell className="font-medium">{event.name}</TableCell>
                <TableCell>{event.day}</TableCell>
                <TableCell>{event.venue}</TableCell>
                <TableCell>{event.registrations}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{event.pending}</Badge>
                </TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" onClick={() => setSelectedEvent(event.id)}>
                        View Participants
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl">
                      <DialogHeader>
                        <DialogTitle>{event.name} - Participants</DialogTitle>
                      </DialogHeader>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Reg ID</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Branch</TableHead>
                            <TableHead>Payment</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {chapterRegistrations
                            .filter(r => r.event === event.name)
                            .map((reg) => (
                              <TableRow key={reg.id}>
                                <TableCell>#{reg.id}</TableCell>
                                <TableCell>{reg.name}</TableCell>
                                <TableCell>{reg.branch}</TableCell>
                                <TableCell>
                                  <Badge variant={reg.payment === 'verified' ? 'default' : 'secondary'}>
                                    {reg.payment}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <Badge variant={reg.status === 'confirmed' ? 'default' : 'secondary'}>
                                    {reg.status}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <div className="flex space-x-2">
                                    {reg.status === 'pending' && (
                                      <>
                                        <Button size="sm" onClick={() => handleApprove(reg.id)}>
                                          Approve
                                        </Button>
                                        <Button size="sm" variant="destructive" onClick={() => handleReject(reg.id)}>
                                          Reject
                                        </Button>
                                      </>
                                    )}
                                    {reg.status !== 'pending' && (
                                      <Button size="sm" variant="outline">
                                        View Details
                                      </Button>
                                    )}
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Export Section */}
      <div className="bg-card rounded-xl border border-border shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4 text-foreground">Export Data</h2>
        <div className="flex space-x-4">
          <Button onClick={() => handleExport('all')} className="bg-[#00629B] hover:bg-[#004870]">
            Export All Participants
          </Button>
          <Button onClick={() => handleExport('pending')} variant="outline">
            Export Pending Only
          </Button>
          <Button onClick={() => handleExport('verified')} variant="outline">
            Export Verified Only
          </Button>
        </div>
      </div>

      {/* Contact Card */}
      <div className="bg-card rounded-xl border border-border shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4 text-foreground">Chapter Information</h2>
        <div className="space-y-2">
          <p className="text-sm"><span className="font-medium">Chapter:</span> {chapterName}</p>
          <p className="text-sm"><span className="font-medium">Email:</span> {chapter}@ieee.org</p>
          <p className="text-sm"><span className="font-medium">Phone:</span> +91 98765 43210</p>
        </div>
      </div>
    </div>
  );
};

export default ChapterDashboard;
