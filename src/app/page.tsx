'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { PostCard } from '@/components/PostCard';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function Home() {
    const { user, logout } = useAuth();
    
    const { data, isLoading, error } = useQuery({
        queryKey: ['posts'],
        queryFn: async () => {
            const res = await api.get('/posts');
            return res.data;
        }
    });

    if (isLoading) return <div className="text-center mt-10">Loading posts...</div>;
    if (error) return <div className="text-center mt-10 text-red-500">Error loading posts</div>;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-[family-name:var(--font-geist-sans)]">
            <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b dark:border-gray-800 p-4 sticky top-0 z-20 transition-all">
                <div className="container mx-auto flex justify-between items-center">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        BlogCMS
                    </h1>
                    <div className="flex gap-4 items-center">
                        {user ? (
                            <>
                                <span className="text-sm font-medium hidden md:inline-block">Welcome, {user.name}</span>
                                <Link href="/dashboard">
                                    <Button variant="outline" className="hover:bg-blue-50">Dashboard</Button>
                                </Link>
                                <Button onClick={logout} variant="ghost" className="text-red-500 hover:text-red-600 hover:bg-red-50">Logout</Button>
                            </>
                        ) : (
                            <>
                                <Link href="/auth/login">
                                    <Button variant="ghost">Login</Button>
                                </Link>
                                <Link href="/auth/register">
                                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0">
                                        Get Started
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </header>

            <main>
                {/* Hero Section */}
                <section className="bg-white dark:bg-gray-900 border-b dark:border-gray-800 py-20 px-4">
                    <div className="container mx-auto text-center max-w-3xl">
                        <h2 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 text-gray-900 dark:text-white">
                            Discover Stories that <span className="text-blue-600">Matter</span>
                        </h2>
                        <p className="text-xl text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
                            A modern platform for thinkers, creators, and readers. Share your ideas with the world and connect with a community of like-minded individuals.
                        </p>
                        {!user && (
                            <Link href="/auth/register">
                                <Button size="lg" className="text-lg px-8 py-6 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all">
                                    Start Writing Now
                                </Button>
                            </Link>
                        )}
                    </div>
                </section>

                {/* Posts Section */}
                <section className="container mx-auto p-4 md:p-8 py-16">
                    <div className="flex justify-between items-center mb-10">
                        <h3 className="text-3xl font-bold text-gray-800 dark:text-gray-200">Latest Articles</h3>
                        <div className="flex gap-2">
                           {/* Filter buttons could go here */}
                           <Button variant="outline" size="sm" className="rounded-full">All</Button>
                           <Button variant="ghost" size="sm" className="rounded-full">Technology</Button>
                           <Button variant="ghost" size="sm" className="rounded-full">Lifestyle</Button>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {data.posts.map((post: any) => (
                            <div key={post._id} className="group hover:-translate-y-1 transition-transform duration-300">
                                <PostCard post={post} />
                            </div>
                        ))}
                    </div>
                    
                    {data.posts.length === 0 && (
                        <div className="text-center py-20">
                            <p className="text-xl text-gray-500">No posts found yet.</p>
                            <p className="text-gray-400 mt-2">Check back later or become an author!</p>
                        </div>
                    )}
                </section>
            </main>
            
            <footer className="bg-white dark:bg-gray-900 border-t dark:border-gray-800 py-12 mt-12">
                <div className="container mx-auto px-4 text-center text-gray-500">
                    <p>&copy; {new Date().getFullYear()} BlogCMS. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
