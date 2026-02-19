'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Trash2, FolderTree } from 'lucide-react';
import { useState } from 'react';
import { ManagePageSkeleton } from '@/components/Skeletons';

export default function CategoriesDashboard() {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    const { data: categories, isLoading } = useQuery({
        queryKey: ['categories-dashboard'],
        queryFn: async () => {
            const res = await api.get('/categories');
            return res.data;
        }
    });

    const createCategoryMutation = useMutation({
        mutationFn: async (newCategory: { name: string; description: string }) => {
            return api.post('/categories', newCategory);
        },
        onSuccess: () => {
             queryClient.invalidateQueries({ queryKey: ['categories-dashboard'] });
             toast.success('Category created');
             setName('');
             setDescription('');
             setIsCreating(false);
        },
        onError: (error: any) => {
             toast.error(error.response?.data?.message || 'Failed to create category');
        }
    });
    
    // Note: Backend might not have delete category route implemented or exposed for this role
    // Assuming only create and list for now as per requirements "Add categories"
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createCategoryMutation.mutate({ name, description });
    };

    if (isLoading) return <ManagePageSkeleton cols={3} />;
    if (user?.role !== 'admin') return <div className="text-red-500">Access Denied</div>;

    return (
        <div className="space-y-6">
            {/* Gradient page header */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 p-6 text-white shadow-xl shadow-amber-300/30 dark:shadow-amber-900/40">
                <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full bg-white/10 blur-3xl pointer-events-none" />
                <div className="relative flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="bg-white/20 p-2.5 rounded-xl"><FolderTree size={20} /></div>
                        <div>
                            <h1 className="text-2xl font-extrabold tracking-tight">Manage Categories</h1>
                            <p className="text-amber-100 text-sm mt-0.5">{categories?.length ?? 0} categories</p>
                        </div>
                    </div>
                    <Button
                        onClick={() => setIsCreating(!isCreating)}
                        className="bg-white text-amber-700 hover:bg-amber-50 font-semibold shadow-md hover:-translate-y-0.5 transition-all duration-200 rounded-xl"
                    >
                        {isCreating ? 'Cancel' : 'Add New Category'}
                    </Button>
                </div>
            </div>

            {isCreating && (
                <Card>
                    <CardHeader>
                        <CardTitle>Create Category</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input 
                                    id="name" 
                                    value={name} 
                                    onChange={(e) => setName(e.target.value)} 
                                    required 
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Input 
                                    id="description" 
                                    value={description} 
                                    onChange={(e) => setDescription(e.target.value)} 
                                />
                            </div>
                            <Button type="submit" disabled={createCategoryMutation.isPending}>
                                {createCategoryMutation.isPending ? 'Creating...' : 'Create'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            )}

            <div className="bg-white dark:bg-gray-950 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gradient-to-r from-gray-50 to-amber-50/40 dark:from-gray-800/60 dark:to-amber-950/20 border-b border-gray-100 dark:border-gray-800">
                            <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Name</TableHead>
                            <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Description</TableHead>
                            <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Slug</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {categories?.map((category: any) => (
                            <TableRow key={category._id}>
                                <TableCell className="font-medium">{category.name}</TableCell>
                                <TableCell>{category.description}</TableCell>
                                <TableCell>{category.slug}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {categories?.length === 0 && (
                     <div className="p-4 text-center text-gray-500">No categories found.</div>
                )}
            </div>
        </div>
    );
}
