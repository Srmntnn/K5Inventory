import ThemeSwitcher from "@/components/themeSwitcher";
import React from "react";
import Navbar from "@/components/navbar";
import UserItemList from "@/components/UserItemList";

function home() {
  return (
    <>
      <div className="min-h-screen bg-background text-foreground">
        <div>
          <Navbar />
        </div>
        <UserItemList />
      </div>
    </>
  );
}

export default home;
