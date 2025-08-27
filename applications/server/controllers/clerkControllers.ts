import { Request, Response } from "express";
import { clerkConfigClient } from "@/config/clerk";

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

export function webhookHandler() {
  
}
