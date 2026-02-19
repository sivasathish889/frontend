'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { getImageUrl } from '@/lib/config';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

export default function EditPostPage() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string;
    
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState<File | string | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [category, setCategory] = useState('');
    const [status, setStatus] = useState('draft');
    const [loading, setLoading] = useState(false);
    const queryClient = useQueryClient();

    const { data: post, isLoading: isPostLoading } = useQuery({
        queryKey: ['post', id],
        queryFn: async () => {
             const res = await api.get(`/posts/${id}`);
             return res.data;
        },
        enabled: !!id
    });

    const { data: categories } = useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
             const res = await api.get('/categories');
             return res.data;
        }
    });

    useEffect(() => {
        if (post) {
            setTitle(post.title);
            setContent(post.content);
            setImage(post.image || null);
            setCategory(post.category?._id || post.category || '');
            setStatus(post.status);
            setPreview(getImageUrl(post.image));
        }
    }, [post]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const updatePostMutation = useMutation({
        mutationFn: async (formData: FormData) => {
            return api.put(`/posts/${params.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
        },
        onSuccess: (data) => {
             queryClient.invalidateQueries({ queryKey: ['post', params.id] });
             toast.success('Post updated successfully!');
             router.push('/dashboard/posts');
        },
        onError: (error: any) => {
             toast.error(error.response?.data?.message || 'Failed to update post');
        }
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        formData.append('category', category);
        formData.append('status', status);
        if (image instanceof File) {
            formData.append('image', image);
        }

        updatePostMutation.mutate(formData);
    };
    
    if (isPostLoading) return <div>Loading post...</div>;

    return (
        <div className="max-w-2xl mx-auto py-8">
            <h1 className="text-3xl font-bold mb-8">Edit Post</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter post title"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="image">Image</Label>
                    <div className="flex flex-col gap-4">
                        {preview && (
                            <div className="relative w-full h-48 bg-gray-100 rounded-md overflow-hidden">
                                <img 
                                    src={preview} 
                                    alt="Preview" 
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}
                        <Input
                            id="image"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                    </div>
                </div>
                
                <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select onValueChange={setCategory} value={category}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                             {categories?.map((cat: any) => (
                                <SelectItem key={cat._id} value={cat._id}>
                                    {cat.name}
                                </SelectItem>
                            ))}
                            <SelectItem value="uncategorized" disabled={!categories?.length}>
                                {categories?.length ? 'Uncategorized' : 'No Categories Found'}
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="content">Content</Label>
                    <Textarea
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Write your post content here..."
                        rows={10}
                        required
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select onValueChange={setStatus} value={status}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="published">Published</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex justify-end gap-4">
                    <Button variant="outline" type="button" onClick={() => router.back()}>Cancel</Button>
                    <Button type="submit" disabled={updatePostMutation.isPending}>
                        {updatePostMutation.isPending ? 'Updating...' : 'Update Post'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
