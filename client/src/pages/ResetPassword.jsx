import React, { useState, useRef, useContext } from 'react' 
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
// Assume lock_icon is available in assets for the new password form

const ResetPassword = () => {
    const {backendUrl} = useContext(AppContext)
    axios.defaults.withCredentials = true

    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [isEmailSent, setIsEmailSent] = useState(false); // Changed initial state to boolean false
    const [otp,setOtp] = useState('');
    const [isOtpSubmited, seIsOtpSubmited] = useState(false);
    const inputRefs = useRef([]); 

    // Handler to move focus to the next input
    const handleInput = (e, index) => {
        if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
            inputRefs.current[index + 1].focus();
        }
    }
    
    // Handler to move focus back on backspace
    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    }
    
    // Handler to paste the entire OTP string
    const handlePaste = (e) => { // Removed unused 'index' parameter for clarity
        const paste = e.clipboardData.getData('text')
        const pasteArray = paste.split('');
        pasteArray.forEach((char, index) => {
            if (inputRefs.current[index]) {
                inputRefs.current[index].value = char;
            }
        });
    } // ⬅️ FIX: Added missing closing brace

    // Step 1: Send Email OTP
    const onSubmitEmail = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post(backendUrl + '/api/auth/send-reset-otp', { email });
            console.log(data);
            if (data.success) {
                toast.success(data.message);
                setIsEmailSent(true); // Move to OTP step
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    // ⬅️ ADDED: Step 2: Verify OTP
    const onSubmitOtp = async (e) => {
        e.preventDefault();
        const otpArray = inputRefs.current.map(e => e.value); // Safety check for null refs
        const otp = otpArray.join('');
        setOtp(otp);
        seIsOtpSubmited(true)
    }

    // ⬅️ ADDED: Step 3: Reset Password
    const onSubmitNewPassword = async (e) => {
        e.preventDefault();
        
        try {
            const { data } = await axios.post(backendUrl + '/api/auth/reset-password', { email, newPassword,otp});
            if (data.success) {
                toast.success(data.message);
                navigate('/login'); // Or home page
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }
    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-purple-400">
            <img
                onClick={() => navigate("/")}
                src={assets.logo}
                alt="App Logo"
                className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
            />
            {/* Step 1: Email Input (if email hasn't been successfully sent) */}
            {!isEmailSent && 
                <form onSubmit={onSubmitEmail} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
                    <h1 className='text-white text-2xl font-semibold text-center mb-4'>Reset Password</h1>
                    <p className='text-center mb-6 text-indigo-300'>Enter your registered email address</p>
                    <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
                        <img src={assets.mail_icon} alt="" className='w-3 h-3'/>
                        <input 
                            type="email" 
                            placeholder='Email Id' 
                            className='bg-transparent outline-none text-white w-full'
                            value={email} 
                            onChange={e => setEmail(e.target.value)} 
                            required 
                        />
                    </div>
                    <button type="submit" className='w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full mt-3'>Submit</button>
                </form>
            }
            {/* Step 2: OTP Verification (if email is sent and OTP is NOT submitted) */}
            {isEmailSent && !isOtpSubmited && 
                <form onSubmit={onSubmitOtp} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm' >
                    <h1 className='text-white text-2xl font-semibold text-center mb-4'>Reset Password Otp</h1>
                    <p className='text-center mb-6 text-indigo-300'>Enter the 6-digit code sent on your email id.</p>
                    <div className='flex justify-between mb-8 ' onPaste={handlePaste}>
                        {Array(6).fill(0).map((_,index)=>(
                            <input 
                                className='w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md' 
                                type="text" 
                                maxLength='1' 
                                key={index} 
                                required 
                                ref={e =>inputRefs.current[index]=e}
                                onInput={(e)=> handleInput(e,index)}
                                onKeyDown={(e)=>handleKeyDown(e,index)}
                            />
                        ))}
                    </div>
                    <button type="submit" className='w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full'>Verify OTP</button>
                </form>
            }
            {/* Step 3: New Password Input (if both email is sent AND OTP is submitted) */}
            {isEmailSent && isOtpSubmited &&
                <form onSubmit={onSubmitNewPassword} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
                    <h1 className='text-white text-2xl font-semibold text-center mb-4'>New password below</h1>
                    <p className='text-center mb-6 text-indigo-300'>Enter a new password for {email}</p>
                    <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
                        {/* Assuming assets.lock_icon is available */}
                        <img src={assets.lock_icon} alt="" className='w-3 h-3'/> 
                        <input 
                            type="password" 
                            placeholder='New Password' 
                            className='bg-transparent outline-none text-white w-full'
                            value={newPassword} 
                            onChange={e => setNewPassword(e.target.value)} 
                            required 
                        />
                    </div>
                    <button type="submit" className='w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full mt-3'>Submit New Password</button>
                </form> 
            }
        </div>
    )
}

export default ResetPassword