"use client"

import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";
import { UserProfile } from "@clerk/nextjs";

export default function InformationPage() {
  const { theme } = useTheme();
  return (
    <div className="w-full">
      <UserProfile
        path="/settings/information"
        routing="path"
        appearance={{
          baseTheme: theme === "dark" ? dark : undefined,
          elements: {
            rootBox: {
              display: "flex",
              width: "100%",
            },
            cardBox: {
              display: "flex",
              width: "100%",
              height: "calc(100vh - 116px - 32px - 1px)", // 56px (navbar) + 60px (footer) + 32px (padding`) + 1px (border)
              background: "transparent",
              border: "0",
              padding: "0",
            },
          },
        }}
      >
        {/* Custom page rendered at /settings/information/custom */}
        {/* <UserProfile.Page label="Information" labelIcon={<Dot />} url="custom">
          <div className="space-y-4">
            <h2 className="text-lg font-medium">Your information</h2>
            <p className="text-sm text-muted-foreground">
              Manage your custom profile information here.
            </p>
            <div className="rounded-md border p-4">
              <p className="text-sm">This is a custom profile page content area.</p>
            </div>
          </div>
        </UserProfile.Page> */}
      </UserProfile>
    </div>
  );
}
