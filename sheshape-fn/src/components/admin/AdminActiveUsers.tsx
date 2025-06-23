'use client';

import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials } from '@/lib/utils';

// Sample active users data
const activeUsers = [
  {
    id: 1,
    name: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    role: 'Client',
    avatar: '/images/avatars/user-1.jpg',
    lastActive: '2 minutes ago',
    currentPage: 'Workout Programs',
  },
  {
    id: 2,
    name: 'Michael Brown',
    email: 'michael.b@example.com',
    role: 'Client',
    avatar: '/images/avatars/user-2.jpg',
    lastActive: '5 minutes ago',
    currentPage: 'Shopping Cart',
  },
  {
    id: 3,
    name: 'Emma Wilson',
    email: 'emma.w@example.com',
    role: 'Trainer',
    avatar: '/images/avatars/user-3.jpg',
    lastActive: '1 minute ago',
    currentPage: 'Training Dashboard',
  },
  {
    id: 4,
    name: 'David Lee',
    email: 'david.l@example.com',
    role: 'Nutritionist',
    avatar: '/images/avatars/user-4.jpg',
    lastActive: 'Just now',
    currentPage: 'Nutrition Plans',
  },
  {
    id: 5,
    name: 'Jessica Martinez',
    email: 'jessica.m@example.com',
    role: 'Client',
    avatar: '/images/avatars/user-5.jpg',
    lastActive: '10 minutes ago',
    currentPage: 'Profile Settings',
  },
];

export function AdminActiveUsers() {
  // In a real app, we would fetch this data from an API
  const [users] = useState(activeUsers);

  // Function to get color based on user role
  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'client':
        return 'text-blue-600';
      case 'trainer':
        return 'text-green-600';
      case 'nutritionist':
        return 'text-purple-600';
      case 'admin':
        return 'text-red-600';
      default:
        return 'text-neutral-600';
    }
  };

  return (
    <div className="space-y-4">
      {users.map((user) => (
        <div key={user.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
          <div className="flex items-center">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
            </Avatar>
            <div className="ml-3">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <div className="text-right">
            <p className={`text-xs font-medium ${getRoleColor(user.role)}`}>{user.role}</p>
            <p className="text-xs text-muted-foreground">{user.lastActive}</p>
          </div>
        </div>
      ))}
    </div>
  );
}