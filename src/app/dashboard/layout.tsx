'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { LayoutDashboard, FileText, PlusCircle, Users, FolderTree, Tags, LogOut, Home } from 'lucide-react';
import Link from 'next/link';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
    const { user, loading, logout } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/auth/login');
        }
    }, [user, loading, router]);

    if (loading) {
        return <div className="flex h-screen items-center justify-center">Loading...</div>;
    }

    if (!user) {
        return null;
    }

    const NavItem = ({ href, icon: Icon, label }: { href: string; icon: any; label: string }) => (
        <Link href={href} className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
            <Icon size={20} />
            <span className="font-medium">{label}</span>
        </Link>
    );

    return (
        <div className="flex bg-gray-50 dark:bg-gray-900 min-h-screen">
             {/* Sidebar */}
            <aside className="w-64 bg-white dark:bg-gray-950 border-r dark:border-gray-800 hidden md:flex flex-col fixed h-full z-10">
                <div className="p-6 border-b dark:border-gray-800">
                    <Link href="/" className="flex items-center gap-2 mb-6 text-xl font-bold text-blue-600 dark:text-blue-400">
                        <Home size={24} />
                        <span>BlogCMS</span>
                    </Link>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 font-bold text-lg">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <p className="font-semibold text-sm">{user.name}</p>
                            <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    <NavItem href="/dashboard" icon={LayoutDashboard} label="Overview" />
                    
                    {(user.role === 'admin' || user.role === 'editor') && (
                        <>
                            <div className="pt-4 pb-2 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Content</div>
                            <NavItem href="/dashboard/posts" icon={FileText} label="Manage Posts" />
                            <NavItem href="/dashboard/create-post" icon={PlusCircle} label="Create Post" />
                        </>
                    )}
                    
                     {user.role === 'admin' && (
                        <>
                            <div className="pt-4 pb-2 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">System</div>
                            <NavItem href="/dashboard/users" icon={Users} label="Users" />
                            <NavItem href="/dashboard/categories" icon={FolderTree} label="Categories" />
                            <NavItem href="/dashboard/tags" icon={Tags} label="Tags" />
                        </>
                    )}
                </nav>

                <div className="p-4 border-t dark:border-gray-800">
                    <button 
                        onClick={logout}
                        className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                    >
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>
            
            <main className="flex-1 md:ml-64 p-8">
                {children}
            </main>
        </div>
    );
}
