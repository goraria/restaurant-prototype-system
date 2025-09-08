import { Request, Response } from 'express';
import { clerkConfigClient } from '@/config/clerk';
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { AuthenticatedRequest } from '@/types/auth';
import { publishRealtimeUpdate } from '@/config/realtime';

const prisma = new PrismaClient();

// ================================
// 🏢 ORGANIZATION CRUD CONTROLLERS
// ================================

/**
 * Get organizations for current user or specific organization
 * GET /organizations or GET /organizations?id=org_id
 */
export const getOrganizations = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.clerk_id;
    const orgId = req.query.id as string;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
      return;
    }

    if (orgId) {
      // Get specific organization
      try {
        const clerkOrg = await clerkConfigClient.organizations.getOrganization({
          organizationId: orgId
        });

        // Get from local database
        const dbOrg = await prisma.organizations.findUnique({
          where: { clerk_org_id: orgId },
          include: {
            owner: {
              select: {
                id: true,
                username: true,
                email: true,
                full_name: true,
                avatar_url: true
              }
            },
            restaurants: {
              select: {
                id: true,
                name: true,
                address: true,
                phone_number: true,
                status: true
              }
            }
          }
        });

        res.json({
          success: true,
          data: {
            clerk: clerkOrg,
            database: dbOrg
          }
        });
      } catch (error) {
        res.status(404).json({
          success: false,
          message: 'Organization not found'
        });
      }
    } else {
      // Get user's organizations
      const clerkOrgs = await clerkConfigClient.users.getOrganizationMembershipList({
        userId: userId
      });

      // Get from local database
      const clerkOrgIds = clerkOrgs.data.map(membership => membership.organization.id);
      const dbOrgs = await prisma.organizations.findMany({
        where: {
          clerk_org_id: {
            in: clerkOrgIds
          }
        },
        include: {
          owner: {
            select: {
              id: true,
              username: true,
              email: true,
              full_name: true,
              avatar_url: true
            }
          },
          restaurants: {
            select: {
              id: true,
              name: true,
              address: true,
              phone_number: true,
              status: true
            }
          }
        }
      });

      res.json({
        success: true,
        data: {
          clerk: clerkOrgs.data,
          database: dbOrgs
        }
      });
    }
  } catch (error) {
    console.error('❌ Error fetching organizations:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to fetch organizations'
    });
  }
};

/**
 * Create new organization
 * POST /organizations
 */
export const createOrganization = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.clerk_id;
    const dbUserId = req.user?.id;
    const { name, slug, description, publicMetadata = {}, privateMetadata = {} } = req.body;

    if (!userId || !dbUserId) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
      return;
    }

    if (!name) {
      res.status(400).json({
        success: false,
        message: 'Organization name is required'
      });
      return;
    }

    // Add description to metadata
    const enhancedPublicMetadata = {
      ...publicMetadata,
      description: description || publicMetadata.description
    };

    // 1. Create organization in Clerk
    const clerkOrg = await clerkConfigClient.organizations.createOrganization({
      name,
      slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
      createdBy: userId,
      publicMetadata: enhancedPublicMetadata,
      privateMetadata
    });

    // 2. Create organization in local database
    const orgId = uuidv4();
    const dbOrg = await prisma.organizations.create({
      data: {
        id: orgId,
        clerk_org_id: clerkOrg.id,
        name: clerkOrg.name,
        code: clerkOrg.slug || generateOrgCode(),
        description: description || enhancedPublicMetadata.description || null,
        logo_url: clerkOrg.imageUrl || null,
        owner_id: dbUserId,
        status: 'active',
        metadata: enhancedPublicMetadata
      },
      include: {
        owner: {
          select: {
            id: true,
            username: true,
            email: true,
            full_name: true,
            avatar_url: true
          }
        }
      }
    });

    console.log(`✅ Organization created: ${clerkOrg.name} (${clerkOrg.id})`);

    // 🔄 Real-time broadcast
    publishRealtimeUpdate('organization.created', {
      event: 'ORGANIZATION_CREATED',
      organization: dbOrg,
      clerk_org_id: clerkOrg.id,
      owner_id: dbUserId
    });

    res.status(201).json({
      success: true,
      message: 'Organization created successfully',
      data: {
        clerk: clerkOrg,
        database: dbOrg
      }
    });
  } catch (error) {
    console.error('❌ Error creating organization:', error);
    
    // Try to cleanup if partial creation occurred
    if (error instanceof Error && error.message.includes('clerk_org_id')) {
      // Database failed, try to cleanup Clerk org
      // This would require storing the clerk org ID, but it's complex in error handling
    }
    
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to create organization'
    });
  }
};

/**
 * Update organization
 * PUT /organizations/:id
 */
