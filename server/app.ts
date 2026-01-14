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
import http from "http";
import { Server } from "socket.io";
import { setupSocket } from "./src/socket";

const app: Express = express();
const server: http.Server = http.createServer(app);

const port: number = parseInt(process.env.PORT as string, 10) || 4000;
connectDB();

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"], 
        credentials: true,
    }
})

setupSocket(io);


// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))

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

// Start server
server.listen(port, () => console.log(`Server running on port ${port}`));