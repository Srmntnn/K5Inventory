import React from "react";
import ThemeSwitcher from "./themeSwitcher";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/logo.png"; // Adjust the path as necessary
import { useAuthStore } from "@/store/AuthStore";
import { useToast } from "@/hooks/use-toast";

function Navbar() {
  const navigate = useNavigate(); // Move this inside the component
  const { user, logout } = useAuthStore();
  const { toast } = useToast();
  const handleLogout = () => {
    logout(); // Call the logout function from the store
    toast({
      title: "Logged Out",
      description: "You have successfully logged out.",
      variant: "default", // You can change the variant if needed
    });
    navigate("/login"); // Redirect the user to the login page after logging out
  };
  return (
    <div className="w-full flex justify-between items-center p-2 sm:p-4 sm:px-24 absolute top-0">
      <div>
        <img src={Logo} alt="" className="h-12" />
      </div>
      <div className="flex items-center gap-4">
        <ThemeSwitcher />

        <div>
          {user ? (
            <button
              className="flex items-center gap-2 border-border border rounded-full px-6 py-2 text-destructive hover:bg-accent transition-all"
              onClick={handleLogout}
            >
              Logout
            </button>
          ) : (
            <button
              className="flex items-center gap-2 border-border border rounded-full px-6 py-2 text-primary hover:bg-accent transition-all"
              onClick={() => navigate("/login")}
            >
              Login
              <ArrowRight className="h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
