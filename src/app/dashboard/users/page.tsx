'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { UserPlus, Shield } from 'lucide-react';
import { ManagePageSkeleton } from '@/components/Skeletons';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

const ROLE_BADGE: Record<string, string> = {
  admin:  'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  editor: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  user:   'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
};

export default function UsersPage() {
  const queryClient = useQueryClient();
  const { user: currentUser } = useAuth();
  const isAdmin = currentUser?.role === 'admin';

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user' });

  const { data: users, isLoading, error } = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await api.get('/auth/users');
      return res.data;
    },
  });

  const createUserMutation = useMutation({
    mutationFn: (payload: typeof form) => api.post('/auth/users', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User created successfully!');
      setOpen(false);
      setForm({ name: '', email: '', password: '', role: 'user' });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to create user.');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      toast.error('Please fill in all required fields.');
      return;
    }
    createUserMutation.mutate(form);
  };

  if (isLoading) return <ManagePageSkeleton cols={5} />;

  if (error) {
    return (
      <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl border border-red-200 dark:border-red-800">
        <Shield size={20} />
        <span>Error loading users. Make sure you are an admin.</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── Gradient page header ── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-teal-500 via-emerald-500 to-cyan-600 p-6 text-white shadow-xl shadow-emerald-300/30 dark:shadow-emerald-900/40">
        <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="relative flex justify-between items-center">
          {/* Title */}
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2.5 rounded-xl">
              <Shield size={20} />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight">Manage Users</h1>
              <p className="text-emerald-100 text-sm mt-0.5">
                {users?.length ?? 0} registered user{users?.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>

          {/* Add User — admin only */}
          {isAdmin && (
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="bg-white text-emerald-700 hover:bg-emerald-50 font-semibold shadow-md hover:-translate-y-0.5 transition-all duration-200 rounded-xl gap-2">
                  <UserPlus size={16} />
                  Add User
                </Button>
              </DialogTrigger>

              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <UserPlus size={20} className="text-emerald-500" />
                    Create New User
                  </DialogTitle>
                  <DialogDescription>
                    Fill in the details below to add a new user to the platform.
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-2">
                  <div className="space-y-1">
                    <Label htmlFor="new-user-name">Full Name <span className="text-red-500">*</span></Label>
                    <Input
                      id="new-user-name"
                      placeholder="Jane Doe"
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="new-user-email">Email <span className="text-red-500">*</span></Label>
                    <Input
                      id="new-user-email"
                      type="email"
                      placeholder="jane@example.com"
                      value={form.email}
                      onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="new-user-password">Password <span className="text-red-500">*</span></Label>
                    <Input
                      id="new-user-password"
                      type="password"
                      placeholder="Min 6 characters"
                      value={form.password}
                      onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                      required
                      minLength={6}
                    />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="new-user-role">Role</Label>
                    <Select value={form.role} onValueChange={(val) => setForm((f) => ({ ...f, role: val }))}>
                      <SelectTrigger id="new-user-role">
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="editor">Editor</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <DialogFooter className="pt-2">
                    <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={createUserMutation.isPending}>
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={createUserMutation.isPending}
                      className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white"
                    >
                      {createUserMutation.isPending ? 'Creating…' : 'Create User'}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* ── Table card ── */}
      <div className="bg-white dark:bg-gray-950 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gradient-to-r from-gray-50 to-emerald-50/40 dark:from-gray-800/60 dark:to-emerald-950/20 border-b border-gray-100 dark:border-gray-800">
              <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Name</TableHead>
              <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Email</TableHead>
              <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Role</TableHead>
              <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Joined Date</TableHead>
              <TableHead className="font-semibold text-gray-700 dark:text-gray-300 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users?.map((u) => (
              <TableRow key={u._id} className="hover:bg-emerald-50/30 dark:hover:bg-emerald-950/20 transition-colors">
                <TableCell className="font-medium text-gray-900 dark:text-white">{u.name}</TableCell>
                <TableCell className="text-gray-500 dark:text-gray-400">{u.email}</TableCell>
                <TableCell>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${ROLE_BADGE[u.role] ?? ROLE_BADGE['user']}`}>
                    {u.role}
                  </span>
                </TableCell>
                <TableCell className="text-gray-500 dark:text-gray-400">
                  {new Date(u.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" disabled>Edit</Button>
                  <Button variant="ghost" size="sm" className="text-red-500" disabled>Delete</Button>
                </TableCell>
              </TableRow>
            ))}

            {users?.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12 text-gray-400">
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
