'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { PostCard } from '@/components/PostCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Search, Filter, TrendingUp, Sparkles, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils'; // Assuming cn exists

export default function Home() {
    const { user, logout } = useAuth();
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const { data: categories } = useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
             const res = await api.get('/categories');
             return res.data;
        }
    });

    const { data, isLoading, error } = useQuery({
        queryKey: ['posts', selectedCategory, debouncedSearch],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (selectedCategory) params.append('category', selectedCategory);
            if (debouncedSearch) params.append('keyword', debouncedSearch);
            
            const res = await api.get(`/posts?${params.toString()}`);
            return res.data; // Expected { posts: [], page: 1, pages: 1 } or just [] depending on backend. Update controller returned object.
        }
    });

    const posts = data?.posts || data || [];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans selection:bg-blue-100 selection:text-blue-900">
            {/* Header / Navbar */}
            <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b dark:border-gray-800 sticky top-0 z-50 transition-all duration-300">
                <div className="container mx-auto px-4 h-16 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                         <div className="bg-gradient-to-tr from-blue-600 to-purple-600 p-2 rounded-lg text-white">
                            <BookOpen size={20} />
                         </div>
                         <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
                            BlogCMS
                        </h1>
                    </div>
                    
                    <div className="flex gap-4 items-center">
                        {user ? (
                            <div className="flex items-center gap-4">
                                <span className="text-sm font-medium hidden md:inline-block text-gray-600 dark:text-gray-300">
                                    Hi, <span className="text-blue-600 dark:text-blue-400">{user.name}</span>
                                </span>
                                <Link href="/dashboard">
                                    <Button variant="outline" className="border-blue-200 hover:bg-blue-50 hover:text-blue-600 dark:border-blue-900 dark:hover:bg-blue-900/20">
                                        Dashboard
                                    </Button>
                                </Link>
                                <Button onClick={logout} variant="ghost" className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                                    Logout
                                </Button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link href="/auth/login">
                                    <Button variant="ghost" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">Login</Button>
                                </Link>
                                <Link href="/auth/register">
                                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all rounded-full px-6">
                                        Get Started
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <main>
                {/* Hero Section */}
                <section className="relative overflow-hidden bg-white dark:bg-gray-900 border-b dark:border-gray-800">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-blue-400/20 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
                    <div className="absolute bottom-0 right-0 w-[800px] h-[400px] bg-purple-400/20 rounded-full blur-[100px] -z-10 pointer-events-none"></div>

                    <div className="container mx-auto px-4 py-24 md:py-32 text-center relative z-10">
                        <Badge variant="secondary" className="mb-6 py-1 px-4 text-sm bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800">
                            <Sparkles size={14} className="mr-2 inline" /> 
                            Discover the Future of Blogging
                        </Badge>
                        <h2 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 text-gray-900 dark:text-white leading-tight">
                            Stories that <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 animate-gradient">Ignite</span> <br className="hidden md:block"/> Your Imagination.
                        </h2>
                        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
                            A modern platform for thinkers, creators, and readers. Share your ideas with the world and connect with a community of like-minded individuals.
                        </p>
                        
                        {!user && (
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link href="/auth/register">
                                    <Button size="lg" className="h-14 px-8 text-lg rounded-full bg-gray-900 text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto">
                                        Start Writing Now
                                    </Button>
                                </Link>
                                <Link href="#explore">
                                    <Button variant="outline" size="lg" className="h-14 px-8 text-lg rounded-full border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800 w-full sm:w-auto">
                                        Browse Articles
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </section>

                {/* Posts Section */}
                <section id="explore" className="container mx-auto px-4 py-16">
                    <div className="flex flex-col gap-8 mb-12">
                        <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4 border-b border-gray-200 dark:border-gray-800 pb-6">
                            <div>
                                <h3 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    <TrendingUp className="text-blue-600" /> 
                                    Latest Articles
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400 mt-2">Explore the minimal and clean blog posts.</p>
                            </div>
                            
                            {/* Search Bar */}
                            <div className="relative w-full md:w-72">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <Input 
                                    placeholder="Search articles..." 
                                    className="pl-10 rounded-full border-gray-200 bg-gray-50 focus:bg-white transition-all"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Filters */}
                        <div className="flex flex-wrap gap-2 items-center">
                            <span className="text-sm font-medium text-gray-500 mr-2 flex items-center gap-1">
                                <Filter size={14} /> Filter by:
                            </span>
                            <Button 
                                variant={selectedCategory === null ? "default" : "outline"} 
                                size="sm" 
                                className={cn(
                                    "rounded-full transition-all",
                                    selectedCategory === null ? "bg-black text-white hover:bg-gray-800" : "text-gray-600 hover:text-gray-900"
                                )}
                                onClick={() => setSelectedCategory(null)}
                            >
                                All
                            </Button>
                            {categories?.map((cat: any) => (
                                <Button 
                                    key={cat._id}
                                    variant={selectedCategory === cat._id ? "default" : "outline"} 
                                    size="sm" 
                                    className={cn(
                                        "rounded-full transition-all",
                                        selectedCategory === cat._id ? "bg-blue-600 text-white hover:bg-blue-700 border-blue-600" : "text-gray-600 hover:text-gray-900 border-gray-200"
                                    )}
                                    onClick={() => setSelectedCategory(cat._id)}
                                >
                                    {cat.name}
                                </Button>
                            ))}
                        </div>
                    </div>
                    
                    {isLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                             {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="h-[400px] bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse"></div>
                             ))}
                        </div>
                    ) : error ? (
                        <div className="text-center py-20 bg-red-50 rounded-2xl border border-red-100">
                             <p className="text-red-500 font-medium">Error loading posts. Please try again later.</p>
                        </div>
                    ) : posts.length === 0 ? (
                        <div className="text-center py-32 bg-gray-50 dark:bg-gray-900 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-800">
                            <div className="bg-gray-100 dark:bg-gray-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Search className="text-gray-400" size={24} />
                            </div>
                            <p className="text-xl font-semibold text-gray-900 dark:text-white">No posts found.</p>
                            <p className="text-gray-500 mt-2 max-w-md mx-auto">
                                We couldn't find any articles matching your search or filter. Try removing filters to see more results.
                            </p>
                            <Button 
                                variant="outline" 
                                className="mt-6"
                                onClick={() => { setSelectedCategory(null); setSearchQuery(''); }}
                            >
                                Clear All Filters
                            </Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 group/list">
                            {posts.map((post: any) => (
                                <div key={post._id} className="transform transition-all duration-300 hover:translate-y-[-8px]">
                                    <PostCard post={post} />
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </main>
            
            <footer className="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 py-12 mt-12">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-2">
                             <div className="bg-gray-900 text-white p-1.5 rounded-md dark:bg-white dark:text-gray-900">
                                <BookOpen size={16} />
                             </div>
                             <span className="font-bold text-lg">BlogCMS</span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            &copy; {new Date().getFullYear()} BlogCMS. Built for creators.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
