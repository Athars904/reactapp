// src/App.js

import React, { useState } from "react";
import "./App.css";

function App() {
  const [city, setCity] = useState("");
  const [preference, setPreference] = useState("");
  const [restaurants, setRestaurants] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchRestaurants = async () => {
    setIsLoading(true);
    setError("");
    setRestaurants([]); // Clear previous results
  
    try {
      const response = await fetch("http://localhost:3000/customer/getSearchResults", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          city: city,
          pref: preference,
        }),
      });
  
      const data = await response.json();
  
      if (response.ok && data.success) {
        setRestaurants(data.data);
      } else {
        // Handle error messages from the server
        setError(data.message || "Failed to fetch restaurants from server.");
        console.error("Error response:", data);
      }
    } catch (e) {
      // Catch and log network or other unexpected errors
      setError("Error fetching data from the server. Please check your connection or server status.");
      console.error("Network or Fetch error:", e);
    }
  
    setIsLoading(false);
  };
  

  return (
    <div className="App">
      <h1>Restaurant Finder</h1>
      <div className="form">
        <input
          type="text"
          placeholder="Enter City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter Preference (e.g., vegan, halal)"
          value={preference}
          onChange={(e) => setPreference(e.target.value)}
        />
        <button onClick={fetchRestaurants} disabled={isLoading}>
          {isLoading ? "Searching..." : "Search Restaurants"}
        </button>
      </div>
      {error && <p className="error">{error}</p>}
      <div className="results">
        {restaurants.length > 0 ? (
          <ul>
            {restaurants.map((restaurant, index) => (
              <li key={index}>
                <h3>{restaurant.name}</h3>
                <p>{restaurant.address}</p>
                <p>Rating: {restaurant.rating}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No restaurants found.</p>
        )}
      </div>
    </div>
  );
}

export default App;
