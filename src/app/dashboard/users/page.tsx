'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
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

  // ── dialog state ────────────────────────────────────────────────────────────
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
  });

  // ── fetch users ─────────────────────────────────────────────────────────────
  const { data: users, isLoading, error } = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await api.get('/auth/users');
      return res.data;
    },
  });

  // ── create user mutation ─────────────────────────────────────────────────────
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

  // ── render ───────────────────────────────────────────────────────────────────
  if (isLoading) return <ManagePageSkeleton cols={5} />;

  if (error) {
    return (
      <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg border border-red-200 dark:border-red-800">
        <Shield size={20} />
        <span>Error loading users. Make sure you are an admin.</span>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Manage Users</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {users?.length ?? 0} registered user{users?.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Create User button — admin only */}
        {isAdmin && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <UserPlus size={16} />
                Add User
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <UserPlus size={20} className="text-blue-500" />
                  Create New User
                </DialogTitle>
                <DialogDescription>
                  Fill in the details below to add a new user to the platform.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4 py-2">
                {/* Name */}
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

                {/* Email */}
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

                {/* Password */}
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

                {/* Role */}
                <div className="space-y-1">
                  <Label htmlFor="new-user-role">Role</Label>
                  <Select
                    value={form.role}
                    onValueChange={(val) => setForm((f) => ({ ...f, role: val }))}
                  >
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
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setOpen(false)}
                    disabled={createUserMutation.isPending}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createUserMutation.isPending}>
                    {createUserMutation.isPending ? 'Creating…' : 'Create User'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-950 rounded-xl border dark:border-gray-800 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Joined Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users?.map((u) => (
              <TableRow key={u._id}>
                <TableCell className="font-medium">{u.name}</TableCell>
                <TableCell className="text-gray-500 dark:text-gray-400">{u.email}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${ROLE_BADGE[u.role] ?? ROLE_BADGE['user']}`}
                  >
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
