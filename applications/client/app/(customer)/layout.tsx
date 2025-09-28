import { Header } from "@/components/customer/header"
import { Footer } from "@/components/layout/footer"
import { Navbar } from "@/components/layout/navbar";
import React from "react";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navbar />
      <main className="flex flex-1 flex-col">
        <div className="flex flex-1 flex-col">
          <div className="container mx-auto p-6">
            {children}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}