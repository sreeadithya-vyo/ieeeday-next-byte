import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Users, CreditCard, UserCog } from 'lucide-react';

interface QuickActionsGridProps {
  onActionClick: (action: string) => void;
}

export default function QuickActionsGrid({ onActionClick }: QuickActionsGridProps) {
  const actions = [
    {
      id: 'create-event',
      icon: Calendar,
      title: 'Create New Event',
      description: 'Set up a new event for your chapter',
      gradient: 'from-purple-500 to-purple-700',
      textColor: 'text-white',
    },
    {
      id: 'manage-registrations',
      icon: Users,
      title: 'Manage Registrations',
      description: 'Review and process registrations',
      gradient: 'from-background to-background',
      textColor: 'text-foreground',
    },
    {
      id: 'process-payments',
      icon: CreditCard,
      title: 'Process Payments',
      description: 'Verify and approve payments',
      gradient: 'from-background to-background',
      textColor: 'text-foreground',
    },
    {
      id: 'assign-evaluators',
      icon: UserCog,
      title: 'Assign Evaluators',
      description: 'Manage event evaluators',
      gradient: 'from-background to-background',
      textColor: 'text-foreground',
    },
  ];

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Card 
              key={action.id}
              className={`cursor-pointer hover:shadow-lg transition-shadow border ${
                action.gradient.includes('purple') ? 'bg-gradient-to-br border-none' : ''
              } ${action.gradient}`}
              onClick={() => onActionClick(action.id)}
            >
              <CardContent className="pt-6">
                <Icon className={`h-8 w-8 mb-3 ${action.textColor === 'text-white' ? 'text-white' : 'text-primary'}`} />
                <h4 className={`font-semibold mb-1 ${action.textColor}`}>{action.title}</h4>
                <p className={`text-sm ${action.textColor === 'text-white' ? 'text-purple-100' : 'text-muted-foreground'}`}>
                  {action.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
