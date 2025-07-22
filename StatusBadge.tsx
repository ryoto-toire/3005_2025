import React from 'react';
import { TaskStatus } from '../types';

interface StatusBadgeProps {
  status: TaskStatus;
}

const statusColors: Record<TaskStatus, string> = {
  [TaskStatus.NOT_STARTED]: 'bg-slate-500/50 text-slate-300',
  [TaskStatus.IN_PROGRESS]: 'bg-blue-500/50 text-blue-300',
  [TaskStatus.REVIEWING]: 'bg-yellow-500/50 text-yellow-300',
  [TaskStatus.COMPLETED]: 'bg-green-500/50 text-green-300',
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const colorClasses = statusColors[status] || 'bg-gray-500 text-gray-100';

  return (
    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${colorClasses}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
