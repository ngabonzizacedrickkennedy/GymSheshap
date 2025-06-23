'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Dumbbell, 
  Utensils, 
  User, 
  Users,
  ShoppingBag, 
  Heart, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  FilePlus,
  Package,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AnimatePresence, motion } from 'framer-motion';

const userNavigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'My Programs', href: '/my-programs', icon: Dumbbell },
  { name: 'My Nutrition', href: '/my-nutrition', icon: Utensils },
  { name: 'Profile', href: '/profile', icon: User },
  { name: 'Orders', href: '/orders', icon: ShoppingBag },
  { name: 'Favorites', href: '/favorites', icon: Heart },
  { name: 'Settings', href: '/settings', icon: Settings },
];

const trainerNavigation = [
  ...userNavigation,
  { name: 'My Clients', href: '/my-clients', icon: Users },
  { name: 'Create Program', href: '/create-program', icon: FilePlus },
];

const nutritionistNavigation = [
  ...userNavigation,
  { name: 'My Clients', href: '/my-clients', icon: Users },
  { name: 'Create Plan', href: '/create-plan', icon: FilePlus },
];

const adminNavigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Programs', href: '/admin/programs', icon: Dumbbell },
  { name: 'Nutrition Plans', href: '/admin/nutrition', icon: Utensils },
  { name: 'Products', href: '/admin/products', icon: Package },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
  { name: 'Blog', href: '/admin/blog', icon: FileText },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const { user } = useAuth();
  const [isMobile, setIsMobile] = useState(false);

  // Set navigation based on user role
  const navigation = 
    user?.role === 'ADMIN' ? adminNavigation :
    user?.role === 'TRAINER' ? trainerNavigation :
    user?.role === 'NUTRITIONIST' ? nutritionistNavigation :
    userNavigation;

  // Check if we're on mobile
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Collapse sidebar by default on mobile
  useEffect(() => {
    setCollapsed(isMobile);
  }, [isMobile]);

  return (
    <>
      {/* Mobile overlay when sidebar is open */}
      {isMobile && !collapsed && (
        <div 
          className="fixed inset-0 bg-black/50 z-30"
          onClick={() => setCollapsed(true)}
        />
      )}

      <AnimatePresence initial={false}>
        <motion.aside
          className={cn(
            "fixed md:relative z-40 h-full flex flex-col border-r bg-white transition-all duration-300",
            collapsed ? "w-16" : "w-64"
          )}
          initial={false}
          animate={{
            width: collapsed ? 64 : 256,
            x: isMobile && collapsed ? -64 : 0
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          {/* Logo and collapse button */}
          <div className="flex items-center justify-between p-4 border-b">
            <Link href="/" className="flex items-center space-x-2">
              <div className="relative w-8 h-8">
                <Image
                  src="/logo.svg"
                  alt="SheShape Logo"
                  fill
                  className="object-contain"
                />
              </div>
              {!collapsed && (
                <span className="font-cursive text-xl text-primary">SheShape</span>
              )}
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCollapsed(!collapsed)}
              className="md:flex hidden"
            >
              {collapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Navigation items */}
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1 px-2">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      pathname === item.href
                        ? "bg-primary/10 text-primary"
                        : "text-neutral-700 hover:bg-neutral-100 hover:text-primary"
                    )}
                  >
                    <item.icon
                      className={cn("h-5 w-5", 
                        collapsed ? "mx-auto" : "mr-3"
                      )}
                    />
                    {!collapsed && <span>{item.name}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* User profile shortcut */}
          <div className="border-t p-3">
            <Link
              href="/profile"
              className="flex items-center rounded-md px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100 hover:text-primary transition-colors"
            >
              <div className="relative h-8 w-8 rounded-full bg-neutral-200 overflow-hidden">
                {user?.profile?.profileImage ? (
                  <Image
                    src={user.profile.profileImage}
                    alt={user.username}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <User className="h-5 w-5 absolute inset-1.5" />
                )}
              </div>
              {!collapsed && (
                <div className="ml-3 truncate">
                  <p className="truncate font-medium">
                    {user?.profile?.firstName
                      ? `${user.profile.firstName} ${user.profile.lastName || ''}`
                      : user?.username}
                  </p>
                  <p className="text-xs text-neutral-500 truncate">
                    {user?.email}
                  </p>
                </div>
              )}
            </Link>
          </div>
        </motion.aside>
      </AnimatePresence>
    </>
  );
}