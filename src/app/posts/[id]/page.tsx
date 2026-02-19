import { Metadata } from 'next';
import api from '@/lib/api';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import CommentsSection from '@/components/CommentsSection';
import LikeButton from '@/components/LikeButton';

import { API_URL, getImageUrl } from '@/lib/config';

async function getPost(id: string) {
    try {
        const res = await fetch(`${API_URL}/posts/${id}`, { cache: 'no-store' });
        if (!res.ok) return undefined;
        return res.json();
    } catch (error) {
        return undefined;
    }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    const post = await getPost(id);
    if (!post) return { title: 'Post Not Found' };
    return {
        title: post.title,
        description: post.content.substring(0, 160),
    };
}

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const post = await getPost(id);

    if (!post) {
        notFound();
    }

    const imageUrl = post.image ? (post.image.startsWith('http') ? post.image : `http://localhost:5000${post.image}`) : null;

    return (
        <div className="container mx-auto py-10 px-4 max-w-3xl">
            <Link href="/" className="mb-4 inline-block text-blue-500 hover:underline">&larr; Back to Home</Link>
            
            <article>
                <h1 className="text-4xl font-extrabold mb-4">{post.title}</h1>
                <div className="flex justify-between items-center text-gray-500 mb-8 pb-4 border-b">
                     <span>By {post.author.name}</span>
                     <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
                
                {imageUrl && (
                    <div className="mb-8 w-full h-[400px] relative rounded-lg overflow-hidden bg-gray-100">
                        <img 
                            src={imageUrl} 
                            alt={post.title} 
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}
                
                <div className="prose lg:prose-xl dark:prose-invert">
                    {post.content.split('\n').map((para: string, idx: number) => (
                        <p key={idx} className="mb-4 text-lg leading-relaxed">{para}</p>
                    ))}
                </div>

                <div className="mt-10 pt-8 border-t flex justify-between items-center">
                    <div className="flex gap-2">
                        {post.tags?.map((tag: any) => (
                            <span key={tag._id} className="bg-gray-200 px-3 py-1 rounded-full text-sm text-gray-700">
                                #{tag.name}
                            </span>
                        ))}
                    </div>
                    <LikeButton postId={post._id} />
                </div>
            </article>

            <CommentsSection postId={post._id} />
        </div>
    );
}
