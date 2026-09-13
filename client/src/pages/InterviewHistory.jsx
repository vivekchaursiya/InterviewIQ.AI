import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { serverURL } from '../App'
import axios from "axios"
import { FaArrowLeft } from "react-icons/fa";

const InterviewHistory = () => {
    const [interviews,setinterviews]=useState([])
    const navigate=useNavigate()

    useEffect(()=>{
        const getMyInterviews=async ()=>{
            try{
                const result=await axios.get(serverURL+"/api/interview/get-interview",
                    {withCredentials:true}
                )
                //console.log(result.data)
                setinterviews(result.data)
            }
            catch(error){
                console.log(error)
            }
        }
        getMyInterviews()
    },[])
    return (
        <div className='min-h-screen bg-linear-to-br from-gray-50 to-emerald-50
        py-10'>
        <div className='w-[90vw] lg:w-[70vw] max-w-[90%] mx-auto'>
            <div className='mb-10 w-full flex flex-wrap items-start gap-4'>
                <button
                onClick={()=>navigate("/")}
                className='mt-1 p-3 rounded-full bg-white shadow
                hover:shadow-md transition cursor-pointer'><FaArrowLeft className="text-gray-600"/></button>
                <div>
                    <h1 className='text-3xl flex-nowrap font-bold text-gray-800'>
                        Interview History
                    </h1>
                    <p className='text-gray-500 flex-nowrap mt-2'>
                        Track your past interviews and performance reports
                    </p>
                </div>

            </div>
            {interviews.length === 0 ?
            <div className='bg-white p-10 rounded-2xl shadow-2xl shadow text-center'>
                No interviews found. Start your first interview.
            </div>
            :
            <div className='grid gap-3'>
                {
                    interviews.map((items,index)=>(
                        <div className='bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300
                            cursor-pointer border border-gray-100' key={index}
                            onClick={()=>navigate(`/report/${items._id}`)}>
                                <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
                                    {/* LEFT PART */}
                                    <div>
                                        <h3 className='text-lg font-semibold text-gray-800'>
                                            {items.role}
                                        </h3>
                                        <p className='text-gray-500 text-sm mt-1'>
                                            {items.experience}.{items.mode}
                                        </p>
                                        <p className='text-gray-400 text-xs mt-2'>
                                            {new Date(items.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    {/* RIGHT PART */}
                                    <div className='flex items-center gap-6'>
                                        {/* SCORE */}
                                        <div className='text-right'>
                                            <p className='text-xl font-bold text-emerald-600'>
                                                {items.finalScore || 0}/10
                                            </p>
                                            <p className='text-xs text-gray-400'>
                                                Overall Score
                                            </p>
                                        </div>
                                        {/* STATUS BADGE */}

                                        <span className ={`px-4 py-1 rounded-full text-xs font-medium 
                                        ${items.status === "completed"
                                                ? "bg-emerald-100 text-emerald-700"
                                                :"bg-yellow-100 text-yellow-700"
                                        }`}>
                                            {items.status}
                                        </span>

                                    </div>
                                </div>
                        </div>
                    ))
                }

            </div>
            }
        </div>

        </div>
    )
}

export default InterviewHistory
