'use client';
import { useState, useEffect } from 'react';
import { Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Plus, 
  Search, 
  Filter, 
  ArrowUpDown, 
  MoreHorizontal, 
  Edit, 
  Trash2,
  Eye,
  Check,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { api } from '@/lib/api';
import { toast } from 'react-toastify';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { formatDate } from '@/lib/utils';

// Define the program type based on backend API
interface GymProgram {
  id: number;
  title: string;
  description?: string;
  difficultyLevel: string;
  durationDays: number;
  price: number;
  isActive: boolean;
  trainerId: number;
  trainer?: {
    id: number;
    username: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export default function AdminProgramsPage() {
  // Use Suspense and client-side data fetching to avoid hydration mismatches
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <LoadingSpinner size="lg" />
      </div>
    }>
      <AdminProgramsContent />
    </Suspense>
  );
}

function AdminProgramsContent() {
  const [programs, setPrograms] = useState<GymProgram[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPrograms, setSelectedPrograms] = useState<number[]>([]);
  const [difficultyFilter, setDifficultyFilter] = useState<string>('');
  const [sortField, setSortField] = useState<string>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  const router = useRouter();

  // Function to fetch programs from the API
  const fetchPrograms = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await api.get('/api/gym/programs/all');
      setPrograms(response.data);
    } catch (err) {
      console.error('Error fetching programs:', err);
      setError('Failed to fetch programs. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch programs on initial load
  useEffect(() => {
    fetchPrograms();
  }, []);

  // Handle program activation/deactivation
  const toggleProgramStatus = async (programId: number, currentStatus: boolean) => {
    try {
      // Find the program
      const program = programs.find(p => p.id === programId);
      if (!program) return;
      
      // Update the status in the API
      await api.put(`/api/gym/programs/${programId}`, {
        ...program,
        isActive: !currentStatus
      });
      
      // Update local state
      setPrograms(programs.map(p => 
        p.id === programId ? { ...p, isActive: !currentStatus } : p
      ));
      
      toast.success(`Program ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
    } catch (err) {
      console.error('Error updating program status:', err);
      toast.error('Failed to update program status');
    }
  };

  // Handle program deletion
  const deleteProgram = async (programId: number) => {
    if (!confirm('Are you sure you want to delete this program? This action cannot be undone.')) {
      return;
    }
    
    try {
      await api.delete(`/api/gym/programs/${programId}`);
      
      // Remove from local state
      setPrograms(programs.filter(p => p.id !== programId));
      
      toast.success('Program deleted successfully');
    } catch (err) {
      console.error('Error deleting program:', err);
      toast.error('Failed to delete program. It may have active users.');
    }
  };

  // Handle bulk actions
  const handleBulkAction = async (action: 'activate' | 'deactivate' | 'delete') => {
    if (selectedPrograms.length === 0) {
      toast.info('No programs selected');
      return;
    }
    
    if (action === 'delete' && !confirm(`Are you sure you want to delete ${selectedPrograms.length} programs? This action cannot be undone.`)) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (action === 'delete') {
        // Delete each selected program
        await Promise.all(selectedPrograms.map(id => api.delete(`/api/gym/programs/${id}`)));
        setPrograms(programs.filter(p => !selectedPrograms.includes(p.id)));
        toast.success(`${selectedPrograms.length} programs deleted successfully`);
      } else {
        // Activate/deactivate programs
        const isActive = action === 'activate';
        await Promise.all(
          selectedPrograms.map(id => {
            const program = programs.find(p => p.id === id);
            if (!program) return Promise.resolve();
            
            return api.put(`/api/gym/programs/${id}`, {
              ...program,
              isActive
            });
          })
        );
        
        // Update local state
        setPrograms(programs.map(p => 
          selectedPrograms.includes(p.id) ? { ...p, isActive } : p
        ));
        
        toast.success(`${selectedPrograms.length} programs ${isActive ? 'activated' : 'deactivated'} successfully`);
      }
      
      // Clear selection
      setSelectedPrograms([]);
    } catch (err) {
      console.error(`Error performing bulk ${action}:`, err);
      toast.error(`Failed to ${action} some programs`);
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle all programs selection
  const toggleSelectAll = () => {
    if (selectedPrograms.length === filteredPrograms.length) {
      setSelectedPrograms([]);
    } else {
      setSelectedPrograms(filteredPrograms.map(p => p.id));
    }
  };

  // Toggle single program selection
  const toggleSelectProgram = (programId: number) => {
    if (selectedPrograms.includes(programId)) {
      setSelectedPrograms(selectedPrograms.filter(id => id !== programId));
    } else {
      setSelectedPrograms([...selectedPrograms, programId]);
    }
  };

  // Filter and sort the programs
  const filteredPrograms = programs
    .filter(program => {
      const matchesSearch = searchQuery === '' || 
        program.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        program.description?.toLowerCase().includes(searchQuery.toLowerCase());
      
        const matchesDifficulty = difficultyFilter === 'all' || difficultyFilter === '' || 
        program.difficultyLevel === difficultyFilter;
      
      return matchesSearch && matchesDifficulty;
    })
    .sort((a, b) => {
      // Handle different sort fields
      if (sortField === 'price') {
        return sortDirection === 'asc' ? a.price - b.price : b.price - a.price;
      }
      if (sortField === 'title') {
        return sortDirection === 'asc' 
          ? a.title.localeCompare(b.title) 
          : b.title.localeCompare(a.title);
      }
      if (sortField === 'durationDays') {
        return sortDirection === 'asc' 
          ? a.durationDays - b.durationDays 
          : b.durationDays - a.durationDays;
      }
      
      // Default sort by date
      return sortDirection === 'asc' 
        ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  // Sort handler
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  if (isLoading && programs.length === 0) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Gym Programs</h2>
          <p className="text-muted-foreground">
            Manage workout programs for your users
          </p>
        </div>
        <Button onClick={() => router.push('/admin/programs/create')} className="mt-4 sm:mt-0">
          <Plus className="mr-2 h-4 w-4" /> Add New Program
        </Button>
      </div>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-600">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Filters and bulk actions */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search programs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-2">
              <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Difficulties</SelectItem>
                  <SelectItem value="BEGINNER">Beginner</SelectItem>
                  <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                  <SelectItem value="ADVANCED">Advanced</SelectItem>
                </SelectContent>
              </Select>
              
              {/* Bulk actions - only show when items are selected */}
              {selectedPrograms.length > 0 && (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleBulkAction('activate')}>
                    <Check className="mr-2 h-4 w-4" /> Activate
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleBulkAction('deactivate')}>
                    <X className="mr-2 h-4 w-4" /> Deactivate
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleBulkAction('delete')}>
                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Programs Table */}
      <Card>
        <CardContent className="p-0">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox 
                      checked={selectedPrograms.length === filteredPrograms.length && filteredPrograms.length > 0}
                      onCheckedChange={toggleSelectAll}
                      aria-label="Select all programs"
                    />
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => handleSort('title')}
                  >
                    Title <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                  </TableHead>
                  <TableHead>Difficulty</TableHead>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => handleSort('durationDays')}
                  >
                    Duration <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer text-right"
                    onClick={() => handleSort('price')}
                  >
                    Price <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => handleSort('createdAt')}
                  >
                    Created <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPrograms.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      No programs found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPrograms.map((program) => (
                    <TableRow key={program.id}>
                      <TableCell>
                        <Checkbox 
                          checked={selectedPrograms.includes(program.id)}
                          onCheckedChange={() => toggleSelectProgram(program.id)}
                          aria-label={`Select ${program.title}`}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{program.title}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={
                          program.difficultyLevel === 'BEGINNER' ? 'border-green-500 text-green-700 bg-green-50' :
                          program.difficultyLevel === 'INTERMEDIATE' ? 'border-yellow-500 text-yellow-700 bg-yellow-50' :
                          'border-red-500 text-red-700 bg-red-50'
                        }>
                          {program.difficultyLevel.charAt(0) + program.difficultyLevel.slice(1).toLowerCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>{program.durationDays} days</TableCell>
                      <TableCell className="text-right">${program.price.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant={program.isActive ? 'default' : 'secondary'}>
                          {program.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(program.createdAt)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => router.push(`/admin/programs/view/${program.id}`)}>
                              <Eye className="mr-2 h-4 w-4" />
                              <span>View Details</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push(`/admin/programs/edit/${program.id}`)}>
                              <Edit className="mr-2 h-4 w-4" />
                              <span>Edit</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => toggleProgramStatus(program.id, program.isActive)}
                            >
                              {program.isActive ? (
                                <>
                                  <X className="mr-2 h-4 w-4" />
                                  <span>Deactivate</span>
                                </>
                              ) : (
                                <>
                                  <Check className="mr-2 h-4 w-4" />
                                  <span>Activate</span>
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => deleteProgram(program.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              <span>Delete</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}