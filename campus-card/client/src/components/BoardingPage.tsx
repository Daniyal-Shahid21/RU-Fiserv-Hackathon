import React, { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
// import AuthSwitcherCard from "./AuthSwitcherCard";
// import ExampleSection from "./ExampleSection";
// import illustration from "../assets/corporate-illustration.png";

const BoardingPage: React.FC = () => {
  const { user, logout } = useAuth0();

  // State for form inputs
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    securityQuestion: ''  // <-- new field
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check if all fields are filled
    const allFilled = Object.values(formData).every((value) => value.trim() !== "");
    if (!allFilled) {
      alert("Please fill in all fields.");
      return;
    }

    // For now, just log the data
    console.log("Form submitted:", formData);
    console.log("User Email:", user?.email);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Main content wrapper at 70% width, centered */}
      <main className="flex-1 flex flex-col items-center py-10 md:py-16">
        <div className="w-[90%] md:w-[70%] mx-auto space-y-10 md:space-y-12">
          {/* Row 1: Auth block + illustration */}
          <section className="bg-gradient-to-r from-blaze/5 via-white to-prussian/5 rounded-3xl shadow-lg px-5 py-8 md:px-10 md:py-10">
            <div className="flex flex-col md:flex-row gap-8 md:gap-10 items-start">
              {/* Left: user info entry */}
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-prussian mb-4">
                  Enter Your Info
                </h2>
                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                  <label className="text-sm text-slate-600">
                    Full Name
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="John Doe"
                      required
                      className="mt-1 w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blaze"
                    />
                  </label>

                  <label className="text-sm text-slate-600">
                    Phone Number
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="(123) 456-7890"
                      required
                      className="mt-1 w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blaze"
                    />
                  </label>

                  <label className="text-sm text-slate-600">
                    Address
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="123 Main St, City, State, ZIP"
                      required
                      className="mt-1 w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blaze"
                    />
                  </label>

                  {/* New Security Question Field */}
                  <label className="text-sm text-slate-600">
                    Security Question
                    <input
                      type="text"
                      name="securityQuestion"
                      value={formData.securityQuestion}
                      onChange={handleChange}
                      placeholder="What is your mother's maiden name?"
                      required
                      className="mt-1 w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blaze"
                    />
                  </label>
                  
                  <button
                    type="submit"
                    className="mt-4 bg-blaze text-white rounded-md px-4 py-2 hover:bg-blaze/80 transition-colors"
                  >
                    Submit
                  </button>
                  {submitted && (
                    <p className="mt-2 text-sm text-green-600">
                      Form submitted successfully!
                    </p>
                  )}
                </form>
              </div>

              {/* Right: database preview placeholder */}
              <div className="flex-1 flex items-center justify-center">
                <div className="relative w-full max-w-md bg-white rounded-3xl border border-slate-100 shadow-md p-6 h-64 flex items-center justify-center">
                  <p className="text-slate-400 text-center">
                    Database info preview will appear here
                  </p>
                </div>
              </div>
            </div>
          </section>
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

export default BoardingPage;
