'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { toast } from 'sonner';
import { Pencil, Trash2, PlusCircle, FileText } from 'lucide-react';
import { ManagePageSkeleton } from '@/components/Skeletons';

export default function PostsDashboard() {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: ['posts-dashboard'],
        queryFn: async () => {
            const res = await api.get('/posts');
            return res.data;
        }
    });

    const deletePostMutation = useMutation({
        mutationFn: async (id: string) => api.delete(`/posts/${id}`),
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
            {/* ── Gradient page header ── */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 p-6 text-white shadow-xl shadow-indigo-300/30 dark:shadow-indigo-900/40">
                <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full bg-white/10 blur-3xl pointer-events-none" />
                <div className="relative flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="bg-white/20 p-2.5 rounded-xl">
                            <FileText size={20} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-extrabold tracking-tight">Manage Posts</h1>
                            <p className="text-blue-200 text-sm mt-0.5">
                                {data?.posts?.length ?? 0} post{data?.posts?.length !== 1 ? 's' : ''} total
                            </p>
                        </div>
                    </div>
                    <Link href="/dashboard/create-post">
                        <Button className="bg-white text-indigo-700 hover:bg-indigo-50 font-semibold shadow-md hover:-translate-y-0.5 transition-all duration-200 rounded-xl gap-2">
                            <PlusCircle size={16} />
                            New Post
                        </Button>
                    </Link>
                </div>
            </div>

            {/* ── Table card ── */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gradient-to-r from-gray-50 to-indigo-50/40 dark:from-gray-800/60 dark:to-indigo-950/30 border-b border-gray-100 dark:border-gray-800">
                            <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Title</TableHead>
                            <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Author</TableHead>
                            <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Category</TableHead>
                            <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Status</TableHead>
                            <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Created At</TableHead>
                            <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data?.posts?.map((post: any) => (
                            <TableRow
                                key={post._id}
                                className="hover:bg-indigo-50/40 dark:hover:bg-indigo-950/20 transition-colors"
                            >
                                <TableCell className="font-medium text-gray-900 dark:text-white max-w-[180px] truncate">
                                    {post.title}
                                </TableCell>
                                <TableCell className="text-gray-600 dark:text-gray-400">{post.author?.name}</TableCell>
                                <TableCell>
                                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
                                        {post.category?.name || 'Uncategorized'}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        className={
                                            post.status === 'published'
                                                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0 shadow-sm'
                                                : 'bg-gradient-to-r from-gray-400 to-gray-500 text-white border-0 shadow-sm'
                                        }
                                    >
                                        {post.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-gray-500 dark:text-gray-400 text-sm">
                                    {new Date(post.createdAt).toLocaleDateString()}
                                </TableCell>
                                <TableCell>
                                    {(user?.role === 'admin' || user?._id === post.author?._id) && (
                                        <div className="flex gap-1">
                                            <Link href={`/dashboard/posts/edit/${post._id}`}>
                                                <Button size="icon" variant="ghost" className="h-8 w-8 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 rounded-lg">
                                                    <Pencil size={14} />
                                                </Button>
                                            </Link>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                                                onClick={() => {
                                                    if (confirm('Are you sure you want to delete this post?')) {
                                                        deletePostMutation.mutate(post._id);
                                                    }
                                                }}
                                            >
                                                <Trash2 size={14} />
                                            </Button>
                                        </div>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {data?.posts?.length === 0 && (
                    <div className="py-16 text-center text-gray-400 dark:text-gray-600">
                        <FileText size={36} className="mx-auto mb-3 opacity-30" />
                        No posts found.
                    </div>
                )}
            </div>
        </div>
    );
}
