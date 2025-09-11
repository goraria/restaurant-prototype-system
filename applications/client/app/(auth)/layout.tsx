export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="bg-muted flex w-full h-screen flex-1 items-center justify-center p-6 md:p-10">
    {/* <div className="flex justify-center items-center min-h-screen flex-col"> */}
      {children}
    </div>
  )
}