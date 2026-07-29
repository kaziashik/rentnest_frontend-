import { Navbar } from "@/components/shared/navbar";
import { getMe } from "@/service/getMe";
import { redirect } from "next/navigation";

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
    <div>
      <Navbar user={user} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
    </div>
  );
};

export default DashboardGroupLayout;