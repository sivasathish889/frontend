'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { LayoutDashboard, FileText, PlusCircle, Users, FolderTree, Tags, LogOut, Home, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { DashboardOverviewSkeleton } from '@/components/Skeletons';
import { cn } from '@/lib/utils';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { user, loading, logout } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!loading && !user) router.push('/auth/login');
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950">
                <DashboardOverviewSkeleton />
            </div>
        );
    }

    if (!user) return null;

    const NavItem = ({ href, icon: Icon, label }: { href: string; icon: any; label: string }) => {
        const isActive = pathname === href;
        return (
            <Link
                href={href}
                className={cn(
                    'flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group relative',
                    isActive
                        ? 'bg-white/20 text-white shadow-lg shadow-white/10 backdrop-blur-sm'
                        : 'text-indigo-200 hover:bg-white/10 hover:text-white'
                )}
            >
                {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-r-full" />
                )}
                <Icon size={18} className={isActive ? 'text-white' : 'text-indigo-300 group-hover:text-white'} />
                <span className="font-medium text-sm">{label}</span>
            </Link>
        );
    };

    const initials = user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    return (
        <div className="flex bg-gray-50 dark:bg-gray-950 min-h-screen">
            {/* ── Gradient Sidebar ── */}
            <aside className="w-64 hidden md:flex flex-col fixed h-full z-10 bg-gradient-to-b from-indigo-600 via-indigo-700 to-purple-800 shadow-2xl shadow-indigo-900/40">

                {/* Logo */}
                <div className="px-6 pt-6 pb-4 border-b border-white/10">
                    <Link href="/" className="flex items-center gap-2 mb-5 group">
                        <div className="bg-white/20 backdrop-blur-sm p-2 rounded-xl group-hover:bg-white/30 transition-colors">
                            <Home size={18} className="text-white" />
                        </div>
                        <span className="text-lg font-bold text-white tracking-tight">BlogCMS</span>
                    </Link>

                    {/* User Avatar */}
                    <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-3 py-2.5">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-pink-400 to-orange-400 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-orange-500/30 flex-shrink-0">
                            {initials}
                        </div>
                        <div className="overflow-hidden">
                            <p className="font-semibold text-sm text-white truncate">{user.name}</p>
                            <p className="text-xs text-indigo-200 capitalize">{user.role}</p>
                        </div>
                    </div>
                </div>

                {/* Nav */}
                <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
                    <NavItem href="/dashboard" icon={LayoutDashboard} label="Overview" />

                    {(user.role === 'admin' || user.role === 'editor') && (
                        <>
                            <p className="pt-4 pb-1 px-4 text-[10px] font-bold text-indigo-300 uppercase tracking-widest">Content</p>
                            <NavItem href="/dashboard/posts" icon={FileText} label="Manage Posts" />
                            <NavItem href="/dashboard/create-post" icon={PlusCircle} label="Create Post" />
                        </>
                    )}

                    {user.role === 'admin' && (
                        <>
                            <p className="pt-4 pb-1 px-4 text-[10px] font-bold text-indigo-300 uppercase tracking-widest">System</p>
                            <NavItem href="/dashboard/users" icon={Users} label="Users" />
                            <NavItem href="/dashboard/categories" icon={FolderTree} label="Categories" />
                            <NavItem href="/dashboard/tags" icon={Tags} label="Tags" />
                        </>
                    )}
                </nav>

                {/* Logout */}
                <div className="px-4 pb-6 border-t border-white/10 pt-4">
                    <button
                        onClick={logout}
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium text-red-300 rounded-xl hover:bg-red-500/20 hover:text-red-200 transition-all duration-200 group"
                    >
                        <LogOut size={18} className="group-hover:rotate-12 transition-transform duration-200" />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* ── Main content ── */}
            <main className="flex-1 md:ml-64 min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/40 dark:from-gray-950 dark:via-indigo-950/20 dark:to-gray-950">
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
