import { AuthBrandPanel } from "@/components/layout/auth-brand-panel"

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex min-h-screen">
      <AuthBrandPanel />
      <div className="flex w-full flex-1 items-center justify-center bg-white px-4 py-12 lg:w-[60%]">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  )
}
