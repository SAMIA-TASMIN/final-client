import React from "react";
import { useNavigate } from "react-router-dom";

const SubscribeCancel = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-red-50 to-red-100 px-4">
      <div className="bg-white p-10 rounded-2xl shadow-xl max-w-lg text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Payment Cancelled</h1>
        <p className="text-gray-700 mb-6">
          Your subscription was not completed. You can try again anytime.
        </p>
        <button
          onClick={() => navigate("/profile")}
          className="px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-all"
        >
          Back to Profile
        </button>
      </div>
    </div>
  );
};

export default SubscribeCancel;
