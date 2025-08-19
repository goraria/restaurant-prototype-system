import type { Metadata } from "next";
import type { ReactNode } from "react";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import { viVN } from '@clerk/localizations'
import { ClerkSignIn, ClerkSignUp } from "@/components/elements/clerk-buttons";
import { dark, neobrutalism } from "@clerk/themes";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/layout/providers";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { ToasterProvider } from "@/components/layout/toaster-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Waddles",
  description: "Design and Develop by Japtor",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {/*<html lang="en">*/}
      {/*<body*/}
      {/*  className={`${geistSans.variable} ${geistMono.variable} antialiased`}*/}
      {/*>*/}
      {/*{children}*/}
      {/*</body>*/}
      {/*</html>*/}
      <ClerkProvider
        appearance={{
          // baseTheme: [dark],
          // variables: {
          //   colorPrimary: "white",
          //   colorBackground: "white",
          // },
          signIn: {},
          signUp: {},
        }}
        localization={viVN}
      >
        <html lang="en" suppressHydrationWarning>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <ToasterProvider />
          </ThemeProvider>
        </Providers>
        </body>
        </html>
      </ClerkProvider>
    </>
  );
}
export function RootLayouts({
                                     children,
                                   }: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
    <body
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
    <Providers>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
        {/* <QuickSetting
              className="absolute top-5 right-5"
            />
            <ModeToggle
              className="absolute top-5 right-5"
            /> */}

            <header className="flex justify-end items-center p-4 gap-4 h-16">
              <SignedOut>
                <ClerkSignIn label="Sign in" buttonProps={{ variant: "ghost" }} />
                <ClerkSignUp
                  label="Sign Up"
                  buttonProps={{
                    className:
                      "bg-[#6c47ff] text-ceramic-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5",
                  }}
                />
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </header>
        <ToasterProvider />
      </ThemeProvider>
    </Providers>
    </body>
    </html>
  );
}