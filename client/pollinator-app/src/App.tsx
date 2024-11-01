import { Button } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import WeatherData from "./components/WeatherData";
import { weatherServiceApi } from "./api/weatherServiceApi";

function App() {
  const [name, setName] = useState("");
  const [zip, setZip] = useState("");
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);

  useEffect(() => {
    if (cookies.user) {
      setName(cookies.user.name);
      setZip(cookies.user.zip);
    }
  }, [cookies]);

  const saveUser = async () => {
    try {
      const response = await weatherServiceApi.createUser({ name, zip });
      setCookie("user", { id: response.id, name, zip }, { path: "/" });
    } catch (error) {
      console.error("Error saving user data:", error);
    }
  };

  useEffect(() => {
    const loadUser = async (id: string) => {
      try {
        const response = await weatherServiceApi.getUserById(id);
        setName(response.name);
        setZip(response.zip);
      } catch (error) {
        console.error("Error loading user data:", error);
      }
    };

    if (cookies.user && cookies.user.id) {
      loadUser(cookies.user.id);
    }
  }, [cookies]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveUser();
    window.history.pushState({}, "", `?name=${name}`);
  };

  const handleLogout = () => {
    removeCookie("user", { path: "/" });
    setName("");
    setZip("");
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>The Pollinator</h1>
      </header>
      <div className="App-body">
        {cookies.user ? (
          <>
            <p>Welcome, {name}!</p>
            <p>Your Zip Code: {zip}</p>
            <Button onClick={handleLogout} variant="contained">
              Logout
            </Button>
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={e => setName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Zip Code"
              value={zip}
              onChange={e => setZip(e.target.value)}
            />
            <Button type="submit" variant="contained">
              Save
            </Button>
          </form>
        )}
        <WeatherData />
      </div>
    </div>
  );
}

export default App;
