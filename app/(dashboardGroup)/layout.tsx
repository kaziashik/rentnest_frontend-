import { Navbar } from "@/components/shared/navbar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { getMe } from "@/service/getMe";
import { redirect } from "next/navigation";
import DashboardSidebar from "./_components/DashboardSidebar";

const DashboardGroupLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const user = await getMe();
  // console.log("DASHBOARD LAYOUT — user.success:", user.success, user);

  if (!user.success) {
    redirect("/login");
  }

  return (
    // <div>
    //   <Navbar user={user} />

    //   <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
    //     {children}
    //   </main>
    // </div>



       <div className="min-h-screen flex flex-col">
      <Navbar user={user} />
      <SidebarProvider>
        <div className="flex flex-1">
          <DashboardSidebar user={user} />
          <main className="flex-1 min-w-0">
            <div className="border-b px-4 py-2 md:hidden">
              <SidebarTrigger />
            </div>
            <div className="p-4 sm:p-6">
              {children}
            </div>
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default DashboardGroupLayout;