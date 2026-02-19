'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { Trash2 } from 'lucide-react';

interface Comment {
    _id: string;
    content: string;
    user: { _id: string; name: string };
    createdAt: string;
}

export default function CommentsSection({ postId }: { postId: string }) {
    const { user } = useAuth();
    const [content, setContent] = useState('');
    const queryClient = useQueryClient();

    const { data: comments, isLoading } = useQuery({
        queryKey: ['comments', postId],
        queryFn: async () => {
            const res = await api.get(`/comments/${postId}`);
            return res.data;
        }
    });

    const addCommentMutation = useMutation({
        mutationFn: async (newComment: { content: string }) => {
            return api.post('/comments', { postId, ...newComment });
        },
        onSuccess: () => {
             queryClient.invalidateQueries({ queryKey: ['comments', postId] });
             setContent('');
             toast.success('Comment added');
        },
        onError: (error: any) => {
             toast.error(error.response?.data?.message || 'Failed to add comment');
        }
    });

    const deleteCommentMutation = useMutation({
        mutationFn: async (commentId: string) => {
            return api.delete(`/comments/${commentId}`);
        },
        onSuccess: () => {
             queryClient.invalidateQueries({ queryKey: ['comments', postId] });
             toast.success('Comment deleted');
        },
        onError: (error: any) => {
             toast.error(error.response?.data?.message || 'Failed to delete comment');
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;
        addCommentMutation.mutate({ content });
    };

    if (isLoading) return <div>Loading comments...</div>;

    return (
        <div className="mt-8">
            <h3 className="text-2xl font-bold mb-4">Comments ({comments?.length || 0})</h3>
            
            {user ? (
                <form onSubmit={handleSubmit} className="mb-8">
                    <Textarea
                        placeholder="Write a comment..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="mb-2"
                    />
                    <Button type="submit" disabled={addCommentMutation.isPending}>
                        {addCommentMutation.isPending ? 'Posting...' : 'Post Comment'}
                    </Button>
                </form>
            ) : (
                <div className="mb-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    Please <a href="/auth/login" className="text-blue-500 underline">login</a> to comment.
                </div>
            )}

            <div className="space-y-6">
                {comments?.map((comment: Comment) => (
                    <div key={comment._id} className="flex gap-4 p-4 border rounded-lg bg-white dark:bg-gray-800 shadow-sm">
                        <Avatar>
                            <AvatarFallback>{comment.user.name.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="font-semibold">{comment.user.name}</h4>
                                    <span className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleDateString()}</span>
                                </div>
                                {(user?._id === comment.user._id || user?.role === 'admin') && (
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        onClick={() => deleteCommentMutation.mutate(comment._id)}
                                        className="text-red-500 hover:text-red-700 h-8 w-8"
                                    >
                                        <Trash2 size={16} />
                                    </Button>
                                )}
                            </div>
                            <p className="mt-2 text-gray-700 dark:text-gray-300">{comment.content}</p>
                        </div>
                    </div>
                ))}
                {comments?.length === 0 && (
                    <p className="text-gray-500 text-center py-4">No comments yet. Be the first to share your thoughts!</p>
                )}
            </div>
        </div>
    );
}
