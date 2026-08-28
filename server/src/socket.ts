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
    const questionStudents = new Map<string, string>();
    const sessionTimers = new Map<string, NodeJS.Timeout>();
    const connectedUsers = new Map<string, string>();
    const wbSaveTimers = new Map<string, NodeJS.Timeout>();
    const sessionDuration = 20 * 60 * 1000;

    /*
     Start a tutoring session and sends remaining time every second.
     Update session status in database.
    */
    const startSession = async (sessionId: string, io: Server) => {
        const session = await sessionModel.findOne({ sessionId });
        if (!session) return;

        const duration = 20 * 60; // in seconds
        const startedAt = session.startedAt?.getTime() ?? Date.now();

        // Send countdown timer to users every second
        const interval = setInterval(async () => {
            const now = Date.now();
            const elapsed = Math.floor((now - startedAt) / 1000);
            const remainingTime = Math.max(duration - elapsed, 0);

            io.to(sessionId).emit("session-tick", { remainingTime });

            // Automatically end session when time is over
            if (remainingTime <= 0) {
                clearInterval(interval);
                await endSession(sessionId);
            }
        }, 1000);

        sessionTimers.set(sessionId, interval);
    };

    /*
     End a session.
     Update session status, deduct student balance,
     credit tutor earnings, and record transaction.
     */
    const endSession = async (sessionId: string) => {
        const session = await sessionModel.findOne({ sessionId }); // Fetch the session from the database
        if (!session || session.status === "Completed") return;
        // Update session status and end time
        session.status = "Completed";
        session.endedAt = new Date();
        await session.save();

        const questionPrice = 250;

        // Fetch student and tutor user records
        const student = await userModel.findById(session.studentId);
        const tutor = await userModel.findById(session.tutorId);

        // Deduct fee from student's wallet
        if (student?.student) {
            student.student.balance = (student.student.balance ?? 0) - questionPrice;
            await student.save();
        }

        // Credit fee to tutor's earnings
        if (tutor?.tutor) {
            tutor.tutor.earnings = (tutor.tutor.earnings ?? 0) + questionPrice;
            await tutor.save();
        }

        // Record the transaction in the earnings collection
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

        // Notify both student and tutor via Socket.IO about the session end and updated balances
        io.to(sessionId).emit("session-ended", {
            studentAmountDeducted: questionPrice,
            tutorAmountCredited: questionPrice
        });
    };

    // Handle new socket connections
    io.on("connection", (socket) => {
        console.log("Socket connected:", socket.id);

        // Listen for tutor coming online
        socket.on("tutor-online", async ({ userId }) => {
            // Validate user role
            const tutor = await userModel.findById(userId);
            if (!tutor || tutor.role !== "tutor") return;

            // Give each tutor a stable room for incoming requests.
            onlineTutors.set(userId, socket.id);
            socket.join(`tutor:${userId}`);
            socket.data.tutorId = userId;

            // Update tutor's online status in database
            await userModel.findByIdAndUpdate(userId, {
                isOnline: true
            })

            // Notify all clients about tutor status change
            io.emit("tutor-status-updated", { userId, isOnline: true });
            console.log("Socket connected", socket.id);
        });

        // Listen for student coming online
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

        // Student send question request to tutor. Start 60-second timer for tutor response
        socket.on("send-question-request", (payload) => {
            const expiresAt = Date.now() + 60000;
            const tutorSocketId = onlineTutors.get(payload.tutorId);
            const tutorTarget = tutorSocketId ?? `tutor:${payload.tutorId}`;

            // Send directly to the registered socket, with the tutor room as fallback.
            io.to(tutorTarget).emit("question-request", { ...payload, expiresAt });
            console.log("Question requested to tutor:", payload.tutorId);

            // Start 60-second timer for tutor acceptance
            const timer = setTimeout(() => {

                // Notify both tutor and student that request expired
                io.to(tutorTarget).emit("request-expired", {
                    questionId: payload.questionId,
                    tutorId: payload.tutorId,
                    expiresAt,
                });

                socket.emit("request-expired", {
                    questionId: payload.questionId,
                    tutorId: payload.tutorId,
                    expiresAt,
                });

                // Remove expired request timer
                questionTimers.delete(payload.questionId);
                questionStudents.delete(payload.questionId);
            }, 60000)

            // Store the timer so it can be cancelled if the tutor accepts the request
            questionTimers.set(payload.questionId, timer);
            questionStudents.set(payload.questionId, socket.id);

            socket.emit("question-request-sent", {
                questionId: payload.questionId,
                tutorId: payload.tutorId,
                expiresAt,
            });
        })

        // Tutor accepts question and session is created
        socket.on("accept-question", async (data) => {
            const { questionId, tutorId, studentId } = data;
            const requestStudentSocket = questionStudents.get(questionId);

            const requestTimer = questionTimers.get(questionId);
            if (requestTimer) {
                clearTimeout(requestTimer);
                questionTimers.delete(questionId);
            }
            questionStudents.delete(questionId);

            const questionDoc = await questionModel.findById(questionId); // Retrieve question details for session creation

            if (!questionDoc) {
                return socket.emit("request-failed", { reason: "Question not found" });
            }

            const sessionId = `session_${questionId}_${Date.now()}`; // Generate a unique session identifier

            // Create a new active session linking student and tutor
            await sessionModel.create({ 
                sessionId, 
                tutorId, 
                studentId, 
                questionId, 
                subject: questionDoc.subject, 
                question: questionDoc.question, 
                status: "Active", 
                startedAt: new Date() });
            
            // Retrieve connected socket IDs for both users
            const tutorSocket = socket.id;
            const studentSocket = requestStudentSocket ?? connectedUsers.get(studentId);

            // Notify tutor and student that session has started
            io.to(tutorSocket).emit("question-accepted", { sessionId });
            if (studentSocket) io.to(studentSocket).emit("question-accepted", { sessionId });

            // Start session timer function
            startSession(sessionId, io);
        })

        // Register user socket for direct communication
        socket.on("register-user", ({ userId }) => {
            connectedUsers.set(userId, socket.id);
        })

        /*
        Remove a user from the connectedUsers map.
        This is used when a user manually logs out or closes the session
        without fully disconnecting the socket connection.
        */
        socket.on("disconnect-user", () => {
            for (const [userId, socketId] of connectedUsers.entries()) {
                if (socketId === socket.id) {
                    connectedUsers.delete(userId);
                }
            }
        })

        // Join both student and tutor to a shared Socket.IO room for the session
        socket.on("join-session", async ({ sessionId, userId }) => {
            socket.join(sessionId);
            console.log(`${userId} joined session: ${sessionId}`);
            
        });


        // Handle incoming chat messages during an active session
        socket.on("send-message", async (data) => {
            const {sessionId, senderId, senderName, message, image} = data;

            // Validate required data before processing
            if (!sessionId || (!message && !image)) return;

            // Persist message to database for session history
            const newMessage = await messageModel.create({ sessionId, senderId, senderName, message, image });

            // Broadcast message to all participants in the session room
            io.to(sessionId).emit("receive-message", newMessage)
        })

        // Join a user to the whiteboard session room.
        socket.on("wb:join", async (data) => {
            const { sessionId, userId } = data;

            if (!sessionId) return;

            socket.join(sessionId);

            const session = await sessionModel.findOne({sessionId});

            if (!session) return;

            if (session.whiteboard?.elements?.length) {
                socket.emit("wb:load", {
                    elements: session.whiteboard.elements,
                    files: session.whiteboard.files ?? {},
                });
            }

            console.log(`WB: ${userId} joined ${sessionId}`);
        })

        // Broadcast real-time pointer or cursor movement to other participants in the same whiteboard session.
        socket.on("wb:pointer", (data) => {
            const { sessionId, payload } = data;

            if (!sessionId) return;

            socket.to(sessionId).emit("wb:pointer", payload);
        })

        // Broadcast viewport changes from the hand/pan tool.
        socket.on("wb:viewport", (data) => {
            const { sessionId, viewport } = data;
            if (!sessionId || !viewport) return;

            socket.to(sessionId).emit("wb:viewport", viewport);
        })

        // Listen for whiteboard updates sent by a user
        socket.on("wb:elements", async (data) => {
            const { sessionId, elements, files } = data;
            if (!sessionId || !Array.isArray(elements)) return;

            // Keep the latest active-session state available to participants joining later.
            // Broadcast whiteboard changes to other participants in real time
            socket.to(sessionId).emit("wb:elements", { elements, files: files ?? {} });

            // wbSaveTimers is a Map to store a timer for each session to control when whiteboard data is saved to the database.
            // This is done to prevent every single drawing update trigger a database write, which would make it slow.
            // Each session has its own timer stored in this Map (key = sessionId, value = timer).
            // So wait 1 second after the last drawing update before saving
            // If a new update comes within that second, cancel the old timer and start a new one
            // This way, only the final version of the whiteboard is saved.

            // Check if a save timer already exists for this session
            if (wbSaveTimers.has(sessionId)) {
                clearTimeout(wbSaveTimers.get(sessionId)!); // Cancel the old timer
            }

            // Start a new timer to save the whiteboard to the database after 1 second
            const timer = setTimeout( async () => {
                await sessionModel.findOneAndUpdate( 
                    { sessionId }, 
                    { whiteboard: {
                        elements, // Save latest whiteboard elements
                        files: files ?? {},
                        participants: [], 
                        updatedAt: new Date() }}); // Record the time of save

                wbSaveTimers.delete(sessionId); // After saving, remove the timer from the Map to allow future updates
            }, 1000); // Wait 1 second before saving

            // Store the timer in the Map so it can be cancelled if more updates come in quickly
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

        socket.on("rating-submitted", (data) => {
            if (!data?.tutorId) return;
            io.emit("rating-submitted", data);
        });

        // Automatically triggered when the socket connection is lost. Update user online status in memory and database and notify other clients.
        socket.on("disconnect", async () => {
            const tutorId = socket.data.tutorId;
            const studentId = socket.data.studentId

            if (tutorId) {
                if (onlineTutors.get(tutorId) === socket.id) {
                    onlineTutors.delete(tutorId);
                    await userModel.findByIdAndUpdate(tutorId, {
                        isOnline: false
                    });
                    io.emit("tutor-status-updated", { userId: tutorId, isOnline: false });
                }
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
