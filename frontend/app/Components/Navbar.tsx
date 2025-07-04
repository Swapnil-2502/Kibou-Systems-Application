"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutComponent from "./LogoutComponent";

const navItems = [
  { name: "Dashboard", path: "/dashboard" },
  { name: "All Tenders", path: "/tenders" },
  { name: "My Tenders", path: "/tenders/mine" },
  { name: "Create Tender", path: "/tenders/form" },
  { name: "Your Applications", path: "/tenders/application/mine" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-gray-900 text-white px-6 py-3 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="text-xl font-bold">TenderApp</div>
        <div className="space-x-4">
          {navItems.map((item) => (
            <Link key={item.path} href={item.path}>
              <span
                className={`hover:text-yellow-400 ${
                  pathname === item.path ? "text-yellow-400 font-semibold" : ""
                }`}
              >
                {item.name}
              </span>
            </Link>
          ))}
          <LogoutComponent />
        </div>
      </div>
    </nav>
  );
}
