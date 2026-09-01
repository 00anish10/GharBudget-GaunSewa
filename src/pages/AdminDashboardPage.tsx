import React, { useState, useEffect } from 'react';
import { useAuth, AdminRoute } from '../context/AuthContext';
import { api } from '../services/api';
import { UserPublic, UserRole } from '../types/api';
import { 
  Users, Shield, UserPlus, UserCheck, UserX, 
  Search, Filter, Loader2, Settings, LogOut,
  TrendingUp, Target, Sparkles, Download, 
  RefreshCw, XCircle, AlertCircle, CheckCircle2
} from 'lucide-react';
import { Input, Select, Option, Dialog, DialogTrigger, DialogContent, DialogHeader, DialogBody, DialogFooter, Switch } from '@/components/ui';

export const AdminDashboardPage: React.FC = () => {
  const { user, logout, isAdmin, refreshUser } = useAuth();
  const [users, setUsers] = useState<UserPublic[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'user' | 'admin' | 'guest'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [openType, setOpenType] = useState<'create' | 'edit' | 'activate' | 'deactivate'>('create');
  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    password: '',
    role: 'user' as UserRole,
    is_active: true,
  });
  const [editingUser, setEditingUser] = useState<UserPublic | null>(null);
  const [deletingUserId, setDeletingUserId] = useState<number | null>(null);
  const [updatingUserId, setUpdatingUserId] = useState<number | null>(null);

  useEffect(() => {
    fetchUsers();
  }, [page, search, roleFilter, statusFilter]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/users', {
        params: {
          page,
          page_size: pageSize,
          search,
          role: roleFilter === 'all' ? undefined : roleFilter,
          is_active: statusFilter === 'all' ? undefined : statusFilter === 'active',
        },
      });
      setUsers(response.data.users);
      setTotal(response.data.total);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    setFormData({
      email: '',
      full_name: '',
      password: '',
      role: 'user',
      is_active: true,
    });
    setOpenType('create');
    setModalOpen(true);
  };

  const handleEdit = (user: UserPublic) => {
    setFormData({
      email: user.email,
      full_name: user.full_name || '',
      password: '',
      role: user.role,
      is_active: user.is_active,
    });
    setOpenType('edit');
    setEditingUser(user);
    setModalOpen(true);
  };

  const handleDelete = (userId: number) => {
    setDeletingUserId(userId);
    setModalOpen(true);
  };

  const handleActivate = (userId: number) => {
    setUpdatingUserId(userId);
    setOpenType('activate');
    setModalOpen(true);
  };

  const handleDeactivate = (userId: number) => {
    setUpdatingUserId(userId);
    setOpenType('deactivate');
    setModalOpen(true);
  };

  const handleSave = async () => {
    setError('');
    setModalOpen(false);

    try {
      if (openType === 'create') {
        await api.post('/admin/users', {
          email: formData.email,
          full_name: formData.full_name,
          password: formData.password,
          role: formData.role,
          is_active: formData.is_active,
        });
      } else if (openType === 'edit' && editingUser) {
        await api.put(`/admin/users/${editingUser.id}`, {
          full_name: formData.full_name,
          role: formData.role,
          is_active: formData.is_active,
        });
      } else if (openType === 'activate') {
        await api.post(`/admin/users/${updatingUserId}/activate`);
      } else if (openType === 'deactivate') {
        await api.post(`/admin/users/${updatingUserId}/deactivate`);
      }

      setModalOpen(false);
      await fetchUsers();
      setFormData({
        email: '',
        full_name: '',
        password: '',
        role: 'user' as UserRole,
        is_active: true,
      });
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Operation failed');
      setModalOpen(true);
    }
  };

  const handleRowDelete = async () => {
    if (!deletingUserId) return;
    setError('');
    setModalOpen(false);

    try {
      await api.delete(`/admin/users/${deletingUserId}`);
      setDeletingUserId(null);
      await fetchUsers();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to delete user');
      setModalOpen(true);
    }
  };

  const handleRowUpdate = async () => {
    if (!updatingUserId) return;
    setError('');
    setModalOpen(false);

    try {
      await api.put(`/admin/users/${updatingUserId}`, {
        full_name: formData.full_name,
        role: formData.role,
        is_active: formData.is_active,
      });
      setUpdatingUserId(null);
      await fetchUsers();
      setModalOpen(false);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to update user');
      setModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-[url('/bg-pattern.svg')] bg-gray-50 overflow-x-hidden">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#005B48] flex items-center justify-center">
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </div>
              <span className="text-xl font-extrabold text-slate-900">Admin Panel</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Online</span>
              </div>
              <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 text-sm font-medium transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 pb-8">
        {/* Stats Overview */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4 py-6">
          {/* This stats section would show total users, active users, etc. */}
        </div>

        {/* Users Management Section */}
        <div className="max-w-7xl mx-auto">
          {/* Toolbar */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm mb-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900">User Management</h2>
                <p className="text-sm text-slate-500 mt-1">Manage all registered users with search, filters, and role assignment.</p>
              </div>
              
              {/* Toolbar Actions */}
              <div className="flex gap-2 sm:mt-0 sm:pr-6">
                <button
                  onClick={handleCreate}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#005B48] hover:bg-[#004A3A] text-white text-sm font-semibold transition-all shadow-md"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Create User</span>
                </button>
                <div className="relative">
                  <select
                    onChange={(e) => setSearch(e.target.value)}
                    value={search}
                    className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-400"
                  >
                    <option>Search...</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Search users..."
                    onChange={(e) => setSearch(e.target.value)}
                    value={search}
                    className="pl-32 py-2.5 pr-4 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#005B48] focus:bg-white"
                  />
                </div>
                <div className="relative">
                  <select
                    onChange={(e) => setRoleFilter(e.target.value as any)}
                    value={roleFilter}
                    className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-400"
                  >
                    <option>Role</option>
                    <option value="user">Users</option>
                    <option value="admin">Admins</option>
                    <option value="guest">Guests</option>
                  </select>
                  <div className="pl-32 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#005B48] focus:bg-white">
                    <span className="relative">
                      <span className="text-slate-500">All</span>
                      <svg className="w-3 h-3 absolute right-2 top-1/2 -translate-y-1/2 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </span>
                  </div>
                </div>
                <div className="relative">
                  <select
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    value={statusFilter}
                    className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-400"
                  >
                    <option>Status</option>
                    <option value="all">All</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                  <div className="pl-32 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#005B48] focus:bg-white">
                    <span className="relative">
                      <span className="text-slate-500">All</span>
                      <svg className="w-3 h-3 absolute right-2 top-1/2 -translate-y-1/2 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <path d="m9 12 2 2 4-4" />
                      </svg>
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setPage(1)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 text-sm font-medium transition-all"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Refresh</span>
                </button>
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden">
            {loading && (
              <div className="p-8 text-center">
                <Loader2 className="w-8 h-8 mx-auto animate-spin text-slate-400" />
                <p className="mt-2 text-slate-500">Loading users...</p>
              </div>
            )}

            {!loading && users.length === 0 && (
              <div className="p-8 text-center text-slate-500">
                <Users className="w-12 h-12 mx-auto mb-4" />
                <p>No users found</p>
              </div>
            )}

            {!loading && users.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full min-w-max">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="p-4 text-left text-xs font-medium text-slate-500">#</th>
                      <th className="p-4 text-left text-xs font-medium text-slate-500">Email</th>
                      <th className="p-4 text-left text-xs font-medium text-slate-500">Full Name</th>
                      <th className="p-4 text-left text-xs font-medium text-slate-500">Role</th>
                      <th className="p-4 text-left text-xs font-medium text-slate-500">Status</th>
                      <th className="p-4 text-left text-xs font-medium text-slate-500">Last Login</th>
                      <th className="p-4 text-left text-xs font-medium text-slate-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user, index) => (
                      <tr key={user.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="p-4 font-medium text-slate-700">{index + 1}</td>
                        <td className="p-4 font-medium text-slate-700 truncate">{user.email}</td>
                        <td className="p-4 font-medium text-slate-700 truncate">{user.full_name || '—'}</td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-semibold ${
                            user.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                            user.role === 'user' ? 'bg-emerald-100 text-emerald-700' :
                            'bg-slate-100 text-slate-600'
                          }`}>
                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                          </span>
                        </td>
                        <td className="p-4">
                          {user.is_active ? (
                            <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 text-[10px] font-medium">
                              Active
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded bg-red-100 text-red-700 text-[10px] font-medium">
                              Inactive
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-sm text-slate-500">{user.last_login || 'Never'}</td>
                        <td className="p-4">
                          <div className="flex gap-1.5">
                            <button
                              onClick={() => handleEdit(user)}
                              className="text-[#005B48] hover:text-[#004A3A] text-sm hover:underline"
                              title="Edit user"
                            >
                              <UserCheck className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handleDelete(user.id)}
                              className="text-red-500 hover:text-red-600 text-sm hover:underline"
                              title="Delete user"
                            >
                              <UserX className="w-3 h-3" />
                            </button>
                            {user.id !== 1 && (
                              <>
                                <button
                                  onClick={() => handleActivate(user.id)}
                                  className="text-emerald-600 hover:text-emerald-700 text-sm hover:underline"
                                  title="Activate user"
                                >
                                  <UserCheck className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={() => handleDeactivate(user.id)}
                                  className="text-red-600 hover:text-red-700 text-sm hover:underline"
                                  title="Deactivate user"
                                >
                                  <XCircle className="w-3 h-3" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {!loading && users.length > 0 && (
              <div className="p-4 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-500">
                    Showing {((page - 1) * pageSize) + 1} - {Math.min(page * pageSize, total)} of {total} users
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPage(Math.max(1, page - 1))}
                      className="px-4 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 text-sm font-medium transition-all"
                      disabled={page === 1}
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setPage(Math.min(totalPages, page + 1))}
                      className="px-4 py-2 rounded-xl bg-[#005B48] hover:bg-[#004A3A] text-white text-sm font-medium transition-all"
                      disabled={page >= totalPages}
                    >
                      Next
                    </button>
                  </div>
                </div>
                <p className="text-xs text-slate-400">
                  Page {page} of {totalPages}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* User Form Modal */}
        <Dialog open={modalOpen} onOpenChange={() => setModalOpen(false)}>
          <DialogTrigger asChild>
            <button className="hidden/0" />
          </DialogTrigger>
          <DialogContent className="p-6 sm:p-8 max-w-2xl mx-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-extrabold text-slate-900">
                {openType === 'create' ? 'Create New User' : openType === 'edit' && editingUser ? 'Edit User' : openType === 'activate' ? 'Activate User' : 'Deactivate User'}
              </DialogTitle>
              <DialogDescription>
                {openType === 'create' ? 'Add a new user to the system' : openType === 'edit' && editingUser ? `Edit user: ${editingUser.email}` : `Change user status for user ID: ${updatingUserId}`}
              </DialogDescription>
            </DialogHeader>
            <DialogBody className="space-y-4">
              {openType === 'create' || openType === 'edit' ? (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-[#005B48] focus:bg-white focus:ring-1 focus:ring-[#005B48] transition-all"
                  />
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name</label>
                  <input
                    type="text"
                    value={formData.full_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-[#005B48] focus:bg-white focus:ring-1 focus:ring-[#005B48] transition-all"
                  />
                  {openType !== 'activate' && openType !== 'deactivate' && (
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
                      <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-[#005B48] focus:bg-white focus:ring-1 focus:ring-[#005B48] transition-all"
                      />
                      {openType === 'create' && (
                        <p className="text-xs text-slate-500">
                          Password must be at least 8 characters. Leave blank to skip setting a password.
                        </p>
                      )}
                    </div>
                  )}
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as UserRole }))}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-[#005B48] focus:bg-white focus:ring-1 focus:ring-[#005B48] transition-all"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                    <option value="guest">Guest</option>
                  </select>
                </div>
              ) : (
                <p className="text-sm text-slate-500">
                  Are you sure you want to {'activate' === openType ? 'activate' : 'deactivate'} this user?
                </p>
              )}

              {openType === 'edit' && editingUser && (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Current Role</label>
                  <p className="text-sm text-slate-500">{editingUser.role.charAt(0).toUpperCase() + editingUser.role.slice(1)}</p>
                </div>
              )}

              {openType === 'activate' && updatingUserId && (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">User ID</label>
                  <p className="text-sm text-slate-500">{updatingUserId}</p>
                </div>
              )}

              {openType === 'deactivate' && updatingUserId && (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">User ID</label>
                  <p className="text-sm text-slate-500">{updatingUserId}</p>
                </div>
              )}
            </DialogBody>
            <DialogFooter className="flex justify-end gap-3 pt-4">
              <button
                onClick={() => setModalOpen(false)}
                className="px-6 py-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 text-sm font-medium transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={openType === 'create' && (!formData.email || !formData.full_name)}
                className="px-6 py-3 rounded-xl bg-[#005B48] hover:bg-[#004A3A] text-white text-sm font-bold transition-all"
              >
                {openType === 'create' ? 'Create User' : openType === 'edit' && editingUser ? 'Update User' : openType === 'activate' ? 'Activate' : 'Deactivate'}
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};