export const updateOrganization = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.clerk_id;
    const organizationId = req.params.id;
    const { name, slug, description, publicMetadata = {}, privateMetadata = {} } = req.body;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
      return;
    }

    if (!organizationId) {
      res.status(400).json({
        success: false,
        message: 'Organization ID is required'
      });
      return;
    }

    // Check if user has permission to update this organization
    try {
      const membershipList = await clerkConfigClient.organizations.getOrganizationMembershipList({
        organizationId
      });
      const membership = membershipList.data.find(m => m.publicUserData?.userId === userId);

      if (!membership || (membership.role !== 'org:admin' && membership.role !== 'org:member')) {
        res.status(403).json({
          success: false,
          message: 'Insufficient permissions'
        });
        return;
      }
    } catch (error) {
      res.status(404).json({
        success: false,
        message: 'Organization membership not found'
      });
      return;
    }

    // Add description to metadata
    const enhancedPublicMetadata = {
      ...publicMetadata,
      description: description || publicMetadata.description
    };

    // 1. Update organization in Clerk
    const clerkOrg = await clerkConfigClient.organizations.updateOrganization(
      organizationId,
      {
        name,
        slug,
        publicMetadata: enhancedPublicMetadata,
        privateMetadata
      }
    );

    // 2. Update organization in local database
    const dbOrg = await prisma.organizations.update({
      where: { clerk_org_id: organizationId },
      data: {
        name: clerkOrg.name,
        code: clerkOrg.slug || generateOrgCode(),
        description: description || enhancedPublicMetadata.description || null,
        logo_url: clerkOrg.imageUrl || null,
        metadata: enhancedPublicMetadata,
        updated_at: new Date()
      },
      include: {
        owner: {
          select: {
            id: true,
            username: true,
            email: true,
            full_name: true,
            avatar_url: true
          }
        },
        restaurants: {
          select: {
            id: true,
            name: true,
            address: true,
            phone_number: true,
            status: true
          }
        }
      }
    });

    console.log(`✅ Organization updated: ${clerkOrg.name} (${clerkOrg.id})`);

    // 🔄 Real-time broadcast
    publishRealtimeUpdate('organization.updated', {
      event: 'ORGANIZATION_UPDATED',
      organization: dbOrg,
      clerk_org_id: clerkOrg.id,
      changes: {
        name: name !== undefined,
        slug: slug !== undefined,
        description: description !== undefined
      }
    });

    res.json({
      success: true,
      message: 'Organization updated successfully',
      data: {
        clerk: clerkOrg,
        database: dbOrg
      }
    });
  } catch (error) {
    console.error('❌ Error updating organization:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to update organization'
    });
  }
};

/**
 * Delete organization
 * DELETE /organizations/:id
 */
export const deleteOrganization = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.clerk_id;
    const organizationId = req.params.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
      return;
    }

    if (!organizationId) {
      res.status(400).json({
        success: false,
        message: 'Organization ID is required'
      });
      return;
    }

    // Check if user is admin of this organization
    try {
      const membershipList = await clerkConfigClient.organizations.getOrganizationMembershipList({
        organizationId
      });
      const membership = membershipList.data.find(m => m.publicUserData?.userId === userId);

      if (!membership || membership.role !== 'org:admin') {
        res.status(403).json({
          success: false,
          message: 'Only organization admins can delete organizations'
        });
        return;
      }
    } catch (error) {
      res.status(404).json({
        success: false,
        message: 'Organization membership not found'
      });
      return;
    }

    // 1. Get organization data before deletion
    const dbOrg = await prisma.organizations.findUnique({
      where: { clerk_org_id: organizationId },
      include: {
        owner: {
          select: {
            id: true,
            username: true,
            email: true,
            full_name: true
          }
        },
        restaurants: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    if (!dbOrg) {
      res.status(404).json({
        success: false,
        message: 'Organization not found in database'
      });
      return;
    }

    // 2. Delete organization from Clerk
    await clerkConfigClient.organizations.deleteOrganization({
      organizationId
    });

    // 3. Soft delete in database
    const deletedOrg = await prisma.organizations.update({
      where: { clerk_org_id: organizationId },
      data: {
        status: 'deleted',
        clerk_org_id: null, // Remove Clerk association
        updated_at: new Date()
      },
      include: {
        owner: {
          select: {
            id: true,
            username: true,
            email: true,
            full_name: true
          }
        }
      }
    });

    console.log(`✅ Organization deleted: ${dbOrg.name} (${organizationId})`);

    // 🔄 Real-time broadcast
    publishRealtimeUpdate('organization.deleted', {
      event: 'ORGANIZATION_DELETED',
      organization: deletedOrg,
      original_clerk_org_id: organizationId,
      status: 'deleted'
    });

    res.json({
      success: true,
      message: 'Organization deleted successfully',
      data: {
        deleted_organization: deletedOrg
      }
    });
  } catch (error) {
    console.error('❌ Error deleting organization:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to delete organization'
    });
  }
};

// ================================
// 🔧 HELPER FUNCTIONS
// ================================

/**
 * Generate organization code if slug is not provided
 */
function generateOrgCode(): string {
  return `org_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
}
