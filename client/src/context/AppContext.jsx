import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

axios.defaults.withCredentials = true; // ✅ allows cookies to be sent
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL; // ✅ dynamic base

export const AppContext = createContext();

export function AppContextProvider(props) {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);


  const getAuthState = async ()=>{
    try {
      const {data} =await axios.get(backendUrl+ '/api/auth/is-auth')
      if(data.success){
        setIsLoggedIn(true);
        getUserData()
      }
     } catch (error) {
      console.log('User not authenticated:', error.message);
    } finally {
      setIsLoading(false);
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
    } finally {
      setIsLoading(false);
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
    isLoading,
  };

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
}
