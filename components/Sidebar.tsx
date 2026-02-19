"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <>
      {/* MOBILE TOP BAR */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-black border-b border-purple-500/10 p-4 flex justify-between items-center">
        <h1 className="text-white font-semibold">Tracker</h1>

        {/* Hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="w-8 h-8 flex flex-col justify-between"
        >
          <span
            className={`block h-[2px] bg-white transition ${
              open ? "rotate-45 translate-y-2" : ""
            }`}
          />
          <span
            className={`block h-[2px] bg-white transition ${
              open ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block h-[2px] bg-white transition ${
              open ? "-rotate-45 -translate-y-2" : ""
            }`}
          />
        </button>
      </div>

      {/* BACKDROP */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/70 z-40 md:hidden"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed md:relative z-50 top-0 left-0 h-screen md:h-auto w-64 bg-black text-white border-r border-purple-500/10 p-6 transition-transform duration-300 flex-shrink-0 ${
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* LOGO */}
        <div
          onClick={() => {
            router.push("/dashboard");
            setOpen(false);
          }}
          className="flex items-center gap-3 mb-10 cursor-pointer hover:opacity-80 transition"
        >
          <img src="/weblogo.png" className="w-8 h-8" />
          <span className="text-white font-semibold text-lg">Tracker</span>
        </div>

        {/* NAV */}
        <NavItem label="Dashboard" path="/dashboard" close={() => setOpen(false)} />
        <NavItem label="Analytics" path="/analytics" close={() => setOpen(false)} />
        <NavItem label="History" path="/history" close={() => setOpen(false)} />
        <NavItem label="Profile" path="/profile" close={() => setOpen(false)} />
        <NavItem label="Logout" path="/login" close={() => setOpen(false)} />
      </aside>
    </>
  );
}

function NavItem({
  label,
  path,
  close,
}: {
  label: string;
  path: string;
  close: () => void;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const isActive = pathname === path;

  return (
    <div
      onClick={() => {
        router.push(path);
        close();
      }}
      className={`mb-3 px-4 py-2 rounded-lg transition-all duration-200 cursor-pointer font-medium ${
        isActive
          ? "bg-purple-600 text-white shadow-[0_0_16px_rgba(168,85,247,0.6)]"
          : "text-white hover:bg-purple-600/20 hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] hover:scale-105"
      }`}
    >
      {label}
    </div>
  );
}