"use client";
import Menu from "@/layouts/menus";
import useGetSession from "@/hook/useGetSeesion";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AppProvider } from "@/context/app.context";
import Footer from "@/layouts/footer";
import AppHeader from "@/layouts/header";

const Layout = ({ children }) => {
  const { user, checking } = useGetSession();
  const router = useRouter();
  const pathName = usePathname();

  useEffect(() => {
    if (checking) return;
    if (!user?.id) {
      router.push("/");
    }
    if (user?.roleId > 4 && pathName !== "/users/overview") {
      router.push("/");
    }
  }, [checking, user]);

  return (
    <AppProvider>
      <div className="w-screen h-screen flex bg-white overflow-hidden">
        <Menu />
        <div className="flex flex-col flex-1 h-full overflow-y-auto min-h-0">
          <AppHeader />
          <div className="flex-1 flex flex-col w-full">
            {children}
          </div>
          <Footer />
        </div>
      </div>
    </AppProvider>
  );
};
export default Layout;
