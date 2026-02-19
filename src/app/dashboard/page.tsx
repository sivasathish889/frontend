'use client';

import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

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
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{data.totalPosts}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{data.totalUsers}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Likes</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{data.totalLikes}</div>
                </CardContent>
            </Card>
        </>
    )
}

export default function DashboardPage() {
    const { user, loading } = useAuth();
    
    if (loading) return <div>Loading...</div>;
    if (!user) return null;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Welcome back, {user.name}!</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Role</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold capitalize">{user.role}</div>
                    </CardContent>
                </Card>
                
                {user.role === 'admin' && <AdminAnalytics />}
            </div>

            <div className="mt-6">
                 <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
                 <div className="flex gap-4">
                     <Link href="/">
                         <Button>View Blog</Button>
                     </Link>
                     {(user.role === 'admin' || user.role === 'editor') && (
                         <Link href="/dashboard/create-post">
                             <Button variant="outline">Create New Post</Button>
                         </Link>
                     )}
                 </div>
            </div>
        </div>
    );
}
