import { Sidebar } from "@/components/layout/Sidebar";
import { BottomNav } from "@/components/layout/BottomNav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <Sidebar />
      <main className="pb-20 md:ml-64 md:pb-0">{children}</main>
      <BottomNav />
    </div>
  );
}
