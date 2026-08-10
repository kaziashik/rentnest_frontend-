import { Navbar } from "@/components/shared/navbar";
import { getMe } from "@/service/getMe";
import { redirect } from "next/navigation";
import DashboardSidebar from "./_components/DashboardSidebar";
import { DashboardMobileNav } from "./_components/DashboardMobileNav";

const DashboardGroupLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const user = await getMe();

  if (!user.success) {
    redirect("/login");
  }

  return (
    <div className="flex flex-col">
      {/* Full-width top */}
      <Navbar user={user} />

      {/* Sidebar sits only between navbar and footer */}
      <div className="flex w-full items-stretch">
        <DashboardSidebar user={user} />
        <main className="min-w-0 flex-1">
          <DashboardMobileNav user={user} />
          <div className="p-4 sm:p-6">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default DashboardGroupLayout;
