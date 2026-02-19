'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function LikeButton({ postId }: { postId: string }) {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [isLiked, setIsLiked] = useState(false); // Optimistic state, ideally fetched from backend per user

    const { data: likeData } = useQuery({
        queryKey: ['likes', postId],
        queryFn: async () => {
            const res = await api.get(`/likes/${postId}`);
            return res.data;
        }
    });

    const toggleLikeMutation = useMutation({
        mutationFn: async () => {
            return api.post('/likes', { postId });
        },
        onSuccess: (data) => {
             queryClient.invalidateQueries({ queryKey: ['likes', postId] });
             setIsLiked(data.data.message === 'Post liked');
             toast.success(data.data.message);
        },
        onError: (error: any) => {
             toast.error(error.response?.data?.message || 'Failed to like post');
        }
    });

    const handleLike = () => {
        if (!user) {
            toast.error('Please login to like this post');
            return;
        }
        toggleLikeMutation.mutate();
    };

    return (
        <Button 
            variant="outline" 
            size="sm" 
            onClick={handleLike}
            className={cn("gap-2", isLiked && "text-red-500 border-red-200 bg-red-50")}
            disabled={toggleLikeMutation.isPending}
        >
            <Heart className={cn("h-4 w-4", isLiked && "fill-current")} />
            <span>{likeData?.count || 0} Likes</span>
        </Button>
    );
}
