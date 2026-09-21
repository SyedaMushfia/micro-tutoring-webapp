import { Request, Response } from "../types/express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import validator from "validator";
import userModel from "../models/userModel";
import questionModel from "../models/questionModel";
import sessionModel from "../models/sessionModel";
import reviewModel from "../models/reviewModel";
import rechargeModel from "../models/rechargeModel";
import earningModel from "../models/earningModel";
import messageModel from "../models/messageModel";

const normalizeSubjects = (subjects: unknown) => {
  if (Array.isArray(subjects)) return subjects.filter(Boolean).map(String);
  if (typeof subjects === "string") {
    return subjects
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  if (subjects && typeof subjects === "object") {
    const values = Object.values(subjects as Record<string, unknown>);
    return values.flatMap((value) => {
      if (Array.isArray(value)) return value.filter(Boolean).map(String);
      return value ? [String(value)] : [];
    });
  }
  return [];
};

export const getUserData = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.json({ success: false, message: "Not authorized" });
    }

    const user = await userModel.findById(userId).select("firstName lastName role student tutor");

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      userData: user,
    });
  } catch (error: any) {
    res.json({ success: false, message: error.message });
  }
};

export const getFavoriteTutors = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Not authorized" });
    }

    const user = await userModel.findById(userId).select("student");
    const favoriteIds = user?.student?.favoriteTutors || [];

    const favorites = await userModel
      .find({ _id: { $in: favoriteIds } })
      .select("firstName lastName tutor.profilePicture tutor.subjects");

    const formattedFavorites = favorites.map((favorite) => ({
      _id: favorite._id,
      firstName: favorite.firstName,
      lastName: favorite.lastName,
      profilePicture: favorite.tutor?.profilePicture || "",
      subjects: favorite.tutor?.subjects || [],
    }));

    return res.json({ success: true, favorites: formattedFavorites });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const toggleFavoriteTutor = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    const tutorId = req.params.tutorId;
    const favorite = req.body.favorite;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Not authorized" });
    }

    if (!tutorId) {
      return res.status(400).json({ success: false, message: "Tutor ID is required" });
    }

    const user = await userModel.findById(userId).select("student");
    if (!user || !user.student) {
      return res.status(400).json({ success: false, message: "Student profile not found" });
    }

    const currentFavorites = user.student.favoriteTutors || [];
    const tutorObjectId = new mongoose.Types.ObjectId(tutorId);
    const alreadyFavorite = currentFavorites.some((id) => id.toString() === tutorId);

    let nextFavorites: mongoose.Types.ObjectId[];
    if (typeof favorite === "boolean") {
      nextFavorites = favorite
        ? Array.from(new Set([...currentFavorites.map((id) => id.toString()), tutorId])).map((id) => new mongoose.Types.ObjectId(id))
        : currentFavorites.filter((id) => id.toString() !== tutorId);
    } else {
      nextFavorites = alreadyFavorite
        ? currentFavorites.filter((id) => id.toString() !== tutorId)
        : [...currentFavorites, tutorObjectId];
    }

    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { "student.favoriteTutors": nextFavorites },
      { new: true }
    ).select("student.favoriteTutors");

    return res.json({
      success: true,
      isFavorite: nextFavorites.some((id) => id.toString() === tutorId),
      favorites: updatedUser?.student?.favoriteTutors || [],
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateTutorProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.json({ success: false, message: "Not authorized" });
    }

    const currentUser = await userModel.findById(userId);

    if (!currentUser) {
      return res.json({ success: false, message: "User not found" });
    }

    const firstName = String(req.body.firstName ?? currentUser.firstName ?? "").trim();
    const lastName = String(req.body.lastName ?? currentUser.lastName ?? "").trim();

    if (!firstName || !lastName) {
      return res.json({ success: false, message: "First name and last name are required" });
    }

    if (currentUser.role === "student") {
      const grade = String(req.body.grade ?? currentUser.student?.grade ?? "").trim();
      const curriculum = String(req.body.curriculum ?? currentUser.student?.curriculum ?? "").trim();
      const gender = String(req.body.gender ?? currentUser.student?.gender ?? "").trim();
      const institutionOrSchool = String(req.body.institutionOrSchool ?? currentUser.student?.institutionOrSchool ?? "").trim();
      const profilePicture = req.file?.path || currentUser.student?.profilePicture;

      if (!grade || !curriculum || !gender || !institutionOrSchool) {
        return res.json({ success: false, message: "Please complete all required student profile fields" });
      }

      const updatedUser = await userModel.findByIdAndUpdate(
        userId,
        {
          firstName,
          lastName,
          student: {
            ...(currentUser.student || {}),
            grade,
            curriculum,
            gender,
            institutionOrSchool,
            profilePicture,
          },
        },
        { new: true }
      ).select("-password");

      if (!updatedUser) {
        return res.json({ success: false, message: "Profile update failed" });
      }

      return res.json({ success: true, message: "Profile updated successfully", user: updatedUser });
    }

    if (currentUser.role !== "tutor") {
      return res.json({ success: false, message: "Invalid role for profile update" });
    }

    const qualification = String(req.body.qualification ?? currentUser.tutor?.qualification ?? "").trim();
    const experience = String(req.body.experience ?? currentUser.tutor?.experience ?? "").trim();
    const bio = String(req.body.bio ?? currentUser.tutor?.bio ?? "").trim();
    const rawSubjects = req.body.subjects ?? req.body["subjects[]"] ?? currentUser.tutor?.subjects ?? [];
    const subjects = normalizeSubjects(rawSubjects);
    const profilePicture = req.file?.path || currentUser.tutor?.profilePicture;

    if (!qualification || !experience || !bio || subjects.length === 0) {
      return res.json({ success: false, message: "Please complete all required tutor profile fields" });
    }

    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      {
        firstName,
        lastName,
        tutor: {
          ...(currentUser.tutor || {}),
          qualification,
          experience,
          subjects,
          bio,
          profilePicture,
        },
      },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.json({ success: false, message: "Profile update failed" });
    }

    return res.json({ success: true, message: "Profile updated successfully", user: updatedUser });
  } catch (error: any) {
    return res.json({ success: false, message: error.message });
  }
};

