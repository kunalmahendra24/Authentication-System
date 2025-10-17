import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

axios.defaults.withCredentials = true; // ✅ allows cookies to be sent
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000"; // ✅ dynamic base

export const AppContext = createContext();

export function AppContextProvider(props) {
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);


  const getAuthState = async ()=>{
    try {
      const {data} =await axios.get(backendUrl+ '/api/auth/is-auth')
      if(data.success){
        setIsLoggedIn(true);
        getUserData()
      }
    } catch (error) {
      toast.error(error.message);
      
    }
  }  



  const getUserData = async () => {
    try {
      const { data } = await axios.get("/api/user/data"); // ✅ baseURL already handles the domain
      console.log(data);
      if (data.success) {
        setUserData(data.user);
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
        toast.error(data.message);
      }
    } catch (error) {
      console.error("❌ Error fetching user data:", error);
      setIsLoggedIn(false);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };
  useEffect(()=>{
    getAuthState();
  },[])
  const value = {
    backendUrl,
    isLoggedIn,
    setIsLoggedIn,
    userData,
    setUserData,
    getUserData,
  };

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
}
