import { Calendar, FileText, DollarSign, CheckCircle } from 'lucide-react';
import DashboardCard from '@/components/dashboard/DashboardCard';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { events, registrations, admins } from '@/data/dashboardData';
import { useToast } from '@/hooks/use-toast';

const SuperDashboard = () => {
  const { toast } = useToast();

  const totalEvents = events.length;
  const totalRegistrations = registrations.length;
  const confirmedRegistrations = registrations.filter(r => r.status === 'confirmed').length;
  const totalRevenue = registrations.reduce((sum, r) => sum + r.amount, 0);

  const handleExport = (type: string) => {
    toast({
      title: "Export Started",
      description: `Exporting ${type} data...`,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Super Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">Global management and oversight</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard title="Total Events" value={totalEvents} icon={Calendar} />
        <DashboardCard title="Total Registrations" value={totalRegistrations} icon={FileText} />
        <DashboardCard title="Confirmed" value={confirmedRegistrations} icon={CheckCircle} />
        <DashboardCard title="Revenue" value={`₹${totalRevenue}`} icon={DollarSign} />
      </div>

      {/* Event Management */}
      <div className="bg-card rounded-xl border border-border shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-foreground">Event Management</h2>
          <Button className="bg-[#00629B] hover:bg-[#004870]">Add Event</Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Event</TableHead>
              <TableHead>Chapter</TableHead>
              <TableHead>Day</TableHead>
              <TableHead>Assigned Admin</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.map((event) => (
              <TableRow key={event.id}>
                <TableCell className="font-medium">{event.name}</TableCell>
                <TableCell>{event.chapter}</TableCell>
                <TableCell>{event.day}</TableCell>
                <TableCell>{event.assignedAdmin}</TableCell>
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

      {/* Registration Approvals */}
      <div className="bg-card rounded-xl border border-border shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4 text-foreground">Registration Management</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Reg ID</TableHead>
              <TableHead>Participant</TableHead>
              <TableHead>Event</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {registrations.slice(0, 5).map((reg) => (
              <TableRow key={reg.id}>
                <TableCell className="font-medium">#{reg.id}</TableCell>
                <TableCell>{reg.name}</TableCell>
                <TableCell>{reg.event}</TableCell>
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
                  <Button size="sm" variant="outline">View</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Chapter Admins */}
      <div className="bg-card rounded-xl border border-border shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4 text-foreground">Chapter Admins</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Chapter</TableHead>
              <TableHead>Events Assigned</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {admins.filter(a => a.chapter).map((admin) => (
              <TableRow key={admin.id}>
                <TableCell className="font-medium">{admin.name}</TableCell>
                <TableCell>{admin.email}</TableCell>
                <TableCell>{admin.chapter}</TableCell>
                <TableCell>{admin.eventsAssigned || 0}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">Edit</Button>
                    <Button size="sm" variant="destructive">Remove</Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Export Section */}
      <div className="bg-card rounded-xl border border-border shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4 text-foreground">Export Reports</h2>
        <div className="flex space-x-4">
          <Button onClick={() => handleExport('chapter')} variant="outline">
            Export by Chapter
          </Button>
          <Button onClick={() => handleExport('day')} variant="outline">
            Export by Day
          </Button>
          <Button onClick={() => handleExport('all')} className="bg-[#00629B] hover:bg-[#004870]">
            Export All
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SuperDashboard;
