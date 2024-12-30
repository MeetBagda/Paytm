'use client'

import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BellIcon, UserIcon, WalletIcon } from 'lucide-react';


export const Appbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/signin");
  };

  return (
        <header className="sticky top-0 z-10 border-b bg-white">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-4">
            <WalletIcon className="h-8 w-8 text-primary" />
            <h1 className="text-xl font-semibold">GlobalPay</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <BellIcon className="h-5 w-5" />
              <span className="absolute -right-1 -top-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-bold text-white">
                3
              </span>
            </Button>
            <Button variant="ghost" size="icon">
              <UserIcon className="h-5 w-5" />
            </Button>
            <Button variant="destructive" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>
  );
};