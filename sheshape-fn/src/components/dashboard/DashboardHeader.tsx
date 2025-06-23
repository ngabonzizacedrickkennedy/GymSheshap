'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { 
  Bell, 
  Search, 
  ShoppingCart, 
  Menu, 
  X, 
  User, 
  LogOut,
  Settings,
  HelpCircle,
  Grid,
  LayoutDashboard
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

export function DashboardHeader() {
  const [searchQuery, setSearchQuery] = useState('');
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { totalItems, toggleCart } = useCart();
  
  // Check if the user is an admin
  const isAdmin = user?.role === 'ADMIN';
  
  // Utility to get page title from pathname
  const getPageTitle = () => {
    // Handle special cases
    if (pathname === '/dashboard') return 'Dashboard';
    if (pathname === '/admin') return 'Admin Dashboard';
    
    // For paths like /admin/users, /my-programs, etc.
    const parts = pathname.split('/');
    const lastPart = parts[parts.length - 1];
    
    // Convert kebab-case to Title Case and remove hyphens
    return lastPart
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <header className="border-b bg-white p-4">
      <div className="flex items-center justify-between">
        {/* Page title */}
        <h1 className="text-xl font-semibold text-neutral-900 hidden md:block">
          {getPageTitle()}
        </h1>
        
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
              placeholder="Search..."
              className="pl-10 bg-neutral-50 border-neutral-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {/* Cart button */}
          <button
            onClick={toggleCart}
            className="relative p-2 text-neutral-600 hover:text-primary rounded-full hover:bg-neutral-100"
            aria-label="Shopping Cart"
          >
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-primary rounded-full">
                {totalItems}
              </span>
            )}
          </button>
          
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="relative p-2 text-neutral-600 hover:text-primary rounded-full hover:bg-neutral-100"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-accent1 rounded-full">
                  3
                </span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {/* Notification items would go here */}
              <div className="py-2 px-3">
                <div className="mb-2 last:mb-0">
                  <p className="text-sm font-medium">New workout program available</p>
                  <p className="text-xs text-neutral-500">10 minutes ago</p>
                </div>
                <div className="mb-2 last:mb-0">
                  <p className="text-sm font-medium">Your order has been shipped</p>
                  <p className="text-xs text-neutral-500">2 hours ago</p>
                </div>
                <div className="mb-2 last:mb-0">
                  <p className="text-sm font-medium">Reminder: Yoga session tomorrow</p>
                  <p className="text-xs text-neutral-500">1 day ago</p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/notifications" className="w-full cursor-pointer text-center text-primary">
                  View all notifications
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Quick actions */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="p-2 text-neutral-600 hover:text-primary rounded-full hover:bg-neutral-100"
                aria-label="Quick actions"
              >
                <Grid className="h-5 w-5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link href="/shop" className="flex items-center">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  <span>Shop</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/settings" className="flex items-center">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/help" className="flex items-center">
                  <HelpCircle className="mr-2 h-4 w-4" />
                  <span>Help Center</span>
                </Link>
              </DropdownMenuItem>
              {isAdmin && (
                <DropdownMenuItem>
                  <Link href="/admin" className="flex items-center">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>Admin Portal</span>
                  </Link>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* User menu */}
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
                  <div className="h-9 w-9 rounded-full bg-neutral-200 flex items-center justify-center">
                    <User className="h-5 w-5 text-neutral-500" />
                  </div>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                {user?.profile?.firstName
                  ? `${user.profile.firstName} ${user.profile.lastName || ''}`
                  : user?.username}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
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