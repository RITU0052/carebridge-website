import { NextRequest, NextResponse } from 'next/server';
import { readDB, writeDB } from '@/lib/db';
import { getAuthenticatedAdmin, recordSecurityLog } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const admin = getAuthenticatedAdmin(req);
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    const { id } = await context.params;
    const db = readDB();
    const user = db.users.find((u) => u.id === id);

    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    // Gather user metadata stats safely
    const userMedicines = (db.medicines || []).filter((m) => m.userId === id);
    const userReports = (db.reports || []).filter((r) => r.userId === id);
    const userVitals = (db.vitals || []).filter((v) => v.userId === id);
    const userContacts = (db.emergencyContacts || []).filter((e) => e.userId === id);
    const userCaregiverRels = (db.caregiverRelationships || []).filter(
      (c) => c.patientUserId === id || c.caregiverEmail === user.email
    );
    const userAIRequests = (db.aiRequests || []).filter((a) => a.userId === id);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        status: user.status || 'Active',
        isDeleted: Boolean(user.isDeleted),
        createdAt: user.createdAt,
        lastLoginAt: user.lastLoginAt || user.createdAt,
        stats: {
          medicinesCount: userMedicines.length,
          reportsCount: userReports.length,
          vitalsCount: userVitals.length,
          emergencyContactsCount: userContacts.length,
          familyProfilesCount: userCaregiverRels.length,
          aiAnalysesCount: userAIRequests.length,
        },
        recentActivity: [
          {
            type: 'Login',
            description: 'User authenticated into mobile/web portal',
            timestamp: user.lastLoginAt || user.createdAt,
          },
          ...(userMedicines.length > 0
            ? [
                {
                  type: 'Medicine Schedule',
                  description: `Configured schedule for ${userMedicines[0].name}`,
                  timestamp: userMedicines[0].createdAt,
                },
              ]
            : []),
          ...(userReports.length > 0
            ? [
                {
                  type: 'Health Report Upload',
                  description: `Uploaded ${userReports[0].fileName}`,
                  timestamp: userReports[0].createdAt,
                },
              ]
            : []),
        ],
      },
    });
  } catch (err) {
    console.error('Fetch user detail error:', err);
    return NextResponse.json({ success: false, error: 'Failed to fetch user details' }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const admin = getAuthenticatedAdmin(req);
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    const { id } = await context.params;
    const body = await req.json();
    const { action } = body; // 'activate' | 'deactivate' | 'suspend' | 'delete' | 'restore'
    const clientIp = req.headers.get('x-forwarded-for') || '127.0.0.1';

    const db = readDB();
    const userIdx = db.users.findIndex((u) => u.id === id);

    if (userIdx === -1) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    const targetUser = db.users[userIdx];

    switch (action) {
      case 'activate':
        targetUser.status = 'Active';
        targetUser.isDeleted = false;
        break;
      case 'deactivate':
        targetUser.status = 'Inactive';
        break;
      case 'suspend':
        targetUser.status = 'Suspended';
        break;
      case 'delete':
        targetUser.isDeleted = true;
        targetUser.status = 'Deleted';
        break;
      case 'restore':
        targetUser.isDeleted = false;
        targetUser.status = 'Active';
        break;
      default:
        return NextResponse.json({ success: false, error: 'Invalid status action' }, { status: 400 });
    }

    db.users[userIdx] = targetUser;
    writeDB(db);

    recordSecurityLog(
      admin.id,
      admin.email,
      `USER_STATUS_CHANGE_${action.toUpperCase()}`,
      `/admin/users/${id}`,
      `Changed user ${targetUser.email} status to ${targetUser.status}`,
      clientIp,
      'Success'
    );

    return NextResponse.json({
      success: true,
      message: `User status updated to ${targetUser.status}`,
      user: targetUser,
    });
  } catch (err) {
    console.error('Update user status error:', err);
    return NextResponse.json({ success: false, error: 'Failed to update user status' }, { status: 500 });
  }
}