export const updateBankDetails = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.json({ success: false, message: "Not authorized" });
    }

    const user = await userModel.findById(userId);

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const { bankName, accountName, accountNumber, branchCode, swiftCode } = req.body;

    if (!bankName || !accountName || !accountNumber) {
      return res.json({ success: false, message: "Bank name, account name, and account number are required" });
    }

    const bankDetails = {
      bankName: String(bankName).trim(),
      accountName: String(accountName).trim(),
      accountNumber: String(accountNumber).trim(),
      branchCode: String(branchCode || "").trim(),
      swiftCode: String(swiftCode || "").trim(),
    };

    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      {
        ...(user.role === "tutor"
          ? { tutor: { ...(user.tutor || {}), bankDetails } }
          : { student: { ...(user.student || {}), bankDetails } }),
      },
      { new: true }
    ).select("-password");

    return res.json({ success: true, message: "Bank details updated successfully", user: updatedUser });
  } catch (error: any) {
    return res.json({ success: false, message: error.message });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.json({ success: false, message: "Not authorized" });
    }

    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.json({ success: false, message: "All password fields are required" });
    }

    if (newPassword !== confirmPassword) {
      return res.json({ success: false, message: "New passwords do not match" });
    }

    if (!validator.isStrongPassword(newPassword, { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 0 })) {
      return res.json({ success: false, message: "Password must have 8 chars, uppercase, lowercase, & number." });
    }

    const user = await userModel.findById(userId);

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);

    if (!isCurrentPasswordValid) {
      return res.json({ success: false, message: "Current password is incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await userModel.findByIdAndUpdate(userId, { password: hashedPassword });

    return res.json({ success: true, message: "Password updated successfully" });
  } catch (error: any) {
    return res.json({ success: false, message: error.message });
  }
};

export const deleteAccount = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.json({ success: false, message: "Not authorized" });
    }

    await Promise.all([
      userModel.findByIdAndDelete(userId),
      questionModel.deleteMany({ userId }),
      sessionModel.deleteMany({
        $or: [{ studentId: userId }, { tutorId: userId }],
      }),
      reviewModel.deleteMany({
        $or: [{ studentId: userId }, { tutorId: userId }],
      }),
      rechargeModel.deleteMany({ userId }),
      earningModel.deleteMany({ tutorId: userId }),
      messageModel.deleteMany({ senderId: userId }),
    ]);

    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" || Boolean(process.env.FRONTEND_URL),
      sameSite: process.env.NODE_ENV === "production" || Boolean(process.env.FRONTEND_URL) ? "none" : "strict",
      path: "/",
    });

    return res.json({ success: true, message: "Account deleted successfully" });
  } catch (error: any) {
    return res.json({ success: false, message: error.message });
  }
};

export const getOnlineTutorsBySubject = async (req: Request, res: Response) => {
  try {
    const { subject } = req.query;

    if (!subject) {
      return res.json({ success: false, message: "Subject is required" });
    }

    const tutors = await userModel.find({ role: 'tutor', isOnline: true, "tutor.subjects": subject }).select("firstName lastName tutor"); 
    
    res.json(tutors);
  } catch (err) {

    res.json({ success: false, message: 'Tutors unavailable. Please try again later!' });
  }
};
