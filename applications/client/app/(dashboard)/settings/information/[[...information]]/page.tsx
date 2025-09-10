"use client"

import { UserProfile } from "@clerk/nextjs";
import { useClerkTheme } from '@/hooks/use-clerk-theme';
import { Skeleton } from "@/components/ui/skeleton";

export default function InformationPage() {
  const { mounted, clerkBaseTheme } = useClerkTheme();

  return (
    <div className="w-full">
      {mounted ? (
        <>
          <UserProfile
            path="/settings/information"
            routing="path"
            appearance={{
              baseTheme: clerkBaseTheme,
              elements: {
                rootBox: {
                  display: "flex",
                  width: "100%",
                },
                cardBox: {
                  display: "flex",
                  width: "100%",
                  height: "calc(100vh - 116px - 48px - 1px)", // 56px (navbar) + 60px (footer) + 32px (padding`) + 1px (border)
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
        </>
      ) : (
        <>
          <div className="animate-pulse">
            <Skeleton className="w-full h-[(100vh - 116px - 48px - 1px)] bg-gray-200 rounded-lg"/>
          </div>
        </>
      )}
    </div>
  );
}
