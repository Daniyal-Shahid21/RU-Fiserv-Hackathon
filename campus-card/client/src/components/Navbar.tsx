import React, { useState } from "react";
import { Bell, UserCircle2 } from "lucide-react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";

const Navbar: React.FC = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const { user, logout } = useAuth0();
  const navigate = useNavigate();

  const notifications = [
    { id: 1, label: "Payment posted for Campus Bookstore", fresh: true },
    { id: 2, label: "You earned 120 campus reward points", fresh: true },
    { id: 3, label: "Security reminder: update recovery question", fresh: false },
  ];

  const routes: Record<string, string> = {
    "Credit Score": "/credit-score",
    "Credit Transfers": "/credit-transfers",
    "Balance Analysis": "/balance-analysis",
    "Student Services": "/student-services",
    "On Campus Events": "/events",
  };

  return (
    <header className="w-full bg-prussian text-white shadow-md">
      <div className="w-[90%] md:w-[70%] mx-auto flex items-center justify-between h-16 md:h-20">
        {/* Left: logo (click -> dashboard) */}
        <button
          type="button"
          onClick={() => navigate("/")}
          className="flex items-center gap-2 focus:outline-none"
        >
          <div className="w-9 h-9 rounded-2xl bg-blaze flex items-center justify-center shadow-lg">
            <span className="text-xs font-bold tracking-tight">SC</span>
          </div>
          <div className="leading-tight text-left">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-300">
              Smart Campus
            </p>
            <p className="text-sm md:text-base font-semibold">
              Wallet Dashboard
            </p>
          </div>
        </button>

        {/* Right side */}
        <div className="flex items-center gap-10">
          {/* Text nav options */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-medium">
            {[
              "Credit Score",
              "Credit Transfers",
              "Balance Analysis",
              "Student Services",
              "On Campus Events",
            ].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => navigate(routes[item])}
                className="relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-blaze hover:after:w-full after:transition-all"
              >
                {item}
              </button>
            ))}
          </nav>

          {/* Icon cluster: profile then notifications */}
          <div className="flex items-center gap-4 relative">
            {/* Profile icon (click -> profile) */}
            <button
              type="button"
              onClick={() => navigate("/profile")}
              className="flex items-center gap-1 rounded-full p-1 hover:bg-white/10 transition"
            >
              <UserCircle2 className="w-6 h-6" />
              <div className="hidden md:flex flex-col text-left">
                <span className="text-[11px] text-slate-200">
                  {user?.name || user?.email || "Student"}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    logout({
                      logoutParams: { returnTo: window.location.origin },
                    });
                  }}
                  className="text-[10px] text-slate-300 underline underline-offset-2 hover:text-white"
                >
                  Sign out
                </button>
              </div>
            </button>

            {/* Notifications bell */}
            <button
              type="button"
              className="relative rounded-full p-2 hover:bg-white/10 transition"
              onClick={() => setShowNotifications((v) => !v)}
            >
              <Bell className="w-5 h-5" />
              <span className="absolute -top-0.5 -right-0.5 bg-blaze text-[10px] px-1 rounded-full">
                {notifications.filter((n) => n.fresh).length}
              </span>
            </button>

            {/* Notification dropdown */}
            {showNotifications && (
              <div className="absolute right-0 top-10 w-72 bg-white text-prussian rounded-2xl shadow-xl border border-slate-100 z-20">
                <div className="px-4 py-2 border-b border-slate-100 flex justify-between items-center">
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Notifications
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {notifications.length} total
                  </span>
                </div>
                <ul className="max-h-60 overflow-auto py-2">
                  {notifications.map((n) => (
                    <li
                      key={n.id}
                      className="px-4 py-2 text-xs flex justify-between items-center hover:bg-slate-50"
                    >
                      <span>{n.label}</span>
                      {n.fresh && (
                        <span className="ml-2 inline-flex h-5 items-center rounded-full bg-blaze/10 px-2 text-[10px] font-semibold text-blaze">
                          New
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
