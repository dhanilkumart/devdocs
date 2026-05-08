import { AppShell } from "@/components/layout/AppShell";
import { KeywordModalProvider } from "@/components/keyword/KeywordModalProvider";
import { MobileSidebarProvider } from "@/components/layout/MobileSidebarProvider";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <MobileSidebarProvider>
      <KeywordModalProvider>
        <AppShell>{children}</AppShell>
      </KeywordModalProvider>
    </MobileSidebarProvider>
  );
}
