import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import useAxiosSecure from "../../../Hooks/useAxiosSecure"; 
import LoadingPage from "../LoadingPage"; 

const SubscribeSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!sessionId) {
      setMessage("Invalid session. No subscription completed.");
      setLoading(false);
      return;
    }

    const verifySubscription = async () => {
      try {
        const res = await axiosSecure.get(`/subscribe-success?session_id=${sessionId}`);
        setMessage(`🎉 Subscription successful! Welcome, ${res.data.email}`);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setMessage("Subscription verification failed. Please contact support.");
        setLoading(false);
      }
    };

    verifySubscription();
  }, [sessionId]);

  if (loading) return <LoadingPage />;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-green-50 to-green-100 px-4">
      <div className="bg-white p-10 rounded-2xl shadow-xl max-w-lg text-center">
        <h1 className="text-3xl font-bold text-green-600 mb-4">Subscription Successful!</h1>
        <p className="text-gray-700 mb-6">{message}</p>
        <button
          onClick={() => navigate("/profile")}
          className="px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-all"
        >
          Go to Profile
        </button>
      </div>
    </div>
  );
};

export default SubscribeSuccess;
