'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import api from '@/lib/api';
import Link from 'next/link';
import { BookOpen, UserPlus, Mail, Lock, User, ShieldCheck } from 'lucide-react';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user');
    const { login } = useAuth();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await api.post('/auth/register', { name, email, password, role });
            login(data.token, data);
            toast.success('Account created successfully');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-600">
            {/* Left decorative panel */}
            <div className="hidden lg:flex flex-col justify-center items-center flex-1 p-16 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
                <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/4" />
                <div className="absolute bottom-0 right-0 w-72 h-72 bg-black/10 rounded-full blur-3xl translate-y-1/3 translate-x-1/4" />
                <div className="relative text-center text-white space-y-6 max-w-md">
                    <div className="bg-white/20 backdrop-blur-sm w-16 h-16 rounded-2xl flex items-center justify-center mx-auto shadow-xl">
                        <BookOpen size={32} className="text-white" />
                    </div>
                    <h1 className="text-4xl font-extrabold tracking-tight">Join BlogCMS</h1>
                    <p className="text-lg text-white/80 leading-relaxed">
                        Create your account and start sharing your stories with thousands of readers worldwide.
                    </p>
                    <div className="grid grid-cols-3 gap-3">
                        {[
                            { emoji: '🚀', label: 'Fast' },
                            { emoji: '🔒', label: 'Secure' },
                            { emoji: '🎨', label: 'Beautiful' },
                        ].map(({ emoji, label }) => (
                            <div key={label} className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-center">
                                <div className="text-2xl mb-1">{emoji}</div>
                                <div className="text-xs font-semibold text-white/80">{label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right form panel */}
            <div className="flex-1 flex items-center justify-center bg-white dark:bg-gray-950 rounded-l-3xl lg:max-w-md xl:max-w-lg p-8 lg:p-16 shadow-2xl">
                <div className="w-full max-w-sm space-y-8">
                    {/* Mobile logo */}
                    <div className="lg:hidden flex items-center gap-2">
                        <div className="bg-gradient-to-br from-violet-500 to-indigo-600 p-2 rounded-xl">
                            <BookOpen size={20} className="text-white" />
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                            BlogCMS
                        </span>
                    </div>

                    <div>
                        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Create account</h2>
                        <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">Join us today. It's completely free.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-gray-700 dark:text-gray-300 font-medium">Full Name</Label>
                            <div className="relative">
                                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="Jane Doe"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    className="pl-10 rounded-xl border-gray-200 focus:border-violet-400 focus:ring-violet-400"
                                />
                            </div>
                        </div>
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
                                    className="pl-10 rounded-xl border-gray-200 focus:border-violet-400 focus:ring-violet-400"
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
                                    placeholder="Min 6 characters"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength={6}
                                    className="pl-10 rounded-xl border-gray-200 focus:border-violet-400 focus:ring-violet-400"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="role" className="text-gray-700 dark:text-gray-300 font-medium">Role</Label>
                            <div className="relative">
                                <ShieldCheck size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10 pointer-events-none" />
                                <Select value={role} onValueChange={setRole}>
                                    <SelectTrigger id="role" className="pl-10 rounded-xl border-gray-200 focus:border-violet-400">
                                        <SelectValue placeholder="Select a role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="user">User</SelectItem>
                                        <SelectItem value="editor">Editor</SelectItem>
                                        <SelectItem value="admin">Admin</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <Button
                            type="submit"
                            className="w-full h-11 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-semibold shadow-lg shadow-violet-300/40 hover:shadow-violet-400/50 hover:-translate-y-0.5 transition-all duration-200 gap-2"
                            disabled={loading}
                        >
                            <UserPlus size={16} />
                            {loading ? 'Creating account…' : 'Create Account'}
                        </Button>
                    </form>

                    <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                        Already have an account?{' '}
                        <Link href="/auth/login" className="font-semibold text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300 transition-colors">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
