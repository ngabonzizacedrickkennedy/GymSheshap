// src/components/admin/programs/UsersList.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Users, User, MoreHorizontal, Eye, Ban, CheckCircle } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'react-toastify';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { formatDate, getInitials } from '@/lib/utils';

// User program interface
interface UserGymProgram {
  id: number;
  userId: number;
  programId: number;
  purchaseDate: string;
  expiryDate: string;
  lastWatchedSessionId?: number;
  status: string;
  user?: {
    id: number;
    username: string;
    email: string;
    profile?: {
      firstName?: string;
      lastName?: string;
      profileImage?: string;
    }
  }
}

interface UsersListProps {
  programId: number;
}

export function UsersList({ programId }: UsersListProps) {
  const [users, setUsers] = useState<UserGymProgram[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const response = await api.get(`/api/gym/programs/${programId}/users`);
        setUsers(response.data);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to load enrolled users');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [programId]);

  // Update user status
  const updateUserStatus = async (userId: number, status: string) => {
    try {
      await api.put(`/api/gym/users/${userId}/programs/${programId}/status?status=${status}`);
      
      // Update local state
      setUsers(users.map(u => 
        u.userId === userId ? { ...u, status } : u
      ));
      
      toast.success(`User status updated to ${status.toLowerCase()}`);
    } catch (err) {
      console.error('Error updating user status:', err);
      toast.error('Failed to update user status');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <LoadingSpinner size="md" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4 border rounded bg-red-50 text-red-600">
        {error}
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="text-center p-8 border rounded bg-neutral-50">
        <Users className="mx-auto h-8 w-8 text-neutral-400 mb-2" />
        <h4 className="font-medium mb-2">No Users Enrolled</h4>
        <p className="text-neutral-500">This program doesn't have any users enrolled yet.</p>
      </div>
    );
  }

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Purchase Date</TableHead>
            <TableHead>Expiry Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Progress</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((userProgram) => (
            <TableRow key={userProgram.id}>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage 
                      src={userProgram.user?.profile?.profileImage} 
                      alt={userProgram.user?.username} 
                    />
                    <AvatarFallback>
                      {getInitials(userProgram.user?.profile?.firstName && userProgram.user?.profile?.lastName 
                        ? `${userProgram.user.profile.firstName} ${userProgram.user.profile.lastName}`
                        : userProgram.user?.username || ''
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">
                      {userProgram.user?.profile?.firstName && userProgram.user?.profile?.lastName 
                        ? `${userProgram.user.profile.firstName} ${userProgram.user.profile.lastName}`
                        : userProgram.user?.username || 'Unknown'
                      }
                    </div>
                    <div className="text-sm text-neutral-500">{userProgram.user?.email}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>{formatDate(userProgram.purchaseDate)}</TableCell>
              <TableCell>{formatDate(userProgram.expiryDate)}</TableCell>
              <TableCell>
                <Badge variant="outline" className={
                  userProgram.status === 'ACTIVE' ? 'border-green-500 text-green-700 bg-green-50' :
                  userProgram.status === 'EXPIRED' ? 'border-yellow-500 text-yellow-700 bg-yellow-50' :
                  'border-red-500 text-red-700 bg-red-50'
                }>
                  {userProgram.status}
                </Badge>
              </TableCell>
              <TableCell>
                {userProgram.lastWatchedSessionId 
                  ? <span>Session {userProgram.lastWatchedSessionId}</span>
                  : <span className="text-neutral-400">Not started</span>
                }
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => router.push(`/admin/users/${userProgram.userId}`)}>
                      <Eye className="mr-2 h-4 w-4" />
                      <span>View User</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {userProgram.status !== 'ACTIVE' && (
                      <DropdownMenuItem onClick={() => updateUserStatus(userProgram.userId, 'ACTIVE')}>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        <span>Activate</span>
                      </DropdownMenuItem>
                    )}
                    {userProgram.status !== 'CANCELLED' && (
                      <DropdownMenuItem onClick={() => updateUserStatus(userProgram.userId, 'CANCELLED')}>
                        <Ban className="mr-2 h-4 w-4" />
                        <span>Cancel</span>
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}