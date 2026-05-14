import React, { useRef, useState, useEffect } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useLoaderData } from "react-router";

const Coverage = () => {
  // ============================
  // THEME STATE & LISTENER (The Fix)
  // ============================
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "civicLight"
  );

  useEffect(() => {
    const handleThemeChange = () => {
      const newTheme = localStorage.getItem("theme") || "civicLight";
      if (newTheme !== theme) {
        setTheme(newTheme);
      }
    };
    window.addEventListener("storage", handleThemeChange);
    return () => {
      window.removeEventListener("storage", handleThemeChange);
    };
  }, [theme]);

  // ============================
  // THEME-AWARE CLASS CALCULATION
  // ============================
  const bgClass = theme === "civicLight" ? "bg-white" : "bg-gray-900";
  const titleClass = theme === "civicLight" ? "text-gray-800" : "text-gray-100";
  const infoTextClass =
    theme === "civicLight" ? "text-gray-600" : "text-gray-400";
  const inputBgClass = theme === "civicLight" ? "bg-white" : "bg-gray-800";
  const inputBorderClass =
    theme === "civicLight" ? "border-gray-300" : "border-gray-600";
  const inputTextColor =
    theme === "civicLight" ? "text-gray-800" : "text-gray-100";
  const errorClass = "text-red-600 font-semibold mt-2"; // Error color remains static

  // ============================
  // COMPONENT LOGIC
  // ============================
  const position = [23.699, 90.399];
  const serviceCenter = useLoaderData();
  const [error, setError] = useState("");
  const mapRef = useRef(null);

  const handleSearch = (e) => {
    e.preventDefault();
    setError("");
    const location = e.target.location.value;
    const district = serviceCenter.find((c) =>
      c.district.toLowerCase().includes(location.toLowerCase())
    );

    if (district) {
      const coordinate = [district.latitude, district.longitude];
      // Ensure mapRef.current is available before calling flyTo
      if (mapRef.current) {
        mapRef.current.flyTo(coordinate, 12);
      }
      setError(`${district.district} is covered!`);
    } else {
      setError("We are not available there.");
    }
  };

  return (
    <div className={`p-8 ${bgClass}`}>
      {/* Title */}
      <h2 className={`text-5xl mt-15 font-bold text-center ${titleClass}`}>
        We are available in 64 districts
      </h2>

      {/* Search Bar */}
      <div>
        <form onSubmit={handleSearch}>
          <div className="m-5 w-full max-w-md mx-auto">
            <div className="relative">
              <input
                name="location"
                type="text"
                placeholder="Search District (e.g., Dhaka)..."
                // Applying theme-aware input styles
                className={`w-full border ${inputBorderClass} ${inputBgClass} rounded-full py-3 pl-5 pr-20 focus:outline-none focus:ring-2 focus:ring-primary ${inputTextColor}`}
              />

              {/* Assuming bg-primary and hover:bg-lime-500 are theme-agnostic or defined globally */}
              <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-white px-5 py-2 rounded-full hover:bg-lime-500">
                Search
              </button>
            </div>
            <p className={errorClass}>{error}</p>
          </div>
        </form>
      </div>

      {/* Map Container */}
      <div className={`border ${inputBorderClass} w-full h-[800px]`}>
        <MapContainer
          center={position}
          zoom={7.5}
          scrollWheelZoom={false}
          className="h-[800px] relative z-10"
          ref={mapRef}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {serviceCenter.map((center, index) => (
            <Marker key={index} position={[center.latitude, center.longitude]}>
              <Popup>
                <strong>{center.district}</strong> <br /> Service Area:{" "}
                {center.covered_area.join(", ")}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default Coverage;
