import React, { useEffect, useState } from 'react'
import maleVideo from "../assets/Videos/male-ai.mp4"
import femaleVideo from "../assets/Videos/female-ai.mp4"
import Timer from './Timer'
import { correctParentTransform, motion } from "motion/react"
import {FaMicrophone,FaMicrophoneSlash, FaNewspaper} from "react-icons/fa"
import { useRef } from 'react'
import { serverURL } from "../App";
import axios from 'axios';
import {BsArrowLeft, BsArrowRight} from 'react-icons/bs'
const Step2Interview = ({interviewData, onFinish}) => {
    const {userName,interviewId,questions}=interviewData
    const [isIntrophase,setisIntrophase]=useState(true);
    const [isMicOn,setisMicOn]=useState(true);
    const recognitionRef=useRef(null);
    const [isAIPlaying,setisAIPlaying]=useState(false);
    const [currentIndex,setCurrentIndex]=useState(0);
    const [answer,setAnswer]=useState("");
    const [feedback,setFeedback]=useState("");
    const [timeLeft,settimeLeft]=useState(questions[0]?.timeLimit || 60);
    const [selectedVoice,setSelectedVoice]=useState(null);
    const [isSubmitting,setisSubmitting]=useState(false);
    const [voiceGender,setVoiceGender]=useState("female");
    const [subtitle,setsubtitle]=useState("");
    const videoRef=useRef(null);
    const currentQuestion=questions[currentIndex];
useEffect(()=>{
const loadVoices=()=>{
    const voices=window.speechSynthesis.getVoices();
    if(! voices.length) return;

    const maleVoices=voices.find(v=>
        v.name.toLowerCase().includes("david")||
        v.name.toLowerCase().includes("mark")||
        v.name.toLowerCase().includes("male")
    )
    if(maleVoices){
        setSelectedVoice(maleVoices);
        setVoiceGender("male");
        return;
    }
    const femaleVoices=voices.find(v=>
        v.name.toLowerCase().includes("zira")||
        v.name.toLowerCase().includes("samantha")||
        v.name.toLowerCase().includes("female")
    )
    if(femaleVoices){
        setSelectedVoice(femaleVoices);
        setVoiceGender("female");
        return;
    }
    setSelectedVoice(voices[0])
    setVoiceGender("female")
}
loadVoices();
window.speechSynthesis.onvoiceschanged=loadVoices;
},[])
const videoSource=voiceGender==="male" ? maleVideo : femaleVideo;

const startMic=()=>{
    if(recognitionRef.current && !isAIPlaying){
        try{
            recognitionRef.current.start();
        }catch(e){console.log(e)}
    }
}
const stopMic=()=>{
    if(recognitionRef.current){
        recognitionRef.current.stop()
    }
}

const toggleMic=()=>{
    if(isMicOn){
        stopMic();
    }
    else{
        startMic();
    }
    setisMicOn(!isMicOn)
};
// speak function
const speakText=(text)=>{
    return new Promise((resolve)=>{
        if(! window.speechSynthesis ||!selectedVoice){
            resolve();
            return;
        }
        window.speechSynthesis.cancel();


        //Add natural pauses after commas and periods
        const humanText=text
        .replace(/,/g,", ... ")
        .replace(/\./g,", ... ");

        const utterance=new SpeechSynthesisUtterance(humanText);
        utterance.voice=selectedVoice;

        //Human-like pacing
        utterance.rate=0.92; //slightly slower than normal
        utterance.pitch=1.05;
        utterance.volume=1;

        utterance.onstart=()=>{
            setisAIPlaying(true);
            stopMic();
            videoRef.current?.play();
        };
        utterance.onend = () => {
            setisAIPlaying(false);
            if(isMicOn){
                startMic();
            }

            setsubtitle("");

            videoRef.current?.pause();

            if (videoRef.current) {
                videoRef.current.currentTime = 0;
            }

            resolve();
        };

        setsubtitle(text);
        window.speechSynthesis.speak(utterance)
    });
};

useEffect(()=>{
    if(!selectedVoice){
        return ;
    }

    const runIntro=async()=>{
        if(isIntrophase){
            await speakText(
                `Hi ${userName},it's great to meet you today. I 
                hope you're feeling confident and ready.`
            );

            await speakText(
                `I,ll ask you a few questions. Just answer naturally,
                and take your time ,Let's begin.`
            );
            setisIntrophase(false);
        }
        else if(currentQuestion){
            await new Promise(r=> setTimeout(r,800));

            if(currentIndex === questions.length-1){
                await speakText("Alright, this one might be a bit more challenging.");
            }
            await speakText(currentQuestion.question);
            if(isMicOn){
                startMic();
            }
        }
    }
    runIntro();
},[selectedVoice ,isIntrophase, currentIndex])

useEffect(() => {
    if (isIntrophase) return;
    if (!currentQuestion) return;

    settimeLeft(currentQuestion.timeLimit || 60);

}, [currentIndex, isIntrophase]);

useEffect(()=>{
    if(isIntrophase)return;
    if(! currentQuestion)return;
    if(isSubmitting) return;
    const timer=setInterval(()=>{
        settimeLeft((prev)=>{
            if(prev<=1){
                clearInterval(timer);
                return 0;
            }
            return prev-1;
        })
    },1000)
    return ()=>clearInterval(timer);
},[isIntrophase,currentIndex,isSubmitting])

useEffect(()=>{
    if(!("webkitSpeechRecognition" in window)) return;
    const recognition=new window.webkitSpeechRecognition();
    recognition.lang='en-US';
    recognition.continuous=true;
    recognition.interinResults=false;

    recognition.onresult = (event) => {
        const transcript=
        event.results[event.results.length-1][0].transcript;
        setAnswer((prev)=>prev + " " + transcript);
    };

    recognitionRef.current=recognition;
},[]);

const submitAnswer=async ()=>{
    if(isSubmitting) return;
    stopMic();
    try{
        const result=await axios.post(serverURL+"/api/interview/submit-answer",{
            interviewId,
            questionIndex:currentIndex,
            answer,
            timeTaken:currentQuestion.timeLimit - timeLeft,
        },{withCredentials:true})
        setFeedback(result.data.feedback)
        speakText(result.data.feedback)
        setisSubmitting(true);
    }catch(err){
        console.log(err)
    }finally{
        setisSubmitting(false);
    }
}

const handleNext=async()=>{
    setAnswer("");
    setFeedback("");

    if(currentIndex + 1>=questions.length){
        await finishInterview();
        return;
    }
    await speakText("Alright,let's move to the next question.");

    setCurrentIndex(currentIndex +1);
    setTimeout(()=>{
        if(isMicOn) startMic();
    },500);
}

const finishInterview=async()=>{
    stopMic();
    setisMicOn(false);
    try{
        console.log("Sending:", interviewId);
        const result=await axios.post(serverURL +"/api/interview/finish",{
            interviewId},{withCredentials:true})
            console.log(result.data)
            onFinish(result.data)
    }catch(error){
        console.log(error)
    }
}

useEffect(()=>{
    if(isIntrophase)return;
    if(!currentQuestion)return;
    if(timeLeft===0 && ! isSubmitting && ! feedback){
        submitAnswer();
    }
},[timeLeft])

useEffect(()=>{
    return ()=>{
        if(recognitionRef.current){
            recognitionRef.current.stop();
            recognitionRef.current.abort();
        }
        window.speechSynthesis.cancel();
    }
},[])


    return (
        <div className='min-h-screen bg-linear-to-br from-emerald-50 via-bg-white
        to-real-100 flex items-center justify-center p-4 sm:p-6'>
            <div className='w-full max-w-350 min-h-[80vh] bg-white rounded-3xl
            shadow-2xl border border-gray-200 flex flex-col lg:flex-row
            overflow-hidden'>

                {/* //VIDEO SECTION */}
                <div className='w-full lg:w-[35%] bg-white flex flex-col align-items-center
                justify-center p-6 space-y-6 border-r border-gray-200'>
                    <div className='w-full max-w-md rounded-2xl overflow-hidden shadow-xl'>
                        <video
                        src={videoSource}
                        key={videoSource}
                        ref={videoRef}
                        muted
                        playsInline
                        preload='auto'
                        className='w-full h-auto object-cover'/>
                    </div>

                    {/* subtitle area */}
                        {subtitle &&(
                            <div className="w-full max-w-md bg-gray-50 border
                            border-gray-200 rounded-xl shadow-sm p-4">
                                <p className='text-gray-700 text-sm sm:text-base font-medium
                                text-center leading-relaxed'>{subtitle}</p>
                            </div>
                        )}

                    {/* timer area */}
                    <div className='w-full max-w-md bg-white
                    border border-gray-200 rounded-2xl shadow-md p-6 space-y-5'>
                        <div className='flex justify-between items-center'>
                        <span className='text-sm text-gray-500'>Interview Status</span>
                        { isAIPlaying && <span className='text-sm font-semibold text-emerald-600'>
                        {isAIPlaying? "AI Speaking..." :""}</span>}
                        </div>
                        <div className='h-px bg-gray-200'></div>
                        <div className='flex justify-center'>
                            <Timer timeLeft={timeLeft} totalTime={currentQuestion?.timeLimit}/>
                        </div>
                        <div className='h-px bg-gray-200'></div>
                        <div className='grid grid-cols-2 gap-6 text-center'>
                            <div>
                                <span className='text-2xl font-bold text-emerald-600'>{currentIndex+1}</span>
                                <span className='text-xs text-gray-400'>Current Questions</span>
                            </div>
                            <div>
                                <span className='text-2xl font-bold text-emerald-600'>{questions.length}</span>
                                <span className='text-xs text-gray-400'>Total Questions</span>
                            </div>
                        </div>
                    </div>

                </div>
                {/* text-section */}
                <div className='flex-1 flex flex-col p-4 sm:p-6 md:p-8 relative'>
                <h2 className='text-xl sm:text-2xl font-bold text-emerald-600 mb-6'>
                AI Smart Interview</h2>
                {! isIntrophase &&(<div className='relative mb-6 bg-gray-50 p-4 sm:p-6 rounded-2xl
                border border-gray-200 shadow-sm'>
                <p className='text-xs sm:text-sm text-gray-400 mb-2'>
                Question{currentIndex +1} of {questions.length}
                </p>
                <div className='text-base sm:text-lg font-semibold text-gray-800 leading-relaxed'>
                    {currentQuestion?.question}
                </div>
                </div>   )}
                <textarea
                onChange={(e)=>setAnswer(e.target.value)}
                value={answer}
                placeholder='Type your answer here...'
                className='flex-1 bg-gray-100 sm:p-6 rounded-2xl resize-none
                outline-none border border-gray-200 focus:ring-2
                focus:ring-emerald-500  transition text-gray-800'
                />
                {!feedback?(<div className='flex items-center gap-4 mt-6'>
                    <motion.button
                    onClick={toggleMic}
                    whileTap={{scale:0.9}}
                    className='w-12 h-12 sm:w-14 sm:h-14 flex items-center
                    justify-center rounded-full bg-black text-white
                    shadow-lg
                    '>
                    {isMicOn ? <FaMicrophone size={20}/>:<FaMicrophoneSlash size={20}/>}
                    </motion.button>
                    <motion.button
                    onClick={submitAnswer}
                    disabled={isSubmitting}
                    whileTap={{scale:0.95}}
                    className='flex-1 bg-gradient-to-r from-emerald-600 to-teal-500
                    text-white py-3 sm:py-4 rounded-2xl shadow-lg hover:opacity-90 cursor-pointer
                    transition font-semibold disabled: bg-gray-500'
                    >{isSubmitting?"Submitting...":"Submit Answer"}
                    </motion.button>
                </div>):(
                    <motion.div
                    initial={{opacity:0}}
                    animate={{opacity:1}}
                    className='mt-6 bg-emerald-50 border
                    border-emerald-200 p-5 rounded-2xl shadow-sm'
                    >
                        <p className='text-emerald-700 font-medium mb-4'>{feedback}</p>
                        <button
                        onClick={handleNext}
                        className='w-full bg-gradient-to-r from-emerald-600
                        to-teal-500 text-white py-3 rounded-xl shadow-md
                        hover:opacity-90 transition flex items-center justify-center gap-1'>Next Question<BsArrowRight size={18}/></button>
                    </motion.div>
                )}                </div>
            </div>
        </div>
    )
}

export default Step2Interview

