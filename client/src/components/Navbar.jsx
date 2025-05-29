import React, { useEffect, useState } from "react";
import ThemeSwitcher from "./themeSwitcher";
import { ArrowRight } from "lucide-react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import Logo from "../assets/logo.png"; // Adjust the path as necessary
import { useAuthStore } from "@/store/AuthStore";
import { useToast } from "@/hooks/use-toast";

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function Navbar() {
  const navigate = useNavigate(); // Move this inside the component
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const refreshUser = useAuthStore((state) => state.refreshUser);
  const [isScrolled, setIsScrolled] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    refreshUser();
  }, []);

  if (!user) return null;

  const handleLogout = async () => {
    await logout();

    toast({
      title: "Logged Out",
      description: "You have successfully logged out.",
      variant: "default",
    });

    navigate("/login");
  };
  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition duration-300 ${
        isScrolled
          ? "bg-background/90 backdrop-blur-md shadow-sm "
          : "bg-transparent"
      }`}
    >
      <div className=" w-full flex justify-between items-center p-2 px-6 md:px-24 sticky top-0">
        <Link to="/">
          <img src={Logo} alt="" className="h-10" />
        </Link>
        <div className="flex items-center gap-4">
          <ThemeSwitcher />

          <div>
            <DropdownMenu onOpenChange={(open) => open && refreshUser()}>
              <DropdownMenuTrigger asChild>
                <div className="relative inline-flex items-center space-x-2 rounded-full p-[1px] bg-gradient-to-r from-blue-500 via-red-500 to-yellow-500 hover:bg-opacity-80">
                  <div className="bg-card flex justify-between items-center gap-2 p-2 py-2 rounded-full cursor-pointer">
                    <Avatar className="h-8 w-8 rounded-md overflow-hidden">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>K5</AvatarFallback>
                    </Avatar>
                    {/* <div className="flex flex-col text-left">
                    <span className="text-sm font-semibold truncate">
                      {user.name}
                    </span>
                    <span className="text-xs text-muted-foreground truncate">
                      {user.email}
                    </span>
                  </div> */}
                    {/* <ChevronsUpDown className="ml-auto h-4 w-4 text-gray-600" /> */}
                  </div>
                </div>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                className=" rounded-lg bg-card "
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="px-4 py-2 text-sm font-normal text-gray-700">
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8 rounded-md overflow-hidden">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>K5</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-semibold text-sm truncate">
                        {user.name}
                      </span>
                      <span className="text-xs text-muted-foreground truncate">
                        {user.email}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                  {user.isVerified ? (
                    <DropdownMenuItem disabled>
                      <BadgeCheck className="mr-2 h-4 w-4 text-green-500" />
                      Verified
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem>
                      <Sparkles className="mr-2 h-4 w-4 text-yellow-500" />
                      <Link to="/verify-email">Verify Account</Link>
                    </DropdownMenuItem>
                  )}
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                  <DropdownMenuItem className="">
                    <CreditCard className="mr-2 h-4 w-4" />
                    <Link to="/my-request">My Request</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="">
                    <Bell className="mr-2 h-4 w-4" />
                    Notifications
                  </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  className="cursor-pointer bg-red-600 text-white hover:bg-red-700"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <Outlet />
        </div>
      </div>
    </header>
  );
}

export default Navbar;
