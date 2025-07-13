"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useProfile } from "@/context/page";
import { useRouter } from "next/navigation"; // ✅ Correct for app router
import Link from "next/link";

interface SidebarProps {
    sidebarOpen: boolean;
    setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>> // ⬅️ Add this prop to control sidebar state
}

export default function Sidebar({ sidebarOpen,setSidebarOpen }: SidebarProps) {
    const [isMobile, setIsMobile] = useState(false);
    const { user, refetch } = useProfile(); // ⬅ include refetch if you want to refresh user state
    const router = useRouter();

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 1024);
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");     // 🔐 Remove token
        refetch();                            // 🔄 Reset user context (optional)
        router.push("/auth/login");           // 🔁 Redirect to login
    };

    return (
        <motion.aside
            initial={{ x: -300 }}
            animate={{ x: sidebarOpen || !isMobile ? 0 : -300 }}
            transition={{ type: "spring", stiffness: 200, damping: 30 }}
            className={cn(
                "bg-white text-zinc-900 px-6 py-8 shadow-md z-30 absolute md:relative top-0 left-0 h-screen md:w-[24%] lg:w-[18%] w-full space-y-10",
                isMobile && !sidebarOpen && "hidden"
            )}
        >
            <div className="flex w-full items-center justify-between mb-8">
                <Link href={'/'} className="text-2xl font-bold mb-8">Dashboard Inc.</Link>
                <button className="flex items-center justify-center -mt-6 " onClick={()=>setSidebarOpen(!sidebarOpen)}> <i className={`fi fi-rr-angle-double-${sidebarOpen?"left":"right"}`}></i></button>
            </div>

            <nav className="space-y-10 text-sm">
                <div className="space-y-4">
                    <p className="uppercase text-muted-foreground text-xs mb-4">Dashboard</p>
                    <a href="#analytics" className="flex items-center gap-3 hover:text-primary">
                        <i className="fi fi-rr-chart-line-up"></i>
                        Analytics
                    </a>
                    <a href="#products" className="flex items-center gap-3 hover:text-primary">
                        <i className="fi fi-rr-box"></i>
                        Products
                    </a>
                </div>

                <div className="space-y-4">
                    <p className="uppercase text-muted-foreground text-xs mb-4">Profile</p>
                    <a href="#" className="flex items-center gap-3 hover:text-primary">
                        <i className="fi fi-rr-settings"></i>
                        Settings
                    </a>
                    <button
                        onClick={handleLogout}
                        className="flex items-center cursor-pointer gap-3 hover:text-primary text-left w-full"
                    >
                        <i className="fi fi-rr-exit"></i>
                        Logout
                    </button>
                </div>
            </nav>

            {/* Profile Icon at Bottom */}
            <div className="absolute bottom-6 left-6 flex items-center gap-2">
                <div className="w-10 h-10 rounded-full cursor-pointer border-[3px] border-gray-300 flex items-center justify-center"><i className="fi fi-rr-user text-lg"></i></div>
                <span className="text-sm font-semibold hover:underline cursor-pointer">{user?.name || "John"}</span>
            </div>
        </motion.aside>
    );
}
