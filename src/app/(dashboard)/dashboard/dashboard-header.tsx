"use client";

import Link from "next/link";
import { Bell, Menu } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur lg:px-8">
      {/* Mobile menu */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        aria-label="Open navigation"
      >
        <Menu className="size-5" />
      </Button>

      <div className="hidden lg:block" />

      <div className="flex items-center gap-2">
        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          className="text-slate-500 hover:text-slate-900"
          aria-label="Notifications"
        >
          <Bell className="size-5" />
        </Button>

        {/* User */}
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                className="gap-2 px-2 hover:bg-slate-50"
              />
            }
          >
            <Avatar className="size-8">
              <AvatarFallback className="bg-indigo-100 text-indigo-700">
                AS
              </AvatarFallback>
            </Avatar>

            <span className="hidden text-sm font-medium text-slate-700 sm:inline">
              Ankit
            </span>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem render={<Link href="/dashboard/profile" />}>
              Profile
            </DropdownMenuItem>

            <DropdownMenuItem render={<Link href="/dashboard/settings" />}>
              Settings
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem className="text-red-600 focus:text-red-600">
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}