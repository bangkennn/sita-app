import { AuthBrandPanel } from "@/components/layout/auth-brand-panel"

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex min-h-screen">
      <div className="hidden w-1/2 lg:block">
        <AuthBrandPanel />
      </div>
      <div className="flex w-full flex-1 items-center justify-center bg-slate-50 px-4 py-12 lg:w-1/2">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  )
}
