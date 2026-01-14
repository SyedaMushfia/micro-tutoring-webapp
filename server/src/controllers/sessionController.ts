import { Request, Response } from "../types/express";
import messageModel from "../models/messageModel";
import userModel from "../models/userModel";
import sessionModel from "../models/sessionModel";

export const getSessionMessages = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;

    if (!sessionId) {
      return res.json({ message: "Session ID is required" });
    }

    const messages = await messageModel.find({ sessionId }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.json({ message: "Failed to fetch messages" });
  }
};

export const getSessionById = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;

    if (!sessionId) {
      return res.json({ message: "Session ID is required" });
    }

    const session = await sessionModel.findOne({ sessionId });
    if (!session) {
      return res.json({ message: "Session not found" });
    }

    const tutorUser = await userModel.findById(session.tutorId);
    const studentUser = await userModel.findById(session.studentId);

    const tutor = {
      _id: tutorUser?._id,
      firstName: tutorUser?.firstName,
      lastName: tutorUser?.lastName,
      isOnline: tutorUser?.isOnline,
      profilePicture: tutorUser?.tutor?.profilePicture || null
    };

    const student = {
      _id: studentUser?._id,
      firstName: studentUser?.firstName,
      lastName: studentUser?.lastName,
      isOnline: studentUser?.isOnline,
      profilePicture: studentUser?.student?.profilePicture || null
    };

    res.json({
      sessionId: session.sessionId,
      status: session.status,
      startedAt: session.startedAt,
      duration: 20 * 60,
      tutor,
      student,
      whiteboard: session.whiteboard || { elements: [], participants: [], updatedAt: new Date() },
    });
  } catch (error) {
    console.error("Error fetching session:", error);
    res.json({ message: "Failed to fetch session" });
  }
};

export const getStudentSessionHistory = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;

    if (!studentId) {
      return res.json({ message: "Student ID is required" });
    }

    const sessions = await sessionModel.find({ studentId }).sort({ createdAt: -1 }).populate("tutorId", "firstName lastName").lean();

    const formattedSessions = sessions.map(session => ({
      sessionId: session.sessionId,
      subject: session.subject,
      question: session.question,
      tutorName: `${(session.tutorId as any)?.firstName} ${(session.tutorId as any)?.lastName}`,
      status: session.status,
      startedAt: session.startedAt,
      endedAt: session.endedAt,
      amountPaid: 250
    }));

    res.json(formattedSessions);
  } catch (error) {
    console.error("Student session history error:", error);
    res.json({ message: "Failed to fetch student session history" });
  }
};

export const getTutorSessionHistory = async (req: Request, res: Response) => {
  try {
    const { tutorId } = req.params;

    if (!tutorId) {
      return res.json({ message: "Tutor ID is required" });
    }

    const sessions = await sessionModel.find({ tutorId }).sort({ createdAt: -1 }).populate("studentId", "firstName lastName").lean();

    const formattedSessions = sessions.map(session => ({
      sessionId: session.sessionId,
      subject: session.subject,
      question: session.question,
      studentName: `${(session.studentId as any)?.firstName} ${(session.studentId as any)?.lastName}`,
      status: session.status,
      startedAt: session.startedAt,
      endedAt: session.endedAt,
      amountEarned: 250, 
    }));

    res.json(formattedSessions);
  } catch (error) {
    console.error("Tutor session history error:", error);
    res.json({ message: "Failed to fetch tutor session history" });
  }
};

export const getSessionCount = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    const role = req.user?.role;

    if (!userId || !role) {
      return res.json({ success: false, message: "Unauthorized" });
    }

    if (role === "student") {
      const count = await sessionModel.countDocuments({ studentId: userId });

      return res.json({ success: true, questionsCount: count });
    }

    if (role === "tutor") {
      const count = await sessionModel.countDocuments({ tutorId: userId });

      return res.json({ success: true, questionsCount: count });
    }

  } catch (error) {
    console.error("Session count error:", error);
    res.json({ success: false, message: "Failed to get session count" });
  }
};


