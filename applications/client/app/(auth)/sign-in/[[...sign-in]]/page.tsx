"use client"

import { useTheme } from 'next-themes';
import { SignIn } from '@clerk/nextjs'
import { dark } from '@clerk/themes';

export default function SignInPage() {
  const { theme } = useTheme();

  return (
    <div className="bg-muted flex w-full h-screen flex-1 items-center justify-center p-6 md:p-10">
      <SignIn 
        appearance={{
          baseTheme: theme === "dark" ? dark : undefined,
          elements: {
            rootBox: {},
            cardBox: {
            },
            headerTitle: {
              
            }
          },
        }}

      />
    </div>
  )
}
