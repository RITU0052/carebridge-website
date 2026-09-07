'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Users,
  Search,
  Filter,
  UserCheck,
  UserX,
  AlertOctagon,
  Trash2,
  RotateCcw,
  Eye,
  RefreshCw,
  SlidersHorizontal,
} from 'lucide-react';
import { safeFetchJson } from '@/lib/fetchHelper';

interface UserItem {
  id: string;
  name: string;
  email: string;
  role: string;
  isVerified: boolean;
  status: 'Active' | 'Inactive' | 'Suspended' | 'Deleted';
  isDeleted: boolean;
  lastLoginAt: string;
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('createdAt');
  const [confirmModal, setConfirmModal] = useState<{
    open: boolean;
    user?: UserItem;
    action?: 'activate' | 'deactivate' | 'suspend' | 'delete' | 'restore';
  }>({ open: false });

  const loadUsers = useCallback(async () => {
    setLoading(true);
    const query = new URLSearchParams({
      search,
      status: statusFilter,
      role: roleFilter,
      sortBy,
    });
    const { ok, data } = await safeFetchJson(`/api/admin/users?${query.toString()}`);
    if (ok && data?.success) {
      setUsers(data.users);
    }
    setLoading(false);
  }, [search, statusFilter, roleFilter, sortBy]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleStatusAction = async () => {
    if (!confirmModal.user || !confirmModal.action) return;
    const { ok, data } = await safeFetchJson(`/api/admin/users/${confirmModal.user.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: confirmModal.action }),
    });
    if (ok && data?.success) {
      setConfirmModal({ open: false });
      loadUsers();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 p-6 rounded-3xl border border-slate-800 shadow-xl">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">User Account Management</h1>
          <p className="text-xs text-slate-400 mt-1">
            View, filter, activate, suspend, or soft-delete platform user accounts.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={loadUsers}
            disabled={loading}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-2 border border-slate-700"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, ID..."
            className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-slate-500 shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 px-3 py-2 focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Suspended">Suspended</option>
            <option value="Deleted">Deleted / Archived</option>
          </select>
        </div>

        {/* Role Filter */}
        <div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 px-3 py-2 focus:outline-none"
          >
            <option value="ALL">All Roles</option>
            <option value="Patient">Patients</option>
            <option value="Caregiver">Caregivers</option>
            <option value="Doctor">Doctors</option>
            <option value="Family Member">Family Members</option>
            <option value="Admin">Admins</option>
          </select>
        </div>

        {/* Sort By */}
        <div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 px-3 py-2 focus:outline-none"
          >
            <option value="createdAt">Newest Registered</option>
            <option value="name">Name (A-Z)</option>
            <option value="lastActive">Recently Active</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-slate-900/90 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 border-b border-slate-800 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              <tr>
                <th className="py-3.5 px-4">User Details</th>
                <th className="py-3.5 px-4">System Role</th>
                <th className="py-3.5 px-4">Account Status</th>
                <th className="py-3.5 px-4">Registered Date</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500 text-xs">
                    No matching users found for selected filters.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-white text-sm">{u.name}</p>
                      <p className="text-[11px] text-slate-400">{u.email}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-800 text-teal-300 border border-slate-700">
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                          u.isDeleted || u.status === 'Deleted'
                            ? 'bg-slate-800 text-slate-400 border border-slate-700'
                            : u.status === 'Suspended'
                            ? 'bg-rose-950/80 text-rose-400 border border-rose-800'
                            : u.status === 'Inactive'
                            ? 'bg-amber-950/80 text-amber-400 border border-amber-800'
                            : 'bg-emerald-950/80 text-emerald-400 border border-emerald-800'
                        }`}
                      >
                        {u.isDeleted ? 'Deleted' : u.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/admin/users/${u.id}`}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
                          title="View Profile Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>

                        {u.status === 'Active' ? (
                          <button
                            onClick={() => setConfirmModal({ open: true, user: u, action: 'suspend' })}
                            className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/60"
                            title="Suspend User"
                          >
                            <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />
                          </button>
                        ) : (
                          <button
                            onClick={() => setConfirmModal({ open: true, user: u, action: 'activate' })}
                            className="p-1.5 rounded-lg bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-800/60"
                            title="Activate User"
                          >
                            <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                          </button>
                        )}

                        {!u.isDeleted ? (
                          <button
                            onClick={() => setConfirmModal({ open: true, user: u, action: 'delete' })}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400 border border-slate-700"
                            title="Soft Delete User"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <button
                            onClick={() => setConfirmModal({ open: true, user: u, action: 'restore' })}
                            className="p-1.5 rounded-lg bg-teal-950/40 hover:bg-teal-900/60 text-teal-300 border border-teal-800/60"
                            title="Restore User"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmModal.open && confirmModal.user && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="text-lg font-extrabold text-white">Confirm User Status Action</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to <strong className="text-teal-400 uppercase">{confirmModal.action}</strong> account for{' '}
              <strong className="text-white">{confirmModal.user.name}</strong> ({confirmModal.user.email})?
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setConfirmModal({ open: false })}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleStatusAction}
                className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow-lg"
              >
                Confirm Action
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
