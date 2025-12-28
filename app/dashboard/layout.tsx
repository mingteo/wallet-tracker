import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-background-dark text-text-primary">
      <Sidebar />
      <Header userEmail={user.email} />
      <main className="lg:pl-64 pt-6 px-6 pb-20 max-w-7xl mx-auto">
        {children}
      </main>
    </div>
  );
}
