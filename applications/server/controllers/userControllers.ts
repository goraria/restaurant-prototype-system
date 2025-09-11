import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { clerkConfigClient } from '@/config/clerk';
// import { AuthenticatedRequest } from '@/types/auth';

const prisma = new PrismaClient();

export async function updateUser(
  req: Request,
  res: Response
) {
  const { id } = req.params;
  const data = req.body;

  if (!id) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    await clerkConfigClient.users.updateUser(id, {
      firstName: data.name.split(' ')[0],
      lastName: data.name.split(' ').slice(1).join(' ') || ''
    });

    res.json({ success: true, message: 'User updated successfully in authentication service' });
  } catch (error) {
    return res.status(500).json({ error, message: 'Failed to update user in authentication service' });
  }
}

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

// Get current user profile
export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Get additional user data from database if needed
    const userDetails = await prisma.users.findUnique({
      where: { id: req.user.id },
      include: {
        addresses: true,
        orders: {
          take: 5,
          orderBy: { created_at: 'desc' },
          include: {
            restaurants: {
              select: { name: true, logo_url: true }
            }
          }
        },
        reviews_written: {
          take: 5,
          orderBy: { created_at: 'desc' },
          include: {
            menu_items: {
              select: { name: true, image_url: true }
            }
          }
        }
      }
    });

    res.json({
      success: true,
      user: userDetails
    });
  } catch (error) {
    console.error('Error getting current user:', error);
    res.status(500).json({ error: 'Failed to get user profile' });
  }
};

// Update user profile
export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const {
      first_name,
      last_name,
      phone_number,
      date_of_birth,
      gender
    } = req.body;

    // Update user in database
    const updatedUser = await prisma.users.update({
      where: { id: req.user.id },
      data: {
        first_name,
        last_name,
        full_name: `${first_name} ${last_name}`.trim(),
        phone_number,
        date_of_birth: date_of_birth ? new Date(date_of_birth) : undefined,
        gender,
        updated_at: new Date()
      }
    });

    // Also update in Clerk if needed
    try {
      if (req.user.clerk_id) {
        await clerkConfigClient.users.updateUser(req.user.clerk_id, {
          firstName: first_name,
          lastName: last_name,
          publicMetadata: {
            phone_number,
            date_of_birth,
            gender
          }
        });
      }
    } catch (clerkError) {
      console.error('Error updating Clerk user:', clerkError);
      // Continue even if Clerk update fails
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

// Get user addresses
export const getUserAddresses = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const addresses = await prisma.addresses.findMany({
      where: { user_id: req.user.id },
      orderBy: [
        { is_default: 'desc' },
        { created_at: 'desc' }
      ]
    });

    res.json({
      success: true,
      addresses
    });
  } catch (error) {
    console.error('Error getting user addresses:', error);
    res.status(500).json({ error: 'Failed to get addresses' });
  }
};

// Add new address
export const addUserAddress = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const {
      recipient_name,
      recipient_phone,
      street_address,
      ward,
      district,
      city,
      country = 'Vietnam',
      is_default = false
    } = req.body;

    // If this is being set as default, unset other defaults
    if (is_default) {
      await prisma.addresses.updateMany({
        where: { user_id: req.user.id },
        data: { is_default: false }
      });
    }

    const newAddress = await prisma.addresses.create({
      data: {
        user_id: req.user.id,
        recipient_name,
        recipient_phone,
        street_address,
        ward,
        district,
        city,
        country,
        is_default
      }
    });

    res.json({
      success: true,
      message: 'Address added successfully',
      address: newAddress
    });
  } catch (error) {
    console.error('Error adding address:', error);
    res.status(500).json({ error: 'Failed to add address' });
  }
};

// Update address
export const updateUserAddress = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { id } = req.params;
    const {
      recipient_name,
      recipient_phone,
      street_address,
      ward,
      district,
      city,
      country,
      is_default
    } = req.body;

    // Check if address belongs to user
    const existingAddress = await prisma.addresses.findFirst({
      where: { id, user_id: req.user.id }
    });

    if (!existingAddress) {
      return res.status(404).json({ error: 'Address not found' });
    }

    // If this is being set as default, unset other defaults
    if (is_default) {
      await prisma.addresses.updateMany({
        where: { user_id: req.user.id, id: { not: id } },
        data: { is_default: false }
      });
    }

    const updatedAddress = await prisma.addresses.update({
      where: { id },
      data: {
        recipient_name,
        recipient_phone,
        street_address,
        ward,
        district,
        city,
        country,
        is_default,
        updated_at: new Date()
      }
    });

    res.json({
      success: true,
      message: 'Address updated successfully',
      address: updatedAddress
    });
  } catch (error) {
    console.error('Error updating address:', error);
    res.status(500).json({ error: 'Failed to update address' });
  }
};

// Delete address
export const deleteUserAddress = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { id } = req.params;

    // Check if address belongs to user
    const existingAddress = await prisma.addresses.findFirst({
      where: { id, user_id: req.user.id }
    });

    if (!existingAddress) {
      return res.status(404).json({ error: 'Address not found' });
    }

    await prisma.addresses.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Address deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting address:', error);
    res.status(500).json({ error: 'Failed to delete address' });
  }
};

// Get user order history
export const getUserOrders = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { page = 1, limit = 10, status } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = { customer_id: req.user.id };
    if (status && status !== 'all') {
      where.status = status;
    }

    const [orders, total] = await Promise.all([
      prisma.orders.findMany({
        where,
        include: {
          restaurants: {
            select: {
              id: true,
              name: true,
              logo_url: true,
              address: true,
              phone_number: true
            }
          },
          addresses: true,
          order_items: {
            include: {
              menu_items: {
                select: {
                  name: true,
                  image_url: true,
                  price: true
                }
              }
            }
          },
          payments: {
            select: {
              id: true,
              amount: true,
              status: true,
              method: true,
              created_at: true
            }
          }
        },
        orderBy: { created_at: 'desc' },
        skip,
        take: Number(limit)
      }),
      prisma.orders.count({ where })
    ]);

    res.json({
      success: true,
      orders,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Error getting user orders:', error);
    res.status(500).json({ error: 'Failed to get order history' });
  }
};

// Get user statistics
export const getUserStatistics = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const stats = await prisma.user_statistics.findUnique({
      where: { user_id: req.user.id }
    });

    // If no stats exist, create them
    if (!stats) {
      const newStats = await prisma.user_statistics.create({
        data: {
          user_id: req.user.id,
          total_orders: 0,
          total_spent: 0,
          last_order_date: null
        }
      });

      return res.json({
        success: true,
        statistics: newStats
      });
    }

    res.json({
      success: true,
      statistics: stats
    });
  } catch (error) {
    console.error('Error getting user statistics:', error);
    res.status(500).json({ error: 'Failed to get user statistics' });
  }
};

// Admin only: Delete user by ID
export const deleteUserController = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Check if user exists
    const existingUser = await prisma.users.findUnique({
      where: { id: id }
    });

    if (!existingUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Delete user from database
    await prisma.users.delete({
      where: { id: id }
    });

    // Also delete from Clerk if clerk_id exists
    try {
      if (existingUser.clerk_id) {
        await clerkConfigClient.users.deleteUser(existingUser.clerk_id);
      }
    } catch (clerkError) {
      console.error('Error deleting Clerk user:', clerkError);
      // Continue even if Clerk deletion fails
    }

    res.json({
      success: true,
      message: 'User deleted successfully',
      deletedUser: {
        id: existingUser.id,
        email: existingUser.email,
        first_name: existingUser.first_name,
        last_name: existingUser.last_name
      }
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
};
