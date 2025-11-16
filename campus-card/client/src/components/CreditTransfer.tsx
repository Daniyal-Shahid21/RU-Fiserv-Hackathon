import React, { useState } from "react";
import { useNotifications } from "../components/NotificationContext";

export default function CreditTransfer() {
  const { addNotification } = useNotifications();
  const [tab, setTab] = useState("Z");
  const [transferMode, setTransferMode] = useState("send");
  const [selectedAuto, setSelectedAuto] = useState<string | null>(null);
  const [selectedRecipient, setSelectedRecipient] = useState<string | null>(
    null
  );
  const [amount, setAmount] = useState("");

  const recentRecipients = [
    { name: "Hazem Ismail", info: "(551) 225-1033" },
    { name: "Eric Huang", info: "(551) 390-8421" },
    { name: "Rizwan Zahid", info: "(551) 208-0901" },
    { name: "Michael Pascopo", info: "(551) 655-7483" },
  ];

  const autoOptions = [
    { id: "flat", label: "Flat Payment" },
    { id: "percentage", label: "Percentage Payment" },
    { id: "autoFlat", label: "Automated Flat Payment" },
    { id: "autoPercent", label: "Automated Percentage Payment" },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center py-10 md:py-14">
      <div className="w-[90%] md:w-[70%] mx-auto space-y-10">
        {/* TOP TABS */}
        <div className="flex gap-4">
          <button
            onClick={() => setTab("Z")}
            className={`px-6 py-2 rounded-xl font-semibold border transition
      ${tab === "Z" ? "bg-prussian text-white" : "bg-slate-500/20 text-black"}
    `}
          >
            Transfer Money
          </button>

          <button
            onClick={() => setTab("AP")}
            className={`px-6 py-2 rounded-xl font-semibold border transition
      ${tab === "AP" ? "bg-prussian text-white" : "bg-slate-500/20 text-black"}
    `}
          >
            Automated Payment
          </button>
        </div>

        {/* MAIN CARD */}
        <section className="bg-gradient-to-r from-blaze/5 via-white to-prussian/5 rounded-3xl shadow-lg px-6 py-8 md:px-10 md:py-10">
          {/* ---------------------- Z MODE ---------------------- */}
          {tab === "Z" && (
            <div className="flex flex-col md:flex-row gap-10">
              <div className="flex-1 bg-white rounded-3xl border shadow p-6">
                <h2 className="text-xl font-semibold mb-4">
                  Transfer Your Money
                </h2>

                {/* SEND / REQUEST / SPLIT */}
                <div className="flex gap-4 mb-6">
                  {["send", "request", "split"].map((m) => (
                    <button
                      key={m}
                      onClick={() => setTransferMode(m)}
                      className={`px-4 py-2 rounded-xl capitalize border transition font-semibold
        ${
          transferMode === m
            ? "bg-blaze text-white"
            : "bg-slate-500/20 text-black"
        }
      `}
                    >
                      {m}
                    </button>
                  ))}
                </div>

                {/* SEARCH */}
                <input
                  type="text"
                  placeholder="Name, email, mobile #, account #"
                  className="w-full border rounded-xl px-4 py-3 mb-6 focus:ring-2 focus:ring-blaze outline-none"
                />

                {/* RECENT */}
                <h3 className="font-medium text-slate-700 mb-3">
                  Recent Recipients
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                  {recentRecipients.map((p, i) => (
                    <div
                      key={i}
                      onClick={() => setSelectedRecipient(p.name)}
                      className={`
        p-4 border rounded-xl cursor-pointer transition
        ${
          selectedRecipient === p.name
            ? "bg-blaze text-white border-prussian"
            : "bg-slate-50 hover:bg-slate-100 text-black"
        }
      `}
                    >
                      <p className="font-medium">{p.name}</p>
                      <p className="text-sm opacity-80">{p.info}</p>
                    </div>
                  ))}
                </div>

                {/* AMOUNT FIELD UNDER RECENT RECIPIENTS */}
                <div className="mb-6">
                  <label className="block mb-2 font-medium text-prussian">
                    Amount
                  </label>

                  <div className="flex">
                    <input
                      type="number"
                      placeholder="Enter amount"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-[30%] min-w-[150px] px-3 py-2 rounded-lg border text-black"
                    />
                  </div>
                </div>

                {/* SUBMIT BUTTON */}
                <button
                  className="mt-2 w-full px-4 py-3 rounded-xl bg-prussian text-white font-semibold text-sm"
                  onClick={() => {
                    if (!selectedRecipient) {
                      alert("Please select a recipient.");
                      return;
                    }
                    if (!amount || Number(amount) <= 0) {
                      alert("Enter a valid amount.");
                      return;
                    }

                    let message = "";

                    if (transferMode === "send") {
                      message = `Sent $${amount} to ${selectedRecipient}`;
                    } else if (transferMode === "request") {
                      message = `Requested $${amount} from ${selectedRecipient}`;
                    } else {
                      message = `Split $${amount} with ${selectedRecipient}`;
                    }

                    addNotification(message);
                    alert(message);
                    setAmount("");
                    setSelectedRecipient(null);
                  }}
                >
                  Submit Transfer
                </button>
              </div>
            </div>
          )}

          {/* ---------------------- AP MODE ---------------------- */}
          {tab === "AP" && (
            <div className="flex flex-col md:flex-row gap-10">
              <div className="flex-1 bg-white rounded-3xl border shadow p-6">
                <h2 className="text-xl font-semibold mb-6">
                  Automated Payment Setup
                </h2>

                {/* PAYMENT OPTION BUTTONS (HORIZONTAL) */}
                <div className="flex flex-row gap-4 overflow-x-auto pb-2">
                  {autoOptions.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setSelectedAuto(opt.id)}
                      className={`
              min-w-[180px] px-4 py-3 rounded-xl font-semibold border transition
              ${
                selectedAuto === opt.id
                  ? "bg-blaze text-white border-blaze"
                  : "bg-slate-200 text-black border-slate-300"
              }
            `}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>

                {/* FIELDS APPEAR BELOW BUTTONS */}
                {selectedAuto && (
                  <div className="mt-6 p-4 border rounded-xl bg-slate-50">
                    {/* AMOUNT FIELD */}
                    <div className="mb-4">
                      <label className="block mb-1 font-medium text-prussian">
                        Amount
                      </label>
                      <div className="flex">
                        <input
                          type="number"
                          placeholder="Enter amount"
                          className="w-[30%] min-w-[150px] px-3 py-2 rounded-lg border text-black"
                        />
                      </div>
                    </div>

                    {/* EXTRA FIELDS FOR AUTOMATED OPTIONS */}
                    {(selectedAuto === "autoFlat" ||
                      selectedAuto === "autoPercent") && (
                      <>
                        <div className="mb-4">
                          <label className="block mb-1 font-medium text-prussian">
                            Start Date
                          </label>
                          <div className="flex">
                            <input
                              type="date"
                              className="w-[30%] min-w-[150px] px-3 py-2 border rounded-lg"
                            />
                          </div>
                        </div>

                        <div className="mb-4">
                          <label className="block mb-1 font-medium text-prussian">
                            Frequency
                          </label>
                          <div className="flex">
                            <select className="w-[30%] min-w-[150px] px-3 py-2 border rounded-lg">
                              <option>Daily</option>
                              <option>Weekly</option>
                              <option>Bi-weekly</option>
                              <option>Monthly</option>
                            </select>
                          </div>
                        </div>

                        <div className="mb-2">
                          <label className="block mb-1 font-medium text-prussian">
                            Time
                          </label>
                          <div className="flex">
                            <input
                              type="time"
                              className="w-[30%] min-w-[150px] px-3 py-2 border rounded-lg"
                            />
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* SAVE BUTTON */}
                <button
                  className="mt-8 w-full px-4 py-3 rounded-xl bg-prussian text-white font-semibold text-sm"
                  onClick={() => {
                    addNotification("Automated payment scheduled.");
                  }}
                >
                  Save Automated Transfer
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
