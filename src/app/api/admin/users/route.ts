import { NextRequest, NextResponse } from 'next/server';
import { readDB } from '@/lib/db';
import { getAuthenticatedAdmin } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const admin = getAuthenticatedAdmin(req);
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const search = (searchParams.get('search') || '').toLowerCase();
    const status = searchParams.get('status') || 'ALL'; // ALL, Active, Inactive, Suspended, Deleted
    const role = searchParams.get('role') || 'ALL';
    const sortBy = searchParams.get('sortBy') || 'createdAt';

    const db = readDB();
    let users = [...db.users];

    // Search filter
    if (search) {
      users = users.filter(
        (u) =>
          u.name.toLowerCase().includes(search) ||
          u.email.toLowerCase().includes(search) ||
          u.id.toLowerCase().includes(search)
      );
    }

    // Status filter
    if (status !== 'ALL') {
      if (status === 'Deleted') {
        users = users.filter((u) => u.isDeleted);
      } else {
        users = users.filter((u) => !u.isDeleted && (u.status === status || (!u.status && status === 'Active')));
      }
    } else {
      // By default exclude soft deleted unless status === 'Deleted' or specifically queried
      users = users.filter((u) => !u.isDeleted);
    }

    // Role filter
    if (role !== 'ALL') {
      users = users.filter((u) => u.role === role);
    }

    // Sort
    users.sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'lastActive') return (b.lastLoginAt || b.createdAt).localeCompare(a.lastLoginAt || a.createdAt);
      return b.createdAt.localeCompare(a.createdAt);
    });

    return NextResponse.json({
      success: true,
      count: users.length,
      users: users.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        isVerified: u.isVerified,
        status: u.status || 'Active',
        isDeleted: Boolean(u.isDeleted),
        lastLoginAt: u.lastLoginAt || u.createdAt,
        createdAt: u.createdAt,
      })),
    });
  } catch (err) {
    console.error('Admin fetch users error:', err);
    return NextResponse.json({ success: false, error: 'Failed to fetch users' }, { status: 500 });
  }
}
