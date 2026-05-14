import React, { useEffect, useState, useContext } from "react";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import LoadingPage from "./LoadingPage";
import { AuthContext } from "../../Contexts/AuthContext";
import { useSearchParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Profile = () => {
  // ============================
  // THEME STATE & LISTENER
  // ============================
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "civicLight"
  );

  useEffect(() => {
    const handleThemeChange = () => {
      const newTheme = localStorage.getItem("theme") || "civicLight";
      if (newTheme !== theme) setTheme(newTheme);
    };
    window.addEventListener("storage", handleThemeChange);
    return () => window.removeEventListener("storage", handleThemeChange);
  }, [theme]);

  // ============================
  // THEME-AWARE CLASS CALCULATION
  // ============================
  const isLight = theme === "civicLight";
  const profileBg = isLight ? "bg-white" : "bg-gray-800";
  const titleClass = isLight ? "text-gray-900" : "text-gray-100";
  const textClass = isLight ? "text-gray-500" : "text-gray-300";
  const labelClass = isLight ? "text-gray-600" : "text-gray-300";
  const inputEnabledClass = isLight
    ? "border-gray-300 focus:ring-blue-500 text-gray-900"
    : "border-gray-600 bg-gray-700 focus:ring-blue-500 text-gray-100";
  const inputDisabledClass = isLight
    ? "border-gray-200 bg-gray-100 cursor-not-allowed text-gray-500"
    : "border-gray-700 bg-gray-900 cursor-not-allowed text-gray-500";
  const blockedMessageBg = isLight
    ? "bg-red-100 text-red-600 border-red-200"
    : "bg-red-900 text-red-300 border-red-700";

  // Swal Custom Class for Dark Mode Support
  const swalCustomClass = {
    popup: isLight ? "" : "bg-gray-800 text-gray-100",
    title: isLight ? "" : "text-gray-100",
    content: isLight ? "" : "text-gray-300",
  };

  const axiosSecure = useAxiosSecure();
  const { user: authUser } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [subscribing, setSubscribing] = useState(false);
  const [formData, setFormData] = useState({ displayName: "" });

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Fetch profile
  const fetchProfile = async () => {
    if (!authUser?.email) return;
    try {
      const res = await axiosSecure.get(`/profile?email=${authUser.email}`);
      setUser(res.data);
      setFormData({ displayName: res.data.displayName || "" });
    } catch (err) {
      console.error("Fetch profile error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [authUser]);

  // Check Stripe subscription success redirect
  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    if (sessionId) {
      const confirmSubscription = async () => {
        try {
          const res = await axiosSecure.get(
            `/subscribe-success?session_id=${sessionId}`
          );
          setUser((prev) => ({ ...prev, isPremium: true }));
          Swal.fire({
            title: "Subscription Successful!",
            text: "You are now a Premium member with unlimited issue reporting.",
            icon: "success",
            confirmButtonText: "Great!",
            timer: 1500,
            timerProgressBar: true,
            customClass: swalCustomClass,
          });
          navigate("/profile", { replace: true });
        } catch (err) {
          Swal.fire({
            title: "Subscription Failed",
            text: "Confirmation failed. Your payment may not have been processed or there was a system error. Please check your payment details and try again.",
            icon: "error",
            confirmButtonText: "OK",
            customClass: swalCustomClass,
          });
        }
      };
      confirmSubscription();
    }
  }, [searchParams, navigate, axiosSecure]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    if (user?.isBlocked) {
      Swal.fire({
        title: "Account Blocked",
        text: "Your account is currently blocked by the Administrator. Profile updates are disabled. Please contact the authorities for assistance.",
        icon: "warning",
        confirmButtonText: "Understood",
        customClass: swalCustomClass,
      });
      return;
    }

    setUpdating(true);
    try {
      const res = await axiosSecure.patch("/profile", {
        displayName: formData.displayName,
      });
      setUser(res.data);
      Swal.fire({
        title: "Success!",
        text: "Profile updated successfully.",
        icon: "success",
        confirmButtonText: "Continue",
        customClass: swalCustomClass,
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: "Update Failed",
        text: "Failed to update profile due to a system error. Please try again.",
        icon: "error",
        confirmButtonText: "Dismiss",
        customClass: swalCustomClass,
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleSubscribe = async () => {
    if (user?.isBlocked) {
      Swal.fire({
        title: "Account Blocked",
        text: "Your account is currently blocked by the Administrator. Profile updates are disabled. Please contact the authorities for assistance.",
        icon: "warning",
        confirmButtonText: "Understood",
        customClass: swalCustomClass,
      });
      return;
    }

    setSubscribing(true);
    try {
      const res = await axiosSecure.post("/subscribe", {});
      if (!res.data?.url) {
        Swal.fire({
          title: "Subscription Failed",
          text: "The server returned an invalid response. Please contact support or try again later.",
          icon: "error",
          confirmButtonText: "OK",
          customClass: swalCustomClass,
        });
        return;
      }
      window.location.href = res.data.url;
    } catch (err) {
      console.error("Subscription failed:", err);
      Swal.fire({
        title: "Subscription Failed",
        text: "The server returned an invalid response. Please contact support or try again later.",
        icon: "error",
        confirmButtonText: "OK",
        customClass: swalCustomClass,
      });
    } finally {
      setSubscribing(false);
    }
  };

  if (loading) {
    return (
      <div className="py-16">
        <LoadingPage />
      </div>
    );
  }

  if (!user)
    return <p className="py-20 text-center text-red-500">User not found.</p>;

  return (
    <div className={`max-w-full mx-auto ${profileBg} py-26 px-4 md:px-0`}>
      {/* Header */}
      <div className="flex flex-col items-center mb-10 text-center">
        <img
          src={user.photoURL}
          alt="Profile"
          className={`w-32 h-32 rounded-full shadow-lg object-cover border-4 ${
            isLight ? "border-white" : "border-gray-700"
          }`}
        />
        <h1 className={`text-3xl font-bold mt-4 ${titleClass}`}>
          {user.displayName}
        </h1>
        <p className={textClass}>{user.email}</p>

        {user.isPremium && (
          <div className="mt-3 px-4 py-1 rounded-full bg-yellow-500 text-gray-900 text-sm font-semibold shadow-md">
            ⭐ Premium Member
          </div>
        )}

        {user.isBlocked && (
          <div
            className={`mt-4 px-4 py-2 rounded-lg border ${blockedMessageBg}`}
          >
            Your account is blocked. Contact support.
          </div>
        )}
      </div>

      {/* Account Details */}
      <div
        className={`${profileBg} shadow-xl rounded-2xl p-8 ${
          isLight ? "border-gray-100" : "border-gray-700"
        } border`}
      >
        <h2 className={`text-xl font-semibold mb-6 ${titleClass}`}>
          Account Details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Display Name Input */}
          <div>
            <label className={`text-sm font-medium ${labelClass}`}>Name</label>
            <input
              type="text"
              name="displayName"
              value={formData.displayName}
              onChange={handleChange}
              disabled={user.isBlocked}
              className={`mt-1 w-full px-4 py-2 rounded-lg border focus:outline-none ${
                user.isBlocked ? inputDisabledClass : inputEnabledClass
              }`}
            />
          </div>

          {/* Email Input */}
          <div>
            <label className={`text-sm font-medium ${labelClass}`}>Email</label>
            <input
              type="email"
              name="email"
              value={user.email}
              disabled
              className={`mt-1 w-full px-4 py-2 rounded-lg border focus:outline-none ${inputDisabledClass}`}
            />
          </div>
        </div>

        <button
          onClick={handleUpdate}
          disabled={updating || user.isBlocked}
          className={`mt-6 w-full py-3 rounded-xl font-semibold text-white transition-all ${
            user.isBlocked
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 shadow-md"
          }`}
        >
          {updating ? "Updating..." : "Save Changes"}
        </button>

        {!user.isPremium && !user.isBlocked && (
          // Upgrade Section (Ensure color contrast in dark mode)
          <div
            className={`mt-10 p-6 rounded-xl shadow-sm ${
              isLight
                ? "bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200"
                : "bg-gray-700 border border-gray-600"
            }`}
          >
            <h3
              className={`text-lg font-semibold ${
                isLight ? "text-blue-900" : "text-blue-300"
              }`}
            >
              Upgrade to Premium ✨
            </h3>
            <p
              className={`text-sm mt-1 ${
                isLight ? "text-blue-800" : "text-gray-200"
              }`}
            >
              Unlock unlimited issue submissions + exclusive features.
            </p>
            <button
              onClick={handleSubscribe}
              disabled={subscribing}
              // Using green gradient for the button for universal visibility
              className="mt-4 w-full py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-xl shadow hover:opacity-90 transition-all"
            >
              {subscribing ? "Processing..." : "Upgrade for 1000৳"}
            </button>
          </div>
        )}

        {user.isPremium && (
          <p className="mt-6 text-center text-green-600 text-sm font-medium">
            You are a premium user — enjoy unlimited access! ✔
          </p>
        )}
      </div>
    </div>
  );
};

export default Profile;
