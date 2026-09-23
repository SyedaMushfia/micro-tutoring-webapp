import { Request, Response } from "../types/express";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from "../models/userModel";
import validator from 'validator';
import { deleteCloudinaryImage } from "../config/cloudinary";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is missing in environment variables");
}

const getCookieOptions = () => {
    const isProduction = process.env.NODE_ENV === "production" || Boolean(process.env.FRONTEND_URL);

    return {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" as const : "strict" as const,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: "/",
    };
};

const normalizeSubjects = (rawSubjects: unknown): string[] => {
    if (!rawSubjects) return [];

    if (Array.isArray(rawSubjects)) {
        return rawSubjects
            .filter((subject): subject is string => typeof subject === "string")
            .map((subject) => subject.trim())
            .filter(Boolean);
    }

    if (typeof rawSubjects === "string") {
        return rawSubjects
            .split(",")
            .map((subject) => subject.trim())
            .filter(Boolean);
    }

    return [];
};

export const registerUser = async (req: Request, res: Response) => {
    
    // Extract user details
    const { firstName, lastName, email, password, role } = req.body;

    // Input fields validation
    if (!firstName || !lastName || !email || !password || !role) {
        return res.json({success: false, message: 'Missing Details'})
    }

    if (firstName.length < 2 || lastName.length < 2) {
        return res.json({ success: false, message: 'First and last name must be at least 2 characters' });
    }

    if (!validator.isEmail(email)) {
        return res.json({ success: false, message: 'Enter a valid email' });
    }

    if (!validator.isStrongPassword(password, { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 0 })) {
        return res.json({ 
            success: false, 
            message: 'Password must have 8 chars, uppercase, lowercase, & number.' 
        });
    }

    try {
        // Check if the user already exists
        const existingUser = await userModel.findOne({email});
        if (existingUser) {
            return res.json({ success: false, message: "User already exists"});
        }

        // Hash password before storing in db
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user document
        const user = new userModel({firstName, lastName, email, password: hashedPassword, role, isOnline: false});

        await user.save();

        // Generate JWT token
        const token = jwt.sign({id: user._id}, JWT_SECRET, { expiresIn: '7d'})

        // Store JWT in HTTP-only cookie to preserve authentication state
        res.cookie('token', token, getCookieOptions());

        // Mark user as online after successful registration
        user.isOnline = true;
        await user.save();

        return res.json({success: true, userId: user._id});

    } catch (error: any) {
        res.json({success: false, message: error.message})
    }
}

export const loginUser = async (req: Request, res: Response) => {
    const {email, password} = req.body;

    // Validate required fields
    if (!email || !password) {
        return res.json({success: false, message: 'Email and password are required'})
    }   

    try {
        // Find user by email
        const user = await userModel.findOne({email});

        if (!user) {
            return res.json({success: false, message: 'Invalid email or password.'})
        }

        // Compare entered password with hashed password
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.json({success: false, message: 'Invalid email or password'})
        }

        // Generate JWT token after successful authentication
        const token = jwt.sign({id: user._id}, JWT_SECRET, { expiresIn: '7d'})

        // Store token in HTTP-only cookie
        res.cookie('token', token, getCookieOptions());

        user.isOnline = true;
        await user.save();

        return res.json({success: true, token});

    } catch (error: any) {
        return res.json({ success: false, message: error.message})
    }
}

export const logoutUser = async (req: Request, res: Response) => {
    try {
        const userId = req.user?._id;

        // Mark user as offline
        if (userId) {
            await userModel.findByIdAndUpdate(userId, { isOnline: false });
        }

        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production" || Boolean(process.env.FRONTEND_URL),
            sameSite: process.env.NODE_ENV === "production" || Boolean(process.env.FRONTEND_URL) ? "none" : "strict",
            path: "/",
        })

        return res.json({success: true, message: "Logged out successfully"})

    } catch (error: any) {
        return res.json({ success: false, message: error.message})   
    }
}

export const isAuthenticated = (req: Request, res: Response) => {
    try {
        return res.json({success: true, user: req.user});
    } catch (error: any) {
        res.json({success: false, message: error.message})
    }
}

export const setupProfile = async (req: Request, res: Response) => {

    try {
        const userID = (req as any).user;
        const role = userID?.role;

        if (!userID?._id) {
            return res.json({ success: false, message: "Not authorized" });
        }

        const { qualification, experience, bio, grade, curriculum, gender, institutionOrSchool } = req.body;
        const rawSubjects = req.body.subjects ?? req.body["subjects[]"] ?? [];
        const subjects = normalizeSubjects(rawSubjects);

        let profilePicture = userID?.tutor?.profilePicture ?? userID?.student?.profilePicture;
        if (req.file) {
            const uploadedProfilePicture = (req.file as any)?.path || (req.file as any)?.secure_url || (req.file as any)?.url;
            const previousProfile = userID?.role === 'tutor' ? userID?.tutor?.profilePicture : userID?.student?.profilePicture;
            if (uploadedProfilePicture && previousProfile && previousProfile !== uploadedProfilePicture) {
                try {
                    await deleteCloudinaryImage(previousProfile);
                } catch {
                    // ignore Cloudinary cleanup failures so profile setup can still complete
                }
            }
            profilePicture = uploadedProfilePicture || profilePicture;
        }

        if (role === 'tutor') {
            const updates: any = {
                qualification,
                experience,
                subjects,
                bio,
                ...(profilePicture ? { profilePicture } : {}),
            };

            const updatedUser = await userModel.findByIdAndUpdate(
                userID._id,
                {
                    $set: {
                        "tutor.qualification": updates.qualification,
                        "tutor.experience": updates.experience,
                        "tutor.subjects": updates.subjects,
                        "tutor.bio": updates.bio,
                        "tutor.profilePicture": updates.profilePicture,
                    },
                },
                { new: true, runValidators: true }
            ).select("-password");

            return res.json({ success: true, message: "Setting up the profile is complete!", user: updatedUser });
        }

        if (role === 'student') {
            const updatedUser = await userModel.findByIdAndUpdate(
                userID._id,
                {
                    $set: {
                        "student.grade": grade,
                        "student.curriculum": curriculum,
                        "student.gender": gender,
                        "student.institutionOrSchool": institutionOrSchool,
                        "student.profilePicture": profilePicture,
                    },
                },
                { new: true }
            ).select("-password");

            return res.json({ success: true, message: "Setting up the profile is complete!", user: updatedUser });
        }

        return res.json({ success: false, message: "Role is invalid" });

    } catch (error: any) {
        return res.json({ success: false, message: error.message });
    }
};

// Get authenticated user's profile data
export const getUserProfile = async (req: Request, res: Response) => {
    try {
        if (!req.user || !req.user._id) {
            return res.json({ message: 'Not authorized' });
        }

        // Exclude password field from response
        const user = await userModel.findById(req.user._id).select('-password');

        if (!user) {
            return res.json({ message: 'User not found' });
        }

        return res.json({ success: true, user});

    } catch (error: any) {
        return res.json({ message: error.message });
    }
};
