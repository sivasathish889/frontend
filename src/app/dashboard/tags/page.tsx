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
import { Tags as TagsIcon } from 'lucide-react';

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
            {/* Gradient page header */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-fuchsia-600 p-6 text-white shadow-xl shadow-rose-300/30 dark:shadow-rose-900/40">
                <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full bg-white/10 blur-3xl pointer-events-none" />
                <div className="relative flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="bg-white/20 p-2.5 rounded-xl"><TagsIcon size={20} /></div>
                        <div>
                            <h1 className="text-2xl font-extrabold tracking-tight">Manage Tags</h1>
                            <p className="text-rose-100 text-sm mt-0.5">{tags?.length ?? 0} tags</p>
                        </div>
                    </div>
                    <Button
                        onClick={() => setIsCreating(!isCreating)}
                        className="bg-white text-rose-700 hover:bg-rose-50 font-semibold shadow-md hover:-translate-y-0.5 transition-all duration-200 rounded-xl"
                    >
                        {isCreating ? 'Cancel' : 'Add New Tag'}
                    </Button>
                </div>
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

            <div className="bg-white dark:bg-gray-950 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gradient-to-r from-gray-50 to-rose-50/40 dark:from-gray-800/60 dark:to-rose-950/20 border-b border-gray-100 dark:border-gray-800">
                            <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Name</TableHead>
                            <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Slug</TableHead>
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
