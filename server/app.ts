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
import http from "http";
import { Server } from "socket.io";
import userModel from "./src/models/userModel";

const app: Express = express();
const server = http.createServer(app);

const port: number = parseInt(process.env.PORT as string, 10) || 4000;
connectDB();

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"], 
        credentials: true,
    }
})

const onlineTutors: Record<string, string> = {};

io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("tutor-online", async ({ userId }) => {
        const tutor = await userModel.findById(userId);

        if (!tutor || tutor.role !== "tutor") return;

        onlineTutors[socket.id] = userId;

        await userModel.findByIdAndUpdate(userId, {
            isOnline: true
        })

        socket.join("online-tutors");
        io.emit("tutor-status-updated");
    });

    socket.on("disconnect", async () => {
        const userId = onlineTutors[socket.id];

        if (userId) {
            await userModel.findByIdAndUpdate(userId, {
                isOnline: false
            });

            delete onlineTutors[socket.id];
            io.emit("tutor-status-updated");
        }

        console.log("Socket disconnected", socket.id);
    })
})

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
app.use('/api/question', questionRouter)

// Start server
server.listen(port, () => console.log(`Server running on port ${port}`));