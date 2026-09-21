import dotenv from "dotenv";
dotenv.config();

import express from "express";
import type { Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./src/config/db";
import authRouter from './src/routes/authRoutes'
import userRouter from './src/routes/userRoutes'
import questionRouter from './src/routes/questionRoutes'
import sessionRouter from './src/routes/sessionRoutes'
import chatRouter from './src/routes/chatRoutes'
import rechargeRouter from './src/routes/rechargeRoutes'
import earningRouter from "./src/routes/earningRoutes";
import reviewRouter from "./src/routes/reviewRoutes";
import http from "http";
import { Server } from "socket.io";
import { setupSocket } from "./src/socket";

const app: Express = express();
const server: http.Server = http.createServer(app);

const port: number = parseInt(process.env.PORT as string, 10) || 4000;
const allowedOrigins = [
    process.env.FRONTEND_URL,
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined,
    "https://quicktutor.vercel.app",
    "https://quicktutor.onrender.com",
    "http://localhost:5173",
    "http://localhost:3000",
].filter((origin): origin is string => Boolean(origin));

connectDB();

const io = new Server(server, {
    cors: {
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
                return;
            }

            callback(new Error("Not allowed by CORS"));
        },
        methods: ["GET", "POST"],
        credentials: true,
    }
});

setupSocket(io);

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
            return;
        }

        callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

// API Endpoints
app.get("/", (req, res) => {
    res.send("Server is running!");
});
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/question', questionRouter);
app.use('/api/session', sessionRouter);
app.use("/api/chat", chatRouter);
app.use("/api/recharge", rechargeRouter);
app.use("/api/earnings", earningRouter);
app.use("/api/reviews", reviewRouter);

// Start server
server.listen(port, () => console.log(`Server running on port ${port}`));