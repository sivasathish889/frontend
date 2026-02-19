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
import { useState } from 'react';
import { ManagePageSkeleton } from '@/components/Skeletons';

export default function TagsDashboard() {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [name, setName] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    const { data: tags, isLoading } = useQuery({
        queryKey: ['tags-dashboard'],
        queryFn: async () => {
            const res = await api.get('/tags');
            return res.data;
        }
    });

    const createTagMutation = useMutation({
        mutationFn: async (newTag: { name: string }) => {
            return api.post('/tags', newTag);
        },
        onSuccess: () => {
             queryClient.invalidateQueries({ queryKey: ['tags-dashboard'] });
             toast.success('Tag created');
             setName('');
             setIsCreating(false);
        },
        onError: (error: any) => {
             toast.error(error.response?.data?.message || 'Failed to create tag');
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createTagMutation.mutate({ name });
    };

    if (isLoading) return <ManagePageSkeleton cols={2} />;
    if (user?.role !== 'admin') return <div className="text-red-500">Access Denied</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Manage Tags</h1>
                 <Button onClick={() => setIsCreating(!isCreating)}>
                     {isCreating ? 'Cancel' : 'Add New Tag'}
                 </Button>
            </div>

            {isCreating && (
                <Card>
                    <CardHeader>
                        <CardTitle>Create Tag</CardTitle>
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
                            <Button type="submit" disabled={createTagMutation.isPending}>
                                {createTagMutation.isPending ? 'Creating...' : 'Create'}
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
                            <TableHead>Slug</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {tags?.map((tag: any) => (
                            <TableRow key={tag._id}>
                                <TableCell className="font-medium">{tag.name}</TableCell>
                                <TableCell>{tag.slug}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {tags?.length === 0 && (
                     <div className="p-4 text-center text-gray-500">No tags found.</div>
                )}
            </div>
        </div>
    );
}
