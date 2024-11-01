import React, { createContext, useContext, useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { weatherServiceApi } from "../api/weatherServiceApi";

interface UserContextType {
  name: string;
  zip: string;
  setName: (name: string) => void;
  setZip: (zip: string) => void;
  saveUser: () => Promise<void>;
  handleLogout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: React.ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [name, setName] = useState("");
  const [zip, setZip] = useState("");
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (cookies.user && !isInitialized) {
      console.log("Initializing from cookies:", cookies.user);
      setName(cookies.user.name || "");
      setZip(cookies.user.zip || "");
      setIsInitialized(true);
    }
  }, [cookies, isInitialized]);

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

    if (cookies.user && cookies.user.id && !isInitialized) {
      loadUser(cookies.user.id);
      setIsInitialized(true);
    }
  }, [cookies, isInitialized]);

  const handleLogout = () => {
    removeCookie("user", { path: "/" });
    setName("");
    setZip("");
    setIsInitialized(false);
  };

  return (
    <UserContext.Provider
      value={{ name, zip, setName, setZip, saveUser, handleLogout }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
