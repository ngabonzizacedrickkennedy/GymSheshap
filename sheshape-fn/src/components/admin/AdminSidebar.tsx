'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Users, 
  Dumbbell, 
  Utensils, 
  Package, 
  ShoppingBag, 
  FileText, 
  Settings, 
  BarChart, 
  ChevronLeft, 
  ChevronRight,
  UserCog,
  ShieldAlert,
  Home
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AnimatePresence, motion } from 'framer-motion';

const adminNavigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Programs', href: '/admin/programs', icon: Dumbbell },
  { name: 'Nutrition Plans', href: '/admin/nutrition', icon: Utensils },
  { name: 'Products', href: '/admin/products', icon: Package },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
  { name: 'Blog', href: '/admin/blog', icon: FileText },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const { user } = useAuth();
  const [isMobile, setIsMobile] = useState(false);

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
            <Link href="/admin" className="flex items-center space-x-2">
              <div className="relative w-8 h-8">
                <Image
                  src="/logo.svg"
                  alt="SheShape Logo"
                  fill
                  className="object-contain"
                />
              </div>
              {!collapsed && (
                <div className="flex flex-col">
                  <span className="font-cursive text-lg text-primary">SheShape</span>
                  <span className="text-xs text-neutral-500">Admin Portal</span>
                </div>
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
              {/* Back to main site link */}
              <li>
                <Link
                  href="/"
                  className={cn(
                    "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    "text-neutral-700 hover:bg-neutral-100 hover:text-primary"
                  )}
                >
                  <Home
                    className={cn("h-5 w-5", 
                      collapsed ? "mx-auto" : "mr-3"
                    )}
                  />
                  {!collapsed && <span>Main Website</span>}
                </Link>
              </li>
              
              {/* Admin navigation */}
              <li className="pt-3 pb-1">
                {!collapsed && (
                  <p className="px-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                    Admin
                  </p>
                )}
                {collapsed && <hr className="mx-2 my-2" />}
              </li>
              {adminNavigation.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      pathname === item.href || pathname.startsWith(`${item.href}/`)
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
              
              {/* Admin tools section */}
              <li className="pt-3 pb-1">
                {!collapsed && (
                  <p className="px-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                    Tools
                  </p>
                )}
                {collapsed && <hr className="mx-2 my-2" />}
              </li>
              <li>
                <Link
                  href="/admin/permissions"
                  className={cn(
                    "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    pathname === "/admin/permissions"
                      ? "bg-primary/10 text-primary"
                      : "text-neutral-700 hover:bg-neutral-100 hover:text-primary"
                  )}
                >
                  <ShieldAlert
                    className={cn("h-5 w-5", 
                      collapsed ? "mx-auto" : "mr-3"
                    )}
                  />
                  {!collapsed && <span>Permissions</span>}
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/user-management"
                  className={cn(
                    "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    pathname === "/admin/user-management"
                      ? "bg-primary/10 text-primary"
                      : "text-neutral-700 hover:bg-neutral-100 hover:text-primary"
                  )}
                >
                  <UserCog
                    className={cn("h-5 w-5", 
                      collapsed ? "mx-auto" : "mr-3"
                    )}
                  />
                  {!collapsed && <span>User Management</span>}
                </Link>
              </li>
            </ul>
          </nav>

          {/* Admin info */}
          <div className="border-t p-3">
            <div className="flex items-center rounded-md px-3 py-2">
              <div className="relative h-8 w-8 rounded-full bg-primary/10 overflow-hidden">
                {user?.profile?.profileImage ? (
                  <Image
                    src={user.profile.profileImage}
                    alt={user.username}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <UserCog className="h-5 w-5 text-primary absolute inset-1.5" />
                )}
              </div>
              {!collapsed && (
                <div className="ml-3 truncate">
                  <p className="truncate font-medium text-sm">
                    {user?.profile?.firstName
                      ? `${user.profile.firstName} ${user.profile.lastName || ''}`
                      : user?.username}
                  </p>
                  <p className="text-xs text-neutral-500 truncate">
                    Administrator
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.aside>
      </AnimatePresence>
    </>
  )
}