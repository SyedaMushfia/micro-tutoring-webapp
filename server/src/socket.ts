import { Server } from "socket.io";
import userModel from "./models/userModel";
import sessionModel from "./models/sessionModel";
import messageModel from "./models/messageModel";
import questionModel from "./models/questionModel";
import earningModel from "./models/earningModel";

export const setupSocket = (io: Server) => {
    const onlineTutors = new Map<string, string>();
    const onlineStudents = new Map<string, string>();
    const questionTimers = new Map<string, NodeJS.Timeout>();
    const sessionTimers = new Map<string, NodeJS.Timeout>();
    const connectedUsers = new Map<string, string>();
    const wbSaveTimers = new Map<string, NodeJS.Timeout>();
    const sessionDuration = 20 * 60 * 1000;

    const endSession = async (sessionId: string) => {
        const session = await sessionModel.findOne({ sessionId });
        if (!session || session.status === "Completed") return;

        session.status = "Completed";
        session.endedAt = new Date();
        await session.save();

        const questionPrice = 250;

        const student = await userModel.findById(session.studentId);
        const tutor = await userModel.findById(session.tutorId);

        if (student?.student) {
            student.student.balance = (student.student.balance ?? 0) - questionPrice;
            await student.save();
        }

        if (tutor?.tutor) {
            tutor.tutor.earnings = (tutor.tutor.earnings ?? 0) + questionPrice;
            await tutor.save();
        }

        await earningModel.create({
            tutorId: session.tutorId,
            sessionId: session.sessionId,
            questionId: session.questionId,
            subject: session.subject,
            amount: questionPrice
        });

        const timer = sessionTimers.get(sessionId);
        if (timer) {
            clearTimeout(timer);
            sessionTimers.delete(sessionId);
        }

        io.to(sessionId).emit("session-ended", {
            studentAmountDeducted: questionPrice,
            tutorAmountCredited: questionPrice
        });
    };

    io.on("connection", (socket) => {
        console.log("Socket connected:", socket.id);

        socket.on("tutor-online", async ({ userId }) => {
        onlineTutors.set(userId, socket.id);
        socket.data.tutorId = userId;

        const tutor = await userModel.findById(userId);

        if (!tutor || tutor.role !== "tutor") return;

        await userModel.findByIdAndUpdate(userId, {
            isOnline: true
        })

        io.emit("tutor-status-updated", { userId, isOnline: true });

        console.log("Socket connected", socket.id);
    });

    socket.on("student-online", async ({ userId }) => {
        onlineStudents.set(userId, socket.id);
        socket.data.studentId = userId;

        const student = await userModel.findById(userId);

        if (!student || student.role !== "student") return;

        await userModel.findByIdAndUpdate(userId, { 
            isOnline: true 
        });

        io.emit("student-status-updated", { userId, isOnline: true });
    })

    socket.on("send-question-request", (payload) => {
        const tutorSocketId = onlineTutors.get(payload.tutorId);

        if (tutorSocketId) {
            io.to(tutorSocketId).emit("question-request", payload);
            console.log("Question requested to tutor:", payload.tutorId);
        } else {
            socket.emit("request-failed", { reason: "Tutor offline" });
            return;
        }

        const timer = setTimeout(() => {
            io.to(tutorSocketId).emit("request-expired", {
                questionId: payload.questionId,
                tutorId: payload.tutorId,
            });

            socket.emit("request-expired", {
                questionId: payload.questionId,
                tutorId: payload.tutorId,
            });

            questionTimers.delete(payload.questionId);
        }, 60000)

        questionTimers.set(payload.questionId, timer);
    })

    socket.on("accept-question", async (data) => {
        const { questionId, tutorId, studentId } = data;

        const questionDoc = await questionModel.findById(questionId);

        if (!questionDoc) {
            return socket.emit("request-failed", { reason: "Question not found" });
        }

        const sessionId = `session_${questionId}_${Date.now()}`;
        const session = await sessionModel.create({ sessionId, tutorId, studentId, questionId, subject: questionDoc.subject, question: questionDoc.question, status: "Active", startedAt: new Date() });

        const timer = questionTimers.get(questionId);

        const tutorSocket = connectedUsers.get(tutorId);
        const studentSocket = connectedUsers.get(studentId);

        if (timer) {
            clearTimeout(timer);
            questionTimers.delete(questionId);
        }

        if (tutorSocket) {
            io.to(tutorSocket).emit("question-accepted", { sessionId });
        }

        if (studentSocket) {
            io.to(studentSocket).emit("question-accepted", { sessionId });
        }

        const sessionTimer = setTimeout(async () => {
            await endSession(sessionId);
        }, sessionDuration);

    sessionTimers.set(sessionId, sessionTimer);
    })

    socket.on("register-user", ({ userId }) => {
        connectedUsers.set(userId, socket.id);
    })

    socket.on("disconnect-user", () => {
        for (const [userId, socketId] of connectedUsers.entries()) {
            if (socketId === socket.id) {
                connectedUsers.delete(userId);
            }
        }
    })

    socket.on("join-session", ({ sessionId, userId }) => {
        socket.join(sessionId);
        console.log(`${userId} joined session: ${sessionId}`);
    });

    socket.on("send-message", async (data) => {
        const {sessionId, senderId, senderName, message, image} = data;

        if (!sessionId || (!message && !image)) return;

        const newMessage = await messageModel.create({ sessionId, senderId, senderName, message, image });

        io.to(sessionId).emit("receive-message", newMessage)
    })

    socket.on("wb:join", async (data) => {
        const { sessionId, userId } = data;

        if (!sessionId) return;

        socket.join(sessionId);

        const session = await sessionModel.findOne({sessionId});

        if (!session) return;

        if (session.whiteboard?.elements?.length) {
            socket.emit("wb:load", session.whiteboard.elements);
        }

        console.log(`WB: ${userId} joined ${sessionId}`);
    })

    socket.on("wb:pointer", (data) => {
        const { sessionId, payload } = data;

        if (!sessionId) return;

        socket.to(sessionId).emit("wb:pointer", payload);
    })

    socket.on("wb:elements", async (data) => {
        const { sessionId, elements } = data;

        if (!sessionId || !Array.isArray(elements)) return;

        socket.to(sessionId).emit("wb:elements", elements);

        if (wbSaveTimers.has(sessionId)) {
            clearTimeout(wbSaveTimers.get(sessionId)!);
        }

        const timer = setTimeout( async () => {
            await sessionModel.findOneAndUpdate( { sessionId }, { whiteboard: { elements, participants: [], updatedAt: new Date() }});

            wbSaveTimers.delete(sessionId);
        }, 1000);

        wbSaveTimers.set(sessionId, timer);
    })

    socket.on("end-session", async (data) => {
        try {
            const { sessionId } = data;
            await endSession(sessionId);
        } catch (error) {
            console.error("End session error:", error);
        }
    });

    socket.on("disconnect", async () => {
        const tutorId = socket.data.tutorId;
        const studentId = socket.data.studentId

        if (tutorId) {
            onlineTutors.delete(tutorId);
            await userModel.findByIdAndUpdate(tutorId, {
                isOnline: false
            });
            io.emit("tutor-status-updated", { userId: tutorId, isOnline: false });
        }

        if (studentId) {
            onlineStudents.delete(studentId);
            await userModel.findByIdAndUpdate(studentId, {
                isOnline: false
            });
            io.emit("student-status-updated", { userId: studentId, isOnline: false });
        }

    })
    });
};
