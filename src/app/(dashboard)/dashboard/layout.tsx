import { DashboardSidebar } from "./dashboard-sidebar";
import { DashboardHeader } from "./dashboard-header";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardSidebar />

      <div className="lg:pl-64">
        <DashboardHeader />

        <main className="min-h-[calc(100vh-4rem)] p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}