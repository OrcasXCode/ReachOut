"use client";
import { useState } from "react";

export default function Location() {
  const [city, setCity] = useState<string>("");
  const [state, setState] = useState<string>("");
  const [zip, setZip] = useState<string>("");
  const [address, setAddress] = useState<string>("");

  async function getLocation() {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        const API_KEY = "3276956a71704e8fb07cb00684882166"; // Replace with your OpenCage API key
        const response = await fetch(
          `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${API_KEY}`
        );
        const data = await response.json();

        if (data.results.length > 0) {
          const result = data.results[0];
          const components = result.components;

          setCity(components.city || components.town || components.village || "");
          setState(components.state || "");
          setZip(components.postcode || "");
          setAddress(result.formatted || ""); // Full formatted address
        }
      },
      (error) => {
        console.error("Error getting location:", error);
        alert("Failed to retrieve location. Please enable location services.");
      }
    );
  }

  return (
    <div className="flex flex-col gap-3 mt-[200px] max-w-6xl mx-auto">

      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="City"
        className="border p-2 rounded-md"
      />
      <input
        type="text"
        value={state}
        onChange={(e) => setState(e.target.value)}
        placeholder="State / Province"
        className="border p-2 rounded-md"
      />
      <input
        type="text"
        value={zip}
        onChange={(e) => setZip(e.target.value)}
        placeholder="ZIP / Postal code"
        className="border p-2 rounded-md"
      />
      <input
        type="text"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Full Address"
        className="border p-2 rounded-md"
      />
      {/* <input
        type="text"
        value={landmark}
        onChange={(e) => setLandmark(e.target.value)}
        placeholder="Nearby Landmark"
        className="border p-2 rounded-md"
      /> */}
       <button 
        onClick={getLocation} 
        className="px-4 py-2 bg-blue-600 text-white rounded-md"
      >
        Use Current Location
      </button>
    </div>
  );
}
