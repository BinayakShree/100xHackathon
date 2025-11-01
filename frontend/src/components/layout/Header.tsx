"use client";

import Link from "next/link";
import { NotificationBell } from "../notifications/notification-bell";

export function Header() {
  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-2xl font-medium">
          Arogya
        </Link>

        <div className="flex items-center space-x-4">
          <NotificationBell />
          {/* Add other header items here */}
        </div>
      </div>
    </header>
  );
}
