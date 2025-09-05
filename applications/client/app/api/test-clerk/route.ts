import { NextResponse } from 'next/server';
import { clerkClient } from '@clerk/nextjs/server';

export async function GET() {
  try {
    const clerk = await clerkClient();
    const organizations = await clerk.organizations.getOrganizationList({
      limit: 10
    });

    return NextResponse.json({
      success: true,
      count: organizations.totalCount,
      organizations: organizations.data.map(org => ({
        id: org.id,
        name: org.name,
        slug: org.slug,
        membersCount: org.membersCount,
        createdAt: org.createdAt
      }))
    });
  } catch (error) {
    console.error('❌ Clerk Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
