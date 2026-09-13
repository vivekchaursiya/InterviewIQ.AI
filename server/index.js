import express from "express"
import dotenv from "dotenv"
import connectDB from "./config/connectDB.js"
import cookieParser from "cookie-parser"
dotenv.config()
import cors from "cors"
import authRouter from "./routes/auth.route.js"
import userRouter from "./routes/user.route.js"
import interviewRouter from "./routes/interview.route.js"
import paymentRouter from "./routes/payment.route.js"
import fs from "fs";
const app = express()
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}
app.use(express.json())
app.use(cookieParser())
const allowedOrigins = [
  "http://localhost:5173", // local
  "https://interviewiq-ai-client-l7hv.onrender.com" // deployed frontend
];
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}))

app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)
app.use("/api/interview", interviewRouter)
app.use("/api/payment", paymentRouter)

const PORT = process.env.PORT || 8000

// connectDB()

// app.listen(PORT,()=>{
//     console.log(`server running on PORT ${PORT}`)
// })
const startServer = async () => {
  await connectDB();   // Pehle DB connect

  app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
  });
};

startServer();
