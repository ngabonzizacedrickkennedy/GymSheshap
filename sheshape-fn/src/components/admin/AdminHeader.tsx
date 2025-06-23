'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { 
  Bell, 
  Search, 
  Menu, 
  User, 
  LogOut,
  Settings,
  HelpCircle,
  Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function AdminHeader() {
  const [searchQuery, setSearchQuery] = useState('');
  const pathname = usePathname();
  const { user, logout } = useAuth();
  
  // Utility to get page title from pathname
  const getPageTitle = () => {
    if (pathname === '/admin') return 'Admin Dashboard';
    
    // For paths like /admin/users, /admin/products, etc.
    const parts = pathname.split('/');
    if (parts.length > 2) {
      const section = parts[2];
      // Convert kebab-case to Title Case and remove hyphens
      return section
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }
    
    return 'Admin';
  };

  return (
    <header className="border-b bg-white p-4">
      <div className="flex items-center justify-between">
        {/* Page title */}
        <div className="flex items-center">
          <Shield className="h-5 w-5 text-primary mr-2" />
          <h1 className="text-xl font-semibold text-neutral-900">
            {getPageTitle()}
          </h1>
        </div>

        {/* Mobile menu button */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden"
          aria-label="Toggle mobile menu"
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Right side with search, notifications, etc. */}
        <div className="flex items-center space-x-4">
          {/* Search input */}
          <div className="relative hidden md:block max-w-md">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-4 w-4 text-neutral-400" />
            </div>
            <Input
              type="search"
              placeholder="Search users, products, orders..."
              className="pl-10 bg-neutral-50 border-neutral-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {/* Admin notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="relative p-2 text-neutral-600 hover:text-primary rounded-full hover:bg-neutral-100"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-primary rounded-full">
                  5
                </span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Admin Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {/* Notification items */}
              <div className="py-2 px-3">
                <div className="mb-3 last:mb-0">
                  <p className="text-sm font-medium">New user registration</p>
                  <p className="text-xs text-neutral-500">5 minutes ago</p>
                </div>
                <div className="mb-3 last:mb-0">
                  <p className="text-sm font-medium">New order #1234 received</p>
                  <p className="text-xs text-neutral-500">30 minutes ago</p>
                </div>
                <div className="mb-3 last:mb-0">
                  <p className="text-sm font-medium">Low stock alert: Resistance bands</p>
                  <p className="text-xs text-neutral-500">2 hours ago</p>
                </div>
                <div className="mb-3 last:mb-0">
                  <p className="text-sm font-medium">Payment failed for order #1230</p>
                  <p className="text-xs text-neutral-500">Yesterday</p>
                </div>
                <div className="mb-3 last:mb-0">
                  <p className="text-sm font-medium">System update scheduled</p>
                  <p className="text-xs text-neutral-500">2 days ago</p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/admin/notifications" className="w-full cursor-pointer text-center text-primary">
                  View all notifications
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Admin menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="relative h-9 w-9 rounded-full">
                {user?.profile?.profileImage ? (
                  <Image
                    src={user.profile.profileImage}
                    alt={user.username}
                    fill
                    className="rounded-full object-cover"
                  />
                ) : (
                  <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="flex flex-col">
                <span>
                  {user?.profile?.firstName
                    ? `${user.profile.firstName} ${user.profile.lastName || ''}`
                    : user?.username}
                </span>
                <span className="text-xs font-normal text-neutral-500">
                  Administrator
                </span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard">
                  <User className="mr-2 h-4 w-4" />
                  <span>User Dashboard</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/admin/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Admin Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/admin/help">
                  <HelpCircle className="mr-2 h-4 w-4" />
                  <span>Admin Help</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}