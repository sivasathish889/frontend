'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import api from '@/lib/api';
import Link from 'next/link';
import { BookOpen, LogIn, Mail, Lock } from 'lucide-react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await api.post('/auth/login', { email, password });
            login(data.token, data);
            toast.success('Logged in successfully');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600">
            {/* Left decorative panel */}
            <div className="hidden lg:flex flex-col justify-center items-center flex-1 p-16 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-72 h-72 bg-black/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />
                <div className="relative text-center text-white space-y-6 max-w-md">
                    <div className="bg-white/20 backdrop-blur-sm w-16 h-16 rounded-2xl flex items-center justify-center mx-auto shadow-xl">
                        <BookOpen size={32} className="text-white" />
                    </div>
                    <h1 className="text-4xl font-extrabold tracking-tight">BlogCMS</h1>
                    <p className="text-lg text-white/80 leading-relaxed">
                        Your modern platform to create, manage and share amazing stories with the world.
                    </p>
                    <div className="flex justify-center gap-3">
                        {['✍️  Write', '📚  Publish', '🌍  Share'].map((s) => (
                            <span key={s} className="bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-medium">
                                {s}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right form panel */}
            <div className="flex-1 flex items-center justify-center bg-white dark:bg-gray-950 rounded-l-3xl lg:max-w-md xl:max-w-lg p-8 lg:p-16 shadow-2xl">
                <div className="w-full max-w-sm space-y-8">
                    {/* Mobile logo */}
                    <div className="lg:hidden flex items-center gap-2 mb-2">
                        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-xl">
                            <BookOpen size={20} className="text-white" />
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            BlogCMS
                        </span>
                    </div>

                    <div>
                        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Welcome back</h2>
                        <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">Sign in to your account to continue.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-gray-700 dark:text-gray-300 font-medium">Email</Label>
                            <div className="relative">
                                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="pl-10 rounded-xl border-gray-200 focus:border-indigo-400 focus:ring-indigo-400"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-gray-700 dark:text-gray-300 font-medium">Password</Label>
                            <div className="relative">
                                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="pl-10 rounded-xl border-gray-200 focus:border-indigo-400 focus:ring-indigo-400"
                                />
                            </div>
                        </div>
                        <Button
                            type="submit"
                            className="w-full h-11 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold shadow-lg shadow-indigo-300/40 hover:shadow-indigo-400/50 hover:-translate-y-0.5 transition-all duration-200 gap-2"
                            disabled={loading}
                        >
                            <LogIn size={16} />
                            {loading ? 'Signing in…' : 'Sign In'}
                        </Button>
                    </form>

                    <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                        Don't have an account?{' '}
                        <Link href="/auth/register" className="font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors">
                            Create one
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
