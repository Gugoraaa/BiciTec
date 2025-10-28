import React, { useState } from "react";
import { IoClose } from "react-icons/io5";

interface ReviewUserAppealProps {
  onClose: () => void;
}

export default function ReviewUserAppeal({ onClose }: ReviewUserAppealProps) {
  const [type, setType] = useState("Ok");
  const [message, setMessage] = useState("");

  return (
    <div className="  flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg w-full max-w-md shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">
            Review User Appeal
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <IoClose size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* User's Appeal Message */}
          <div>
            <h3 className="text-sm font-medium text-gray-300 mb-3">
              User's Appeal Message
            </h3>
            <div className="bg-gray-700 rounded-lg p-4 text-gray-300 text-sm leading-relaxed">
              My account was suspended for leaving a bike outside a designated
              zone. This was due to an emergency where I had to quickly get to
              the health center. I&apos;ve been a responsible user for two years and
              this is my first issue. I would appreciate it if you could
              reconsider the ban. Thank you.
            </div>
          </div>

          {/* Administrator's Decision */}
          <div>
            <h3 className="text-sm font-medium text-gray-300 mb-3">
              Administrator's Decision
            </h3>
            <div className="flex bg-gray-700 border border-slate-800 rounded-xl mb-4 overflow-hidden">
              <button
                onClick={() => setType("Ok")}
                className={`flex-1 py-2 text-sm font-medium ${
                  type === "Ok"
                    ? "bg-[color:var(--bt-blue,#2563eb)] text-white"
                    : "text-slate-300 hover:bg-slate-800"
                }`}
              >
                Ok
              </button>
              <button
                onClick={() => setType("Warning")}
                className={`flex-1 py-2 text-sm font-medium ${
                  type === "Warning"
                    ? "bg-[color:var(--bt-blue,#2563eb)] text-white"
                    : "text-slate-300 hover:bg-slate-800"
                }`}
              >
                Warning
              </button>
              <button
                onClick={() => setType("Ban")}
                className={`flex-1 py-2 text-sm font-medium ${
                  type === "Ban"
                    ? "bg-[color:var(--bt-blue,#2563eb)] text-white"
                    : "text-slate-300 hover:bg-slate-800"
                }`}
              >
                Ban
              </button>
            </div>

            {/* Message to User */}
            <div>
              <label className="block text-xs text-gray-400 mb-2">
                Message to User
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Explain the decision to the user..."
                className="w-full bg-gray-700 text-gray-300 rounded-lg p-3 text-sm border border-gray-600 focus:outline-none focus:border-blue-500 resize-none"
                rows={4}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-700">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-gray-700 text-gray-300 rounded-lg font-medium hover:bg-gray-650 transition-colors"
          >
            Cancel
          </button>
          <button className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
            Save Decision
          </button>
        </div>
      </div>
    </div>
  );
}
