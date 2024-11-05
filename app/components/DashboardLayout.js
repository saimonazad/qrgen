import { useState } from "react";
import Image from "next/image";
import { LayoutGrid, User, ChevronDown, Moon, Sun, LogOut, SidebarClose } from "lucide-react";
import { Switch } from "./ui/switch";
import { twMerge } from "tailwind-merge";
import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";
import { useRouter } from "next/router";

export default function DashboardLayout({ children }) {
  // const router = useRouter();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);
  const handleLogout = async () => {
    await signOut(auth);
    // router.push("/login");
  };
  return (
    <div className={twMerge("flex h-screen", darkMode ? "dark" : "")}>
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-[#333A48] dark:bg-gray-700 p-5 transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:relative lg:translate-x-0`}
      >
        {/* Sidebar content */}
        <div className="flex items-center justify-between ">
          <h1 className="text-white text-xl font-bold">Dashboard</h1>
          <button onClick={toggleSidebar} className="text-white lg:hidden">
            <SidebarClose className="w-5 h-5 transform rotate-180" />
          </button>
        </div>
        {/* Rest of sidebar */}
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
        <header className="flex items-center justify-between md:justify-end bg-white p-4 border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700 space-x-2">
          <button
            onClick={toggleSidebar}
            className="text-gray-500 focus:outline-none lg:hidden flex justify-end"
          >
            <LayoutGrid className="w-6 h-6" />
          </button>
          <div className="flex items-center space-x-2">
            {darkMode ? (
              <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            ) : (
              <Sun className="w-5 h-5 text-gray-600" />
            )}
            <Switch checked={darkMode} onCheckedChange={setDarkMode} />
          </div>
          <div className="flex items-center gap-3 text-black dark:text-white">
            {/* <Image
              src="/avatar.jpg"
              alt="Profile"
              className="w-8 h-8 rounded-full"
              width={40}
              height={40}
            /> */}
            <LogOut className="w-5 h-5 cursor-pointer" onClick={handleLogout} />
          </div>
        </header>
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
