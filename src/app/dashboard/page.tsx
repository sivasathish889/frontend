'use client';

import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { DashboardOverviewSkeleton } from '@/components/Skeletons';
import { FileText, Users, Heart, Eye, Pencil, BookOpen } from 'lucide-react';

interface StatCardProps {
    label: string;
    value: number | string;
    icon: React.ElementType;
    gradient: string;
    iconBg: string;
}

function StatCard({ label, value, icon: Icon, gradient, iconBg }: StatCardProps) {
    return (
        <div className={`relative overflow-hidden rounded-2xl p-6 text-white shadow-lg ${gradient}`}>
            {/* decorative blob */}
            <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute bottom-0 left-1/2 w-40 h-20 rounded-full bg-black/10 blur-3xl" />

            <div className="relative flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-white/70 mb-1">{label}</p>
                    <p className="text-4xl font-extrabold tracking-tight">{value}</p>
                </div>
                <div className={`p-3 rounded-xl ${iconBg} shadow-lg`}>
                    <Icon size={22} className="text-white" />
                </div>
            </div>
        </div>
    );
}

function AdminAnalytics() {
    const { data } = useQuery({
        queryKey: ['analytics'],
        queryFn: async () => {
            const res = await api.get('/analytics');
            return res.data;
        }
    });

    if (!data) return null;

    return (
        <>
            <StatCard
                label="Total Posts"
                value={data.totalPosts}
                icon={FileText}
                gradient="bg-gradient-to-br from-blue-500 to-indigo-600"
                iconBg="bg-blue-400/30"
            />
            <StatCard
                label="Total Users"
                value={data.totalUsers}
                icon={Users}
                gradient="bg-gradient-to-br from-purple-500 to-pink-600"
                iconBg="bg-purple-400/30"
            />
            <StatCard
                label="Total Likes"
                value={data.totalLikes}
                icon={Heart}
                gradient="bg-gradient-to-br from-rose-500 to-orange-500"
                iconBg="bg-rose-400/30"
            />
        </>
    );
}

export default function DashboardPage() {
    const { user, loading } = useAuth();

    if (loading) return <DashboardOverviewSkeleton />;
    if (!user) return null;

    const roleGradient =
        user.role === 'admin'
            ? 'bg-gradient-to-br from-violet-500 to-indigo-600'
            : user.role === 'editor'
            ? 'bg-gradient-to-br from-emerald-500 to-teal-600'
            : 'bg-gradient-to-br from-gray-500 to-gray-600';

    return (
        <div className="space-y-8">
            {/* ── Header banner ── */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-8 text-white shadow-2xl shadow-indigo-300/30 dark:shadow-indigo-900/40">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10" />
                <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-white/10 blur-3xl pointer-events-none" />
                <div className="absolute -left-8 bottom-0 w-48 h-32 rounded-full bg-black/20 blur-3xl pointer-events-none" />
                <div className="relative">
                    <p className="text-indigo-200 text-sm font-medium mb-1 flex items-center gap-2">
                        <BookOpen size={14} /> Dashboard
                    </p>
                    <h1 className="text-3xl font-extrabold tracking-tight">
                        Welcome back, <span className="text-yellow-300">{user.name}</span>! 👋
                    </h1>
                    <p className="text-indigo-200 mt-2 text-sm">Here's what's happening with your blog today.</p>
                </div>
            </div>

            {/* ── Stat cards ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {/* Role card — always visible */}
                <StatCard
                    label="Your Role"
                    value={user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    icon={Eye}
                    gradient={roleGradient}
                    iconBg="bg-white/20"
                />

                {user.role === 'admin' && <AdminAnalytics />}
            </div>

            {/* ── Quick actions ── */}
            <div>
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Quick Actions</h2>
                <div className="flex flex-wrap gap-3">
                    <Link href="/">
                        <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-md hover:shadow-indigo-300/40 hover:-translate-y-0.5 transition-all duration-200 rounded-xl">
                            View Blog
                        </Button>
                    </Link>
                    {(user.role === 'admin' || user.role === 'editor') && (
                        <Link href="/dashboard/create-post">
                            <Button variant="outline" className="border-indigo-200 text-indigo-700 hover:bg-indigo-50 dark:border-indigo-800 dark:text-indigo-300 dark:hover:bg-indigo-950 rounded-xl hover:-translate-y-0.5 transition-all duration-200">
                                <Pencil size={14} className="mr-2" />
                                Create New Post
                            </Button>
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}
