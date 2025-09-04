import { Request, Response } from "express";
import { clerkConfigClient } from "@/config/clerk";
import { PrismaClient } from "@prisma/client";
import { Webhook } from "svix";

const prisma = new PrismaClient();

// Webhook handler for Clerk events
export const webhookHandler = async (req: Request, res: Response) => {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env');
  }

  // Get the headers
  const headerPayload = req.headers;
  const svix_id = headerPayload['svix-id'] as string;
  const svix_timestamp = headerPayload['svix-timestamp'] as string;
  const svix_signature = headerPayload['svix-signature'] as string;

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return res.status(400).json({
      success: false,
      message: 'Error occurred -- no svix headers',
    });
  }

  // Get the body
  const payload = req.body;
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: any;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    });
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return res.status(400).json({
      success: false,
      message: 'Error occurred while verifying webhook',
    });
  }

  // Handle the webhook
  const eventType = evt.type;
  console.log('Webhook received:', eventType);

  try {
    switch (eventType) {
      case 'user.created':
        await handleUserCreated(evt.data);
        break;
      case 'user.updated':
        await handleUserUpdated(evt.data);
        break;
      case 'user.deleted':
        await handleUserDeleted(evt.data);
        break;
      default:
        console.log('Unhandled event type:', eventType);
    }

    return res.status(200).json({
      success: true,
      message: 'Webhook received',
    });
  } catch (error) {
    console.error('Error handling webhook:', error);
    return res.status(500).json({
      success: false,
      message: 'Error handling webhook',
    });
  }
};

// Handle user created event
async function handleUserCreated(userData: any) {
  console.log('Creating user:', userData.id);
  
  const emailAddresses = userData.email_addresses || [];
  const primaryEmail = emailAddresses.find((email: any) => email.id === userData.primary_email_address_id);
  
  if (!primaryEmail) {
    console.error('No primary email found for user:', userData.id);
    return;
  }

  const phoneNumbers = userData.phone_numbers || [];
  const primaryPhone = phoneNumbers.find((phone: any) => phone.id === userData.primary_phone_number_id);

  try {
    await prisma.users.create({
      data: {
        clerk_id: userData.id,
        username: userData.username || `user_${userData.id.slice(-8)}`,
        email: primaryEmail.email_address,
        phone_number: primaryPhone?.phone_number || null,
        first_name: userData.first_name || '',
        last_name: userData.last_name || '',
        full_name: `${userData.first_name || ''} ${userData.last_name || ''}`.trim(),
        avatar_url: userData.image_url || userData.profile_image_url || null,
        email_verified_at: primaryEmail.verification?.status === 'verified' ? new Date() : null,
        phone_verified_at: primaryPhone?.verification?.status === 'verified' ? new Date() : null,
        status: 'active',
        role: 'customer',
      },
    });
    console.log('User created successfully in database');
  } catch (error) {
    console.error('Error creating user in database:', error);
  }
}

// Handle user updated event
async function handleUserUpdated(userData: any) {
  console.log('Updating user:', userData.id);
  
  const emailAddresses = userData.email_addresses || [];
  const primaryEmail = emailAddresses.find((email: any) => email.id === userData.primary_email_address_id);
  
  const phoneNumbers = userData.phone_numbers || [];
  const primaryPhone = phoneNumbers.find((phone: any) => phone.id === userData.primary_phone_number_id);

  try {
    await prisma.users.update({
      where: { clerk_id: userData.id },
      data: {
        username: userData.username || undefined,
        email: primaryEmail?.email_address || undefined,
        phone_number: primaryPhone?.phone_number || null,
        first_name: userData.first_name || '',
        last_name: userData.last_name || '',
        full_name: `${userData.first_name || ''} ${userData.last_name || ''}`.trim(),
        avatar_url: userData.image_url || userData.profile_image_url || null,
        email_verified_at: primaryEmail?.verification?.status === 'verified' ? new Date() : null,
        phone_verified_at: primaryPhone?.verification?.status === 'verified' ? new Date() : null,
        updated_at: new Date(),
      },
    });
    console.log('User updated successfully in database');
  } catch (error) {
    console.error('Error updating user in database:', error);
  }
}

// Handle user deleted event
async function handleUserDeleted(userData: any) {
  console.log('Deleting user:', userData.id);
  
  try {
    await prisma.users.update({
      where: { clerk_id: userData.id },
      data: {
        status: 'inactive',
        updated_at: new Date(),
      },
    });
    console.log('User marked as inactive in database');
  } catch (error) {
    console.error('Error deleting user in database:', error);
  }
}

export const updateUser = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;
  const { userData } = req.body;

  try {
    const user = await clerkConfigClient.users.updateUser(id, {
      publicMetadata: {
        ...userData,
      }
    });

    res.json({
      message: "User updated successfully",
      user
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Failed to update user" });
  }
}

// Get current user info
export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    res.json({
      success: true,
      user: req.user
    });
  } catch (error) {
    console.error("Error getting current user:", error);
    res.status(500).json({ error: "Failed to get user info" });
  }
};

// Sync user with Clerk (manual sync)
export const syncUserWithClerk = async (req: Request, res: Response) => {
  try {
    const { clerk_id } = req.params;

    // Get user from Clerk
    const clerkUser = await clerkConfigClient.users.getUser(clerk_id);
    
    // Update user in database
    await handleUserUpdated(clerkUser);

    res.json({
      success: true,
      message: "User synced successfully"
    });
  } catch (error) {
    console.error("Error syncing user:", error);
    res.status(500).json({ error: "Failed to sync user" });
  }
};
