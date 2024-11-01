// `/src/App.tsx`
import { Button } from "@mui/material";
import React, { useState } from "react";
import WeatherData from "./components/WeatherData";
import { useUser } from "./context/UserContext";
import watercolor from "./assets/watercolor-image.png"; // Import the background image
import "./App.css";
import "./Background.css";

function App() {
  const { name, zip, setName, setZip, saveUser, handleLogout } = useUser();
  const [isEditing, setIsEditing] = useState<boolean>(!name); // Determine if the user is editing or logged in

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveUser();
    setIsEditing(false);
    window.history.pushState({}, "", `?name=${name}`);
  };

  return (
    <>
      <img
        src={watercolor}
        className="background-image top-right"
        alt="background"
      />
      <img
        src={watercolor}
        className="background-image bottom-left"
        alt="background"
      />

      <div className="App">
        <header className="App-header">
          <h1>The Pollinator</h1>
        </header>
        <div className="App-body">
          {isEditing ? (
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={e => {
                  setName(e.target.value);
                }}
              />
              <input
                type="text"
                placeholder="Zip Code"
                value={zip}
                onChange={e => {
                  setZip(e.target.value);
                }}
              />
              <Button type="submit" variant="contained">
                Save
              </Button>
            </form>
          ) : (
            <>
              <p>Welcome, {name}!</p>
              <p>Your Zip Code: {zip}</p>
              <Button
                onClick={() => {
                  handleLogout();
                  setIsEditing(true);
                }}
                variant="contained"
                type="button"
              >
                Logout
              </Button>
            </>
          )}

          <div className="divider"></div>

          <WeatherData />
        </div>
      </div>
    </>
  );
}

export default App;
