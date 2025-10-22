import { Users, Calendar, FileText, Clock, CheckCircle, XCircle, DollarSign, Shield } from 'lucide-react';
import DashboardCard from '@/components/dashboard/DashboardCard';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { registrations, events, admins, auditLogs } from '@/data/dashboardData';
import { useToast } from '@/hooks/use-toast';

const EliteDashboard = () => {
  const { toast } = useToast();

  const totalChapters = 5;
  const totalEvents = events.length;
  const totalRegistrations = registrations.length;
  const pendingApprovals = registrations.filter(r => r.status === 'pending').length;
  const confirmedRegistrations = registrations.filter(r => r.status === 'confirmed').length;
  const rejectedRegistrations = registrations.filter(r => r.status === 'rejected').length;
  const totalAmount = registrations.reduce((sum, r) => sum + r.amount, 0);

  const handleApprove = (id: number) => {
    toast({
      title: "Approved",
      description: `Registration #${id} has been approved`,
    });
  };

  const handleReject = (id: number) => {
    toast({
      title: "Rejected",
      description: `Registration #${id} has been rejected`,
      variant: "destructive",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Elite Master Dashboard</h1>
        <p className="text-muted-foreground mt-1">Complete system overview and control</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard title="Total Chapters" value={totalChapters} icon={Shield} />
        <DashboardCard title="Total Events" value={totalEvents} icon={Calendar} />
        <DashboardCard title="Total Registrations" value={totalRegistrations} icon={FileText} />
        <DashboardCard title="Pending Approvals" value={pendingApprovals} icon={Clock} />
        <DashboardCard title="Confirmed" value={confirmedRegistrations} icon={CheckCircle} />
        <DashboardCard title="Rejected" value={rejectedRegistrations} icon={XCircle} />
        <DashboardCard title="Total Revenue" value={`₹${totalAmount}`} icon={DollarSign} />
        <DashboardCard title="Active Admins" value={admins.filter(a => a.status === 'active').length} icon={Users} />
      </div>

      {/* Pending Approvals */}
      <div className="bg-card rounded-xl border border-border shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4 text-foreground">Pending Approvals</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Reg ID</TableHead>
              <TableHead>Participant</TableHead>
              <TableHead>Event</TableHead>
              <TableHead>Chapter</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {registrations.filter(r => r.status === 'pending').map((reg) => (
              <TableRow key={reg.id}>
                <TableCell className="font-medium">#{reg.id}</TableCell>
                <TableCell>{reg.name}</TableCell>
                <TableCell>{reg.event}</TableCell>
                <TableCell>{reg.chapter}</TableCell>
                <TableCell>
                  <Badge variant={reg.payment === 'verified' ? 'default' : 'secondary'}>
                    {reg.payment}
                  </Badge>
                </TableCell>
                <TableCell>₹{reg.amount}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button size="sm" onClick={() => handleApprove(reg.id)} className="bg-green-600 hover:bg-green-700">
                      Approve
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleReject(reg.id)}>
                      Reject
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Events Overview */}
      <div className="bg-card rounded-xl border border-border shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-foreground">Events Overview</h2>
          <Button className="bg-[#00629B] hover:bg-[#004870]">Create Event</Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Event</TableHead>
              <TableHead>Chapter</TableHead>
              <TableHead>Day</TableHead>
              <TableHead>Registrations</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.slice(0, 5).map((event) => (
              <TableRow key={event.id}>
                <TableCell className="font-medium">{event.name}</TableCell>
                <TableCell>{event.chapter}</TableCell>
                <TableCell>{event.day}</TableCell>
                <TableCell>{event.registrations}</TableCell>
                <TableCell>
                  <Badge variant={event.status === 'active' ? 'default' : 'secondary'}>
                    {event.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">Edit</Button>
                    <Button size="sm" variant="destructive">Delete</Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Audit Logs */}
      <div className="bg-card rounded-xl border border-border shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4 text-foreground">Recent Audit Logs</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Actor</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Target</TableHead>
              <TableHead>Timestamp</TableHead>
              <TableHead>Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {auditLogs.map((log) => (
              <TableRow key={log.id}>
                <TableCell className="font-medium">{log.actor}</TableCell>
                <TableCell>{log.action}</TableCell>
                <TableCell>{log.target}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{log.timestamp}</TableCell>
                <TableCell className="text-sm">{log.notes}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default EliteDashboard;
