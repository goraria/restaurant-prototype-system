"use client"

import React from "react"
import { SignInButton, SignUpButton } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export type ShadButtonProps = React.ComponentProps<typeof Button>
export type ClerkSignInProps = React.ComponentProps<typeof SignInButton>
export type ClerkSignUpProps = React.ComponentProps<typeof SignUpButton>

interface BaseProps {
  label?: React.ReactNode
  className?: string
}

export function ClerkSignIn({
  label = "Sign in",
  className,
  appearance,
  children,
  ...clerkProps
}: BaseProps & ClerkSignInProps & { buttonProps?: ShadButtonProps }) {
  const { buttonProps } = clerkProps as { buttonProps?: ShadButtonProps }
  // Remove buttonProps so it doesn't get forwarded to Clerk
  const { buttonProps: _omit, ...rest } = clerkProps as Record<string, any>

  return (
    <SignInButton appearance={appearance} {...rest}>
      <Button {...buttonProps} className={cn(className, buttonProps?.className)}>
        {children ?? label}
      </Button>
    </SignInButton>
  )
}

export function ClerkSignUp({
  label = "Sign up",
  className,
  appearance,
  children,
  ...clerkProps
}: BaseProps & ClerkSignUpProps & { buttonProps?: ShadButtonProps }) {
  const { buttonProps } = clerkProps as { buttonProps?: ShadButtonProps }
  const { buttonProps: _omit, ...rest } = clerkProps as Record<string, any>

  return (
    <SignUpButton appearance={appearance} {...rest}>
      <Button {...buttonProps} className={cn(className, buttonProps?.className)}>
        {children ?? label}
      </Button>
    </SignUpButton>
  )
}

