'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Play, 
  Clock, 
  BarChart, 
  Calendar, 
  CheckCircle2, 
  Circle, 
  ArrowRight 
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

// Sample user programs data
const userPrograms = [
  {
    id: 1,
    title: 'Total Body Transformation',
    image: '/images/programs/program-1.jpg',
    sessionsCompleted: 8,
    totalSessions: 24,
    lastSession: {
      id: 8,
      title: 'Full Body HIIT',
      completedDate: '2025-03-15T10:30:00',
      duration: 35,
    },
    nextSession: {
      id: 9,
      title: 'Lower Body Strength',
      scheduledDate: '2025-03-18T11:00:00',
      duration: 45,
    },
    purchaseDate: '2025-02-15T08:45:00',
    expiryDate: '2025-05-15T08:45:00',
    status: 'active',
  },
  {
    id: 2,
    title: 'Yoga Flow & Flexibility',
    image: '/images/programs/program-3.jpg',
    sessionsCompleted: 4,
    totalSessions: 18,
    lastSession: {
      id: 4,
      title: 'Deep Stretch Yoga',
      completedDate: '2025-03-14T09:15:00',
      duration: 40,
    },
    nextSession: {
      id: 5,
      title: 'Balance & Core Flow',
      scheduledDate: '2025-03-17T09:00:00',
      duration: 40,
    },
    purchaseDate: '2025-03-01T14:20:00',
    expiryDate: '2025-06-01T14:20:00',
    status: 'active',
  },
  {
    id: 3,
    title: 'Core Strength Builder',
    image: '/images/programs/program-4.jpg',
    sessionsCompleted: 12,
    totalSessions: 12,
    lastSession: {
      id: 12,
      title: 'Advanced Core Integration',
      completedDate: '2025-02-28T16:45:00',
      duration: 30,
    },
    nextSession: null,
    purchaseDate: '2025-01-10T11:30:00',
    expiryDate: '2025-04-10T11:30:00',
    status: 'completed',
  },
];

export function UserPrograms() {
  const [activeTab, setActiveTab] = useState('active');
  
  // Filter programs based on active tab
  const filteredPrograms = userPrograms.filter(program => {
    if (activeTab === 'active') return program.status === 'active';
    if (activeTab === 'completed') return program.status === 'completed';
    return true; // "all" tab
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold tracking-tight">My Programs</h2>
        <Button asChild className="mt-2 sm:mt-0">
          <Link href="/programs">
            Browse More Programs
          </Link>
        </Button>
      </div>
      
      <Tabs defaultValue="active" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="mt-6">
          {filteredPrograms.length === 0 ? (
            <div className="text-center py-12 border rounded-lg bg-neutral-50">
              <h3 className="text-lg font-medium text-neutral-800 mb-2">
                No {activeTab} programs found
              </h3>
              <p className="text-neutral-600 mb-6">
                {activeTab === 'active' 
                  ? "You don't have any active programs at the moment." 
                  : activeTab === 'completed'
                  ? "You haven't completed any programs yet."
                  : "You don't have any programs. Start by browsing our collection."}
              </p>
              <Button asChild>
                <Link href="/programs">Browse Programs</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPrograms.map((program) => (
                <Card key={program.id} className="overflow-hidden">
                  <div className="aspect-[16/9] relative">
                    <Image 
                      src={program.image}
                      alt={program.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <h3 className="font-bold text-lg line-clamp-1">{program.title}</h3>
                      <div className="flex items-center justify-between">
                        <Badge
                          variant="outline"
                          className={`border-none ${
                            program.status === 'active' 
                              ? 'bg-green-500/20 text-green-100' 
                              : 'bg-blue-500/20 text-blue-100'
                          }`}
                        >
                          {program.status === 'active' ? 'In Progress' : 'Completed'}
                        </Badge>
                        <div className="text-xs">
                          {program.sessionsCompleted}/{program.totalSessions} Sessions
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <CardContent className="p-4">
                    <div className="mb-4">
                      <Progress 
                        value={(program.sessionsCompleted / program.totalSessions) * 100} 
                        className="h-2"
                      />
                      <p className="text-xs text-right mt-1 text-neutral-500">
                        {Math.round((program.sessionsCompleted / program.totalSessions) * 100)}% Complete
                      </p>
                    </div>
                    
                    {program.nextSession ? (
                      <div className="border rounded-md p-3 bg-neutral-50">
                        <p className="text-sm font-medium text-neutral-700">Next Session:</p>
                        <h4 className="font-medium">{program.nextSession.title}</h4>
                        <div className="mt-2 flex items-center justify-between text-xs text-neutral-500">
                          <div className="flex items-center">
                            <Calendar className="h-3.5 w-3.5 mr-1" />
                            <span>{formatDate(program.nextSession.scheduledDate)}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-3.5 w-3.5 mr-1" />
                            <span>{program.nextSession.duration} min</span>
                          </div>
                        </div>
                        <Button 
                          asChild 
                          variant="outline" 
                          className="w-full mt-2 hover:bg-primary hover:text-white"
                        >
                          <Link href={`/my-programs/${program.id}/session/${program.nextSession.id}`}>
                            <Play className="h-4 w-4 mr-2" /> Start Session
                          </Link>
                        </Button>
                      </div>
                    ) : program.status === 'completed' ? (
                      <div className="border rounded-md p-3 bg-green-50">
                        <div className="flex items-center mb-2">
                          <CheckCircle2 className="h-5 w-5 text-green-600 mr-2" />
                          <p className="font-medium text-green-800">Program Completed</p>
                        </div>
                        <p className="text-sm text-green-700">
                          Congratulations on completing this program!
                        </p>
                      </div>
                    ) : (
                      <div className="border rounded-md p-3 bg-neutral-50">
                        <p className="text-sm text-neutral-600">
                          No upcoming sessions scheduled.
                        </p>
                      </div>
                    )}
                  </CardContent>
                  
                  <CardFooter className="px-4 py-3 bg-neutral-50 flex justify-between">
                    <div className="text-xs text-neutral-500">
                      Expires: {formatDate(program.expiryDate)}
                    </div>
                    <Button
                      asChild
                      variant="ghost"
                      size="sm"
                      className="text-xs h-7 px-2 text-primary"
                    >
                      <Link href={`/my-programs/${program.id}`}>
                        View Program <ArrowRight className="ml-1 h-3 w-3" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}