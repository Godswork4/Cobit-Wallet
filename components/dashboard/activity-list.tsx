'use client';

import { Transaction } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { ArrowUpRight, ArrowDownLeft, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';

interface ActivityListProps {
  activities: Transaction[];
}

export default function ActivityList({ activities }: ActivityListProps) {
  // Function to get appropriate icon for each transaction type
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'sent':
        return <ArrowUpRight className="h-5 w-5 text-red-500" />;
      case 'received':
        return <ArrowDownLeft className="h-5 w-5 text-green-500" />;
      case 'swapped':
        return <RefreshCw className="h-5 w-5 text-blue-500" />;
      default:
        return <ArrowDownLeft className="h-5 w-5 text-gray-500" />;
    }
  };

  // Function to get appropriate text for each transaction type
  const getActivityAction = (type: string) => {
    switch (type) {
      case 'sent':
        return 'Sent';
      case 'received':
        return 'Received';
      case 'swapped':
        return 'Swapped';
      default:
        return 'Transaction';
    }
  };

  // Function to get appropriate text color for each transaction type
  const getAmountColor = (type: string) => {
    switch (type) {
      case 'sent':
        return 'text-red-500';
      case 'received':
        return 'text-green-500';
      case 'swapped':
        return 'text-blue-500';
      default:
        return 'text-gray-900';
    }
  };

  return (
    <div className="space-y-3">
      {activities.map((activity) => (
        <Card key={activity.id} className="p-3 flex items-center">
          <div className="bg-gray-100 rounded-full p-2 mr-3">
            {getActivityIcon(activity.type)}
          </div>
          
          <div className="flex-1">
            <div className="font-medium">{getActivityAction(activity.type)} {activity.token}</div>
            <div className="text-sm text-gray-500">{format(activity.date, 'MMM d, yyyy')}</div>
          </div>
          
          <div className={`text-right font-semibold ${getAmountColor(activity.type)}`}>
            {activity.type === 'sent' ? '-' : '+'}{activity.amount.toLocaleString(undefined, {
              minimumFractionDigits: activity.token === 'BTC' ? 4 : 2,
              maximumFractionDigits: activity.token === 'BTC' ? 4 : 2,
            })} {activity.token}
          </div>
        </Card>
      ))}
    </div>
  );
}