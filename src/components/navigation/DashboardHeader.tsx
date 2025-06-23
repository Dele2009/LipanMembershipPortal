import { Logo } from "../UI/Logo";
import { Badge, DarkThemeToggle } from "flowbite-react";
import { BiMenu } from "react-icons/bi";
import { useAuth } from "../../hooks/auth";
import ProfileToggle from "../UI/ProfileToggle";
import { NotificationDropdown } from "../UI/NotificationDropdown";
import { FaCrown } from "react-icons/fa";

function DashboardHeader({
  toggleSidebar,
  showToggle = true,
}: {
  toggleSidebar: () => void;
  showToggle?: boolean;
}) {
  const { user } = useAuth();

  return (
    <>
      <header className="fixed z-40 flex h-16 w-full items-center justify-between bg-blue-700 px-1 lg:px-14 shadow-md">
        <div className="flex gap-3 items-center">
          {showToggle && (
            <button
              onClick={toggleSidebar}
              className="text-white focus:outline-none lg:hidden"
            >
              <BiMenu size={35} />
            </button>
          )}
          <Logo className="h-6 lg:h-12" />
          <h2 className="sr-only">Dashboard</h2>
        </div>
        <div className="flex items-center space-x-4">
          {!user?.is_admin && <NotificationDropdown />}
          {user?.is_superuser && (
            <Badge
              size="sm"
              className="bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 
                      text-white uppercase tracking-wide font-bold 
                      rounded-full shadow-lg border border-white/70 px-4 py-1 "
            >
              <div className="flex items-center gap-2">
                <FaCrown className="text-yellow-300" />
                <span className="hidden md:inline ">Super Admin</span>
              </div>
            </Badge>
          )}
          <ProfileToggle />
          <DarkThemeToggle />
        </div>
      </header>
    </>
  );
}

export default DashboardHeader;
