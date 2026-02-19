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
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { toast } from 'sonner';
import { Pencil, Trash2 } from 'lucide-react';
import { ManagePageSkeleton } from '@/components/Skeletons';

export default function PostsDashboard() {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: ['posts-dashboard'],
        queryFn: async () => {
             // Admin sees all, Editor sees all but only acts on theirs
            const res = await api.get('/posts');
             // Backend paging might be an issue if we want ALL posts for admin management without pagination
             // For now assume the main getPosts returns paginated, so maybe we need a param to get all or handle pagination here
             // Let's just use what we have, it returns page 1 by default
            return res.data;
        }
    });

    const deletePostMutation = useMutation({
        mutationFn: async (id: string) => {
            return api.delete(`/posts/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['posts-dashboard'] });
            toast.success('Post deleted successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to delete post');
        }
    });

    if (isLoading) return <ManagePageSkeleton cols={6} />;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Manage Posts</h1>
                 <Link href="/dashboard/create-post">
                    <Button>Create New Post</Button>
                </Link>
            </div>

            <div className="bg-white rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Author</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Created At</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data?.posts?.map((post: any) => (
                            <TableRow key={post._id}>
                                <TableCell className="font-medium">{post.title}</TableCell>
                                <TableCell>{post.author?.name}</TableCell>
                                <TableCell>{post.category?.name || 'Uncategorized'}</TableCell>
                                <TableCell>
                                    <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>
                                        {post.status}
                                    </Badge>
                                </TableCell>
                                <TableCell>{new Date(post.createdAt).toLocaleDateString()}</TableCell>
                                <TableCell className="flex gap-2">
                                    {(user?.role === 'admin' || user?._id === post.author?._id) && (
                                        <>
                                            <Link href={`/dashboard/posts/edit/${post._id}`}>
                                                <Button size="icon" variant="ghost">
                                                    <Pencil size={16} />
                                                </Button>
                                            </Link>
                                            <Button 
                                                size="icon" 
                                                variant="ghost" 
                                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                onClick={() => {
                                                    if(confirm('Are you sure you want to delete this post?')) {
                                                        deletePostMutation.mutate(post._id);
                                                    }
                                                }}
                                            >
                                                <Trash2 size={16} />
                                            </Button>
                                        </>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {data?.posts?.length === 0 && (
                     <div className="p-4 text-center text-gray-500">No posts found.</div>
                )}
            </div>
            {/* Implement Pagination Controls if needed */}
        </div>
    );
}
