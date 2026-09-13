import { BsRobot } from "react-icons/bs";
import { IoSparkles } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
import { motion } from "motion/react"

import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../utils/firebase";
import { serverURL } from "../App";
import axios from 'axios';
import { setUserData } from "../redux/userSlice";
import {useDispatch} from "react-redux"

const Auth = ({isModel=false}) => {
    const dispatch=useDispatch()

    const handleGoogleAuth =async () =>{
        try{
            const response =await  signInWithPopup(auth,provider);
            let User=response.user;
            let name=User.displayName;
            let email=User.email;
            const result= await axios.post(serverURL + "/api/auth/google",
                {name,email},{withCredentials:true}
            )
            console.log(result)
            dispatch(setUserData(result.data))

        }
        catch(error){
            // console.log(`Auth error: ${error}`);
            console.log("Auth error:", error?.response?.data || error.message);
            dispatch(setUserData(null))
        }
    }
return (
<div className={`w-full ${isModel
    ? "py-4":"min-h-screen bg-[#f3f3f3] flex items-center justify-center px-6 py-20"
}`}>
    <motion.div
    initial={{opacity:0,y:-40}}
    animate={{opacity:1,y:0}}
    transition={{duration:1.05}}
    className={`w-full
        ${isModel ?"max-w-md p-8 rounded-3xl" :"max-w-lg p-12 rounded-[32px"}
        bg-white shadow-2xl border border-gray-200 `}>
    <div className="flex items-center justify-center gap-3 mb-6">
        <div className="bg-black text-white p-2 rounded-lg "><BsRobot size={18}/></div>
        <h2 className="font-semibold text-lg">InterviewIQ.AI</h2>
    </div>
    <h1 className="text-2xl md:text-3xl font-semibold
    text-center leading-snug mb-4">
    Continue with
    <span className="bg-green-100 text-green-600 px-3 py-1
    rounded-full inline-flex items-center gap-2"><IoSparkles size={16}/>
    AI Smart Interview
    </span>
    </h1>
    <p className="text-gray-500 text-center text-sm md:text-base
    leading -relaxed mb-8">
        Sign in to start AI-powered mock interviews,track your
        progress, and unlock detailed performance insights.
    </p>
    <motion.button
    whileHover={{opacity:0.9,scale:0.96}}
    whileTap={{opacity:0.5,scale:0.98}}
    transition={1}

    className="scroll-auto w-full bg-black text-white flex items-center justify-center gap-2
    px-5 py-2  rounded-full cursor-pointer"

    onClick={handleGoogleAuth}
    ><FcGoogle size={18}/> Continue with Google</motion.button>
    </motion.div>
</div>
);
}

export default Auth;
