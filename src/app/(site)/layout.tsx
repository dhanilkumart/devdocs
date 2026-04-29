import { AppShell } from "@/components/layout/AppShell";
import { MobileSidebarProvider } from "@/components/layout/MobileSidebarProvider";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <MobileSidebarProvider>
      <AppShell>{children}</AppShell>
    </MobileSidebarProvider>
  );
}
