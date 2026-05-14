import React, { useEffect, useState } from "react";

const Modal = ({ isOpen, onClose, title, body }) => {
  if (!isOpen) return null;

  // Theme logic
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "civicLight"
  );

  useEffect(() => {
    const handleThemeChange = () => {
      setTheme(localStorage.getItem("theme") || "civicLight");
    };
    window.addEventListener("storage", handleThemeChange);
    return () => window.removeEventListener("storage", handleThemeChange);
  }, []);

  const isLight = theme === "civicLight";

  const modalBgClass = isLight ? "bg-white" : "bg-gray-900";
  const titleClass = isLight ? "text-gray-900" : "text-gray-100";
  const bodyClass = isLight ? "text-gray-700" : "text-gray-300";
  const borderClass = isLight ? "border-gray-200" : "border-gray-700";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Box */}
      <div
        className={`relative w-[95%] max-w-xl rounded-2xl shadow-2xl p-6 md:p-8 
        ${modalBgClass} ${borderClass} border 
        animate-scaleIn`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className={`text-2xl font-bold ${titleClass}`}>{title}</h2>
          <button
            onClick={onClose}
            className={`text-2xl font-bold ${bodyClass} hover:text-red-500 transition`}
          >
            &times;
          </button>
        </div>

        {/* Divider */}
        <div className={`w-full h-[1px] mb-4 ${borderClass}`} />

        {/* Body */}
        <div className={`text-base leading-relaxed space-y-3 ${bodyClass}`}>
          {body.split("\n").map((line, index) => (
            <p key={index}>{line}</p>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg bg-blue-600 text-white font-semibold 
            hover:bg-blue-700 transition-all duration-200 active:scale-95"
          >
            Close
          </button>
        </div>
      </div>

      {/* Animations */}
      <style>
        {`
          .animate-scaleIn {
            animation: scaleIn 0.25s ease-out;
          }

          @keyframes scaleIn {
            0% {
              opacity: 0;
              transform: scale(0.9);
            }
            100% {
              opacity: 1;
              transform: scale(1);
            }
          }
        `}
      </style>
    </div>
  );
};

export default Modal;
