import { BsRobot } from "react-icons/bs";
// import { IoSparkles } from "react-icons/io5";
import { HiOutlineLogout } from "react-icons/hi";
import { FaUserAstronaut } from "react-icons/fa";
import { BsCoin } from "react-icons/bs";
import { motion } from "motion/react"
import { useDispatch, useSelector } from "react-redux"
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { serverURL } from "../App";
import axios from "axios";
import { setUserData } from "../redux/userSlice";
import AuthModel from "./AuthModel";

function  Navbar(){
    const {userData}=useSelector((state)=>state.user)
    const [showCreditpop,setshowCreditpop]=useState(false)
    const [showUserPop,setshowUserPop]=useState(false)
    const navigate=useNavigate()
    const dispatch=useDispatch()
    const [showAuth,setshowAuth]=useState(false)
    

    const handleLogout=async()=>{
        try{
            await axios.get(serverURL+"/api/auth/logout",{withCredentials:true})
            dispatch(setUserData(null))
            setshowCreditpop(false)
            setshowUserPop(false)
            navigate("/")
        }catch(error){
            console.error(error)
        }
    }
return (
<div className="bg-[#f3f3f3] flex justify-center px-4 pt-6">
    <motion.div
    initial={{opacity:0,y:-40}}
    animate={{opacity:1,y:0}}
    transition={{duration:0.3}}
    className="w-full max-w-6xl rounded-[24px] bg-white  shadow-sm
    border-gray-200  px-8 py-4 flex justify-between items-center
    relative">
        <div className="flex items-center gap-3 cursor-pointer">


            <div className="bg-black text-white p-2 rounded-lg">
                <BsRobot size={18}/>
            </div>
            <h1 className="font-semibold hidden md:block">InterviewIQ.AI</h1>
        </div>
    <div className="flex items-center gap-6">
        <div className="flex items-center gap-6 relative">
        <button onClick={()=>{
            if(!userData){
                setshowAuth(true)
                return;
            }
            setshowCreditpop(!showCreditpop)
            setshowUserPop(false)}
        }
        className="flex items-center gap-2 bg-gray-100
        px-4 py-2 rounded-full text-md hover:bg-gray-200
        transition">
            <BsCoin size={20}/>
                {userData?.credits || 0}
        </button>
        {
            showCreditpop && (
                <div className="absolute right-12.5 top-10 mt-3 w-64
                bg-white shadow-xl border border-gray-200 rounded
                p-5 z-50">
                <p className="text-sm text-gray-600 mb-4">
                    Need more credits to continue interview?
                </p>
                <button onClick={()=>navigate("/pricing")} className="w-full bg-black text-white
                py-2 rounded-lg text-sm">Buy more credits</button>

                </div>
            )
        }
    </div>
    <div className="flex items-center gap-6 relative">
        <button onClick={()=>{
            if(!userData){
                setshowAuth(true)
                return;
            }
            setshowUserPop(!showUserPop)
            setshowCreditpop(false)
        }}
        className="w-9 h-9 bg-black text-white flex items-center justify-center font-semibold
        rounded-full">
        {userData ?userData.name.slice(0,1).toUpperCase()
        :<FaUserAstronaut/>}
        </button>
        {
            showUserPop && (
                <div className="absolute right-0 top-10 mt-3 w-64
                bg-white shadow-xl border border-gray-200 rounded
                p-5 z-50">
                <p className="text-md text-blue-500 font-medium mb-1">
                    {userData?.name}
                </p>
                <button onClick={()=>navigate("/history")}
                className="w-full text-left text-sm
                py-2 hover:text-black text-gray-600">
                    Interview History
                </button>
                <button onClick={handleLogout} className="w-full text-left text-sm py-2
                flex items-center gap-2 text-red-500">
                    <HiOutlineLogout size={16}/>
                    Logout
                </button>

                </div>
            )
        }
    </div>
    </div>
    </motion.div>
    {showAuth && <AuthModel onClose={()=>setshowAuth(false)}/>}
</div>
)
}

export default Navbar
