import React, { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

type Mode = "signin" | "signup";

const AuthSwitcherCard: React.FC = () => {
  const [mode, setMode] = useState<Mode>("signin");
  const { loginWithRedirect, isAuthenticated, user, logout } = useAuth0();

  const handleAuthClick = () => {
    loginWithRedirect({
      authorizationParams: {
        screen_hint: mode === "signup" ? "signup" : undefined,
      },
    });
  };

  return (
    <div className="bg-white rounded-3xl shadow-lg p-8 md:p-10 w-full max-w-xl flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Smart Campus Wallet
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-prussian">
            {mode === "signin" ? "Sign in" : "Create your account"}
          </h1>
        </div>

        {/* Mode toggle pill */}
        <div className="inline-flex items-center bg-slate-100 rounded-full p-1 text-xs font-medium">
          <button
            className={`px-3 py-1 rounded-full transition ${
              mode === "signin"
                ? "bg-blaze text-white shadow-sm"
                : "text-slate-500"
            }`}
            onClick={() => setMode("signin")}
          >
            Sign in
          </button>
          <button
            className={`px-3 py-1 rounded-full transition ${
              mode === "signup"
                ? "bg-prussian text-white shadow-sm"
                : "text-slate-500"
            }`}
            onClick={() => setMode("signup")}
          >
            Sign up
          </button>
        </div>
      </div>

      {/* Simple email/password mock form – you can wire this to Flask later if desired */}
      {!isAuthenticated ? (
        <>
          <div className="space-y-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-prussian/80">
                Campus email
              </label>
              <input
                type="email"
                placeholder="you@university.edu"
                className="h-10 rounded-xl border border-slate-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blaze/70 focus:border-transparent"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-prussian/80">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="h-10 rounded-xl border border-slate-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blaze/70 focus:border-transparent"
              />
            </div>

            {mode === "signin" && (
              <div className="flex justify-between items-center text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <input
                    id="remember"
                    type="checkbox"
                    className="rounded border-slate-300 text-blaze focus:ring-blaze"
                  />
                  <label htmlFor="remember">Remember this device</label>
                </div>
                <button className="hover:text-prussian underline-offset-2">
                  Forgot password?
                </button>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <button
              onClick={handleAuthClick}
              className="w-full h-11 rounded-2xl bg-gradient-to-r from-blaze to-prussian text-white text-sm font-semibold shadow-md hover:shadow-lg transition"
            >
              {mode === "signin" ? "Continue with Auth0" : "Sign up with Auth0"}
            </button>

            <p className="text-[11px] text-slate-500 text-center leading-snug">
              By continuing you agree to the Smart Campus Wallet terms of use
              and acknowledge the privacy policy.
            </p>
          </div>
        </>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            Signed in as{" "}
            <span className="font-semibold">
              {user?.email || user?.name || "current user"}
            </span>
            .
          </p>
          <button
            onClick={() =>
              logout({ logoutParams: { returnTo: window.location.origin } })
            }
            className="w-full h-11 rounded-2xl border border-slate-300 text-sm font-semibold text-prussian hover:bg-slate-50 transition"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
};

export default AuthSwitcherCard;
