"use client"

import { useEffect } from "react"
import { useTheme } from "next-themes"
import updateClerkOption from "@clerk/nextjs"
import { dark } from "@clerk/themes"

export function ClerkThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme()

//   useEffect(() => {
//     updateClerkOption({
//       appearance: {
//         baseTheme: theme === "dark" ? dark : undefined,
//       },
//     })
//   }, [theme])

  return null
}