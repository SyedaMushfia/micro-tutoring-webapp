import { Request, Response } from "../types/express";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from "../models/userModel";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is missing in environment variables");
}

export const registerUser = async (req: Request, res: Response) => {
    
    const { firstName, lastName, email, password, role } = req.body;

    if (!firstName || !lastName || !email || !password || !role) {
        return res.json({success: false, message: 'Missing Details'})
    }

    try {
        const existingUser = await userModel.findOne({email});

        if (existingUser) {
            return res.json({ success: false, message: "User already exists"});
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new userModel({firstName, lastName, email, password: hashedPassword, role, isOnline: false});

        await user.save();

        const token = jwt.sign({id: user._id}, JWT_SECRET, { expiresIn: '7d'})

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        user.isOnline = true;
        await user.save();

        return res.json({success: true, userId: user._id});

    } catch (error: any) {
        res.json({success: false, message: error.message})
    }
}

export const loginUser = async (req: Request, res: Response) => {
    const {email, password} = req.body;

    if (!email || !password) {
        return res.json({success: false, message: 'Email and password are required'})
    }   

    try {
        const user = await userModel.findOne({email});

        if (!user) {
            return res.json({success: false, message: 'Invalid email. Try again!'})
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.json({success: false, message: 'Invalid password. Try again!'})
        }

        const token = jwt.sign({id: user._id}, JWT_SECRET, { expiresIn: '7d'})

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

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

        if (userId) {
            await userModel.findByIdAndUpdate(userId, { isOnline: false });
        }

        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            path: "/"
            // maxAge: 7 * 24 * 60 * 60 * 1000
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
    console.log("REQ BODY:", req.body);
console.log("REQ USER:", req.user);

    try {

        const userID = (req as any).user;
        const role = userID.role;
        
        const { qualification, experience, subjects, bio, grade, curriculum, gender, institutionOrSchool } = req.body;

        let profilePicture = undefined;

        if (req.file) {
            profilePicture = (req.file).path;
        }

        if (role === 'tutor') {
            const updatedUser = await userModel.findByIdAndUpdate(
            userID._id, 
            {tutor: 
                {qualification, experience, subjects, bio, profilePicture: profilePicture}
            }, 
            {new: true});

            res.json({success: true, message: "Setting up the profile is complete!", user: updatedUser})
        } else if (role === 'student') {
            const updatedUser = await userModel.findByIdAndUpdate(
            userID._id, 
            {student: 
                {grade, curriculum, gender, institutionOrSchool, profilePicture: profilePicture}
            }, 
            {new: true});

            res.json({success: true, message: "Setting up the profile is complete!", user: updatedUser})
        } else {
            return res.json({ success: false, message: "Role is invalid"})
        }
        
    } catch (error: any) {
        return res.json({ success: false, message: error.message });
    }
};

export const getUserProfile = async (req: Request, res: Response) => {
    try {
        if (!req.user || !req.user._id) {
            return res.json({ message: 'Not authorized' });
        }

        const user = await userModel.findById(req.user._id).select('-password');

        if (!user) {
            return res.json({ message: 'User not found' });
        }

        return res.json({ success: true, user});

    } catch (error: any) {
        return res.json({ message: error.message });
    }
};
