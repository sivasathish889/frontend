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
import { Trash2 } from 'lucide-react';
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
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Manage Categories</h1>
                 <Button onClick={() => setIsCreating(!isCreating)}>
                     {isCreating ? 'Cancel' : 'Add New Category'}
                 </Button>
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

            <div className="bg-white rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Slug</TableHead>
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
