import React from "react";
import AuthSwitcherCard from "./AuthSwitcherCard";
import ExampleSection from "./ExampleSection";
import illustration from "../assets/corporate-illustration.png";

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Main content wrapper at 70% width, centered */}
      <main className="flex-1 flex flex-col items-center py-10 md:py-16">
        <div className="w-[90%] md:w-[70%] mx-auto space-y-10 md:space-y-12">
          {/* Row 1: Auth block + illustration */}
          <section className="bg-gradient-to-r from-blaze/5 via-white to-prussian/5 rounded-3xl shadow-lg px-5 py-8 md:px-10 md:py-10">
            <div className="flex flex-col md:flex-row gap-8 md:gap-10 items-center">
              {/* Left: auth card */}
              <div className="flex-1 flex justify-center">
                <AuthSwitcherCard />
              </div>

              {/* Right: illustration placeholder */}
              <div className="flex-1 flex items-center justify-center">
                <div className="relative w-full max-w-md">
                  <div className="absolute -top-4 -left-4 w-10 h-10 rounded-2xl bg-blaze/70 blur-lg opacity-40" />
                  <div className="absolute -bottom-4 -right-6 w-16 h-16 rounded-full bg-prussian/70 blur-xl opacity-30" />
                  <div className="relative bg-white rounded-3xl border border-slate-100 shadow-md p-4 md:p-6">
                    <img
                      src={illustration}
                      alt="Corporate wallet illustration"
                      className="w-full h-auto"
                    />
                    <p className="mt-3 text-xs text-slate-500">
                      Drop your campus credit card vector or hero artwork here
                      to anchor the brand.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Row 2–4: equal-height example sections */}
          <ExampleSection
            index={1}
            title="Analyze balances across every campus wallet"
            subtitle="Show students where their money is coming from and where it is going, with smart breakdowns by account, merchant, and campus category."
          />
          <ExampleSection
            index={2}
            title="Predict next week’s spending with AI"
            subtitle="Use historical campus spending habits to forecast next week’s allowance and highlight when they are drifting off budget."
          />
          <ExampleSection
            index={3}
            title="Connect campus services and rewards"
            subtitle="A unified place for dining, textbooks, events, and volunteer credit — all tied into one smart campus companion card."
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-4">
        <div className="w-[90%] md:w-[70%] mx-auto flex flex-wrap gap-4 text-xs text-prussian/70">
          <a
            href="#"
            className="underline underline-offset-2 hover:text-prussian"
          >
            Privacy policy
          </a>
          <a
            href="#"
            className="underline underline-offset-2 hover:text-prussian"
          >
            Terms of use
          </a>
          <a
            href="#"
            className="underline underline-offset-2 hover:text-prussian"
          >
            Campus partner portal
          </a>
          <a
            href="#"
            className="underline underline-offset-2 hover:text-prussian"
          >
            Cardholder agreement
          </a>
          <a
            href="#"
            className="underline underline-offset-2 hover:text-prussian"
          >
            Help center
          </a>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
