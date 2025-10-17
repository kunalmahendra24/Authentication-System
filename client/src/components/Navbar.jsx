import React, { useContext, useState } from "react"; // ❌ FIX: Removed incorrect 'use' import
import { assets } from "../assets/assets"
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";

const Navbar = () => {
    const navigate = useNavigate();
    // ✅ Note: setIsLoggedIn is correctly destructured here.
    const { userData, backendUrl, setUserData, setIsLoggedIn } = useContext(AppContext)

    const sendVerificationOtp = async () => {
        // 1. CRITICAL CHECK: Ensure email exists before sending request
        if (!userData || !userData.email) {
            toast.error("Authentication required to send verification code.");
            navigate('/login');
            return;
        }

        try {
            axios.defaults.withCredentials = true;
            
            // 2. 🚨 FIX: Pass the email object in the request body
            const { data } = await axios.post(backendUrl + '/api/auth/send-verify-otp', {
                email: userData.email // Correct payload for the server
            });

            if (data.success) {
                navigate('/email-verify');
                toast.success(data.message)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.error("Error sending verification OTP:", error);
            const errorMessage = error.response?.data?.message || "Failed to send OTP.";
            toast.error(errorMessage);
        }
    }

    const logout = async () => {
        try {
            axios.defaults.withCredentials = true
            const { data } = await axios.post(backendUrl + '/api/auth/logout')
            
            if (data.success) {
                // ✅ Improvement: Use null/false for clearing state
                setIsLoggedIn(false);
                setUserData(null);
                toast.success(data.message || "Logged out successfully!");
                navigate('/');
            } else {
                toast.error(data.message || "Logout failed.");
            }
        } catch (error) {
            console.error("Logout Error:", error);
            const errorMessage = error.response?.data?.message || "An unexpected error occurred during logout.";
            toast.error(errorMessage);
        }
    }

    return (
        <div className="w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0">
            <img src={assets.logo} alt="Logo" className="w-28 sm:w-32 cursor-pointer" onClick={() => navigate('/')} />
            
            {userData ? (
                <div className="w-8 h-8 flex justify-center items-center rounded-full bg-black text-white relative group">
                    {userData.name ? userData.name[0].toUpperCase() : 'U'}
                    <div className="absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-10">
                        <ul className="list-none m-0 p-2 bg-gray-100 text-sm shadow-md min-w-[140px]">
                            
                            {!userData.isAccountVerified && (
                                <li 
                                    onClick={sendVerificationOtp} 
                                    className="py-1 px-2 hover:bg-gray-200 cursor-pointer border-b border-gray-300"
                                >
                                    Verify Email
                                </li>
                            )}
                            
                            <li 
                                onClick={logout} 
                                className="py-1 px-2 hover:bg-gray-200 cursor-pointer"
                            >
                                Logout
                            </li>
                        </ul>
                    </div>
                </div>
            ) : (
                <button 
                    onClick={() => navigate('/login')} 
                    className="flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100 transition-all"
                >
                    Login 
                    <img src={assets.arrow_icon} alt="Arrow" />
                </button>
            )}
        </div>
    );
};

export default Navbar;
