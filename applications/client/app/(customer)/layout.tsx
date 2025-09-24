import { Header } from "@/components/customer/header"
import { Footer } from "@/components/layout/footer"
import { Navbar } from "@/components/layout/navbar";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="container mx-auto p-6">
        {children}
      </main>
      <Footer />
    </div>
  )
}