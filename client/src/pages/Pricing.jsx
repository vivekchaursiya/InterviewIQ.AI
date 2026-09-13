import React, { useEffect, useState } from 'react'
import { FaArrowLeft, FaCheckCircle } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { motion } from "motion/react"
import axios from 'axios';
import { serverURL } from '../App';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';

import Swal from 'sweetalert2'
const Pricing = () => {
    const plans =[
        {
            id:"free",
            name:"Free",
            price:"₹0",
            credits:100,
            description:"Perfect for beginners starting interview preparation.",
            features:[
                "100 AI Interview Credits",
                "Basic Performance Report",
                "Voice Interview Access",
                "Limited History Tracking",
            ],
            default:true,
        },
        {
            id:"basic",
            name:"Started Pack",
            price:"₹100",
            credits:150,
            description:"Great for focused practice and skill improvement.",
            features:[
                "150 AI Interview Credits",
                "Detailed feedback",
                "Performance Analytics",
                "Full Interview History",
            ],
        },
        {
            id:"pro",
            name:"Pro Pack",
            price:"₹500",
            credits:650,
            description:"Best value for serious job preparation.",
            features:[
                "650 AI Interview Credits",
                "Advanced AI Feedback",
                "Skill Trend Analysis",
                "Priority AI Processing",
            ],
            badge:"Best Value"
        }
    ];
    const dispatch =useDispatch();
    const navigate=useNavigate();
    const [selectedPlan,setSelectedPlan]=useState("free");
    const [loadingPlan,setLoadingPlan]=useState(null);
    const paymentHandler=async(plan)=>{
        try{
            setLoadingPlan(plan.id)

            const amount =
            plan.id==="basic" ? 100 :
            plan.id==="pro" ? 500 : 0;

            const res=await axios.post(serverURL + "/api/payment/order",{
                planId:plan.id,
                amount:amount,
                credits:plan.credits,
            }
            ,{withCredentials:true}
            );
            console.log(res.data)

            const options={
                key:import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount:res.data.amount,
                currency: "INR",
                name:"InterviewIQ.AI",
                description:`${plan.name}`-`${plan.credits} Credits`,
                order_id: res.data.id,

                handler:async function (response){
                    // console.log(response)
                    const verifypay= await axios.post(serverURL + "/api/payment/verify",
                        response,{withCredentials:true})
                        console.log("VERIFY RESPONSE:", verifypay.data);
                        dispatch(setUserData(verifypay.data.user))
                        //alert("Payment Successful Credits Added!")
                        await Swal.fire({
                        title: "Payment Successful!",
                        text: "Credits Added!",
                        icon: "success"
                        });
                        navigate("/")
                },
                theme:{
                    color:"#10b981"
                }
            }
            const rzp=new window.Razorpay(options);
            rzp.open();
            setLoadingPlan(null);
        }
        catch(error){
            console.log(error)
        }
    }

    return (
        <div className='min-h-screen bg-gradient-to-br from-white via-emerald-50 to-emerald-100
        py-16 px-6'>
            <div className='max-w-6xl mx-auto mb-14 flex items-start gap-4'>
                <button onClick={()=>navigate("/")} className='mt-2 p-3 rounded-full bg-white shadow
                hover:shadow-md transition cursor-pointer'>
                    <FaArrowLeft className='text-gray-600'/>
                </button>
                <div className='text-center w-full'>
                    <h1 className='text-4xl font-bold text-gray-800'>
                        Choose Your Plan
                    </h1>
                    <p className='text-gray-500 mt-3 text-lg'>
                        Flexible pricing to match your interview preparation goals.
                    </p>
                </div>
            </div>
            {/* //CARD MAPPING */}
            <div className='grid md:grid-cols-2 lg:grid-cols-3 max-w-6xl gap-8 mx-auto'>
                {
                    plans.map((plan)=>{
                        const isSelected=selectedPlan===plan.id
                        return(
                            <motion.div
                            key={plan.id}
                            whileHover={!plan.default && {scale:1.05}}
                            onClick={()=>!plan.default && setSelectedPlan(plan.id)}
                            className={`relative rounded-3xl p-8 transition-all duration-300
                                ${
                                    isSelected ?
                                    "border-2 border-emerald-600 shadow-2xl bg-white"
                                    :
                                    "border-2 border-gray-200 bg-white shadow-md"
                                }
                                ${plan.default ? "cursor-default" : "cursor-pointer"}
                                `}
                            >
                                {plan.default && (
                                    <div className='absolute top-4 right-[-2%] bg-gray-200
                                    text-gray-700 text-xs px-3 py-1 rounded-full'>
                                        Default
                                    </div>
                                )}
                                {/* Badge */}
                                {plan.badge && (
                                    <div className='absolute top-4 right-[-2%] text-white
                                    text-xs px-3 py-1 rounded-full bg-emerald-600'>
                                        {plan.badge}
                                    </div>
                                )}
                                
                                {/* Plan Name */}
                                <h3 className='text-xl font-semibold text-gray-800'>
                                    {plan.name}
                                </h3>
                                {/* Price */}
                                <div className='mt-4'>
                                    <span className='text-3xl font-bold text-emerald-600'>
                                        {plan.price}
                                    </span>
                                    <p className='text-gray-500 mt-1'>
                                        {plan.credits} Credits
                                    </p>
                                </div>
                                {/* Description */}
                                <p className='text-gray-500 mt-4 text-sm leading-relaxed'>
                                    {plan.description}
                                </p>

                                {/* Features */}
                                <div className='mt-6 space-y-3 text-left'>
                                    { 
                                        plan.features.map((feature,i)=>(
                                            <div key={i} className='flex items-center gap-3'>
                                                <FaCheckCircle className='text-emerald-500 text-sm '/>
                                                <span className='text-gray-700 text-sm'>
                                                    {feature}
                                                </span>
                                            </div>
                                        ))
                                    }
                                    {
                                        !plan.default &&
                                        <button
                                        disabled={loadingPlan === plan.id}
                                        onClick={(e)=>{e.stopPropagation();
                                            if(! isSelected){
                                                setSelectedPlan(plan.id)
                                            }else{
                                                paymentHandler(plan)
                                            }
                                        }}
                                        className={`w-full mt-8 py-3 rounded-xl font-semibold
                                        transition ${
                                            isSelected
                                            ?
                                            "bg-emerald-600 text-white hover:opacity-90"
                                            :
                                            "bg-gray-100 text-gray-700 hover:bg-emerald-50"
                                        }`}>
                                            {loadingPlan=== plan.id
                                            ? "Processing..."
                                            : isSelected
                                            ? "Process to Pay"
                                            : "Select Plan"
                                        }
                                        </button>
                                    }
                                </div>


                            </motion.div>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default Pricing
