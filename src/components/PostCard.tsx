'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface Post {
    _id: string;
    title: string;
    content: string;
    image?: string;
    author: { name: string };
    category: { name: string };
    createdAt: string;
}

import { getImageUrl } from '@/lib/config';

export function PostCard({ post }: { post: Post }) {
    const imageUrl = getImageUrl(post.image);

    return (
        <Card className="h-full flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm overflow-hidden group">
            <div className="h-48 bg-gray-100 dark:bg-gray-800 rounded-t-lg flex items-center justify-center text-gray-400 overflow-hidden relative group">
                {imageUrl ? (
                    <img 
                        src={imageUrl} 
                        alt={post.title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <>
                        <div className="absolute inset-0 bg-gradient-to-tr from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 transition-transform duration-500 group-hover:scale-105"></div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="z-10 text-gray-300 group-hover:text-blue-400 transition-colors"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                    </>
                )}
            </div>
            <CardHeader className="pb-2">
                <div className="flex justify-between items-start mb-2">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        {post.category?.name || 'Uncategorized'}
                    </Badge>
                </div>
                <CardTitle className="text-xl line-clamp-2 leading-tight hover:text-blue-600 transition-colors">
                    <Link href={`/posts/${post._id}`}>{post.title}</Link>
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 pb-4">
                 <p className="text-gray-500 dark:text-gray-400 line-clamp-3 text-sm">
                    {post.content.replace(/<[^>]*>?/gm, '').substring(0, 160)}...
                </p>
            </CardContent>
            <CardFooter className="flex justify-between items-center pt-4 border-t dark:border-gray-800">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-300">
                        {post.author.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs font-medium text-gray-900 dark:text-gray-200">{post.author.name}</span>
                        <span className="text-xs text-gray-400">{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>
                <Link href={`/posts/${post._id}`}>
                    <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-0 h-auto">
                        Read Story &rarr;
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    );
}
