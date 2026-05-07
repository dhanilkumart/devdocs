import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { MobileNav } from "@/components/layout/MobileNav";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-zinc-950 lg:h-screen lg:max-h-screen lg:overflow-hidden">
      <Header />
      <div className="mx-auto flex w-full max-w-7xl flex-1 min-h-0 flex-col gap-0 px-4 pb-safe-nav pt-6 sm:px-6 lg:flex-row lg:overflow-hidden lg:px-0 lg:pb-6 lg:pr-6 lg:pt-6">
        <aside
          className="sidebar-scrollbar hidden min-h-0 w-56 shrink-0 overflow-y-auto overscroll-y-contain border-r border-zinc-200 pl-4 pr-0 lg:block dark:border-zinc-800"
          aria-label="Documentation navigation"
        >
          <Sidebar />
        </aside>
        <main className="min-h-0 min-w-0 flex-1 overflow-y-auto px-0 lg:px-6">{children}</main>
      </div>
      <MobileNav />
    </div>
  );
}
