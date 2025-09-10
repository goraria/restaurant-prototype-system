"use client"

import { SignIn } from '@clerk/nextjs'
import { useClerkTheme } from '@/hooks/use-clerk-theme';
import { Skeleton } from '@/components/ui/skeleton';

export default function SignInPage() {
  const { mounted, clerkBaseTheme } = useClerkTheme();

  return (
    <>
      {mounted ? (
        <>
          <SignIn
            appearance={{
              baseTheme: clerkBaseTheme,
              elements: {
                rootBox: {},
                cardBox: "bg-card text-card-foreground flex flex-col rounded-xl border !shadow-sm",
                headerTitle: {

                },
                formButtonPrimary: "!bg-foreground !inset-none",
                footer: "!bg-card",
              },
            }}
          />
        </>
      ) : (
        <>
          <div className="flex flex-col">
            <Skeleton className="w-[400px] h-[550px] bg-gray-200 rounded-lg"/>
          </div>
        </>
      )}
    </>
  )
}
