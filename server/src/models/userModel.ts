import mongoose, {Document, Model} from "mongoose";

interface User extends Document {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: string;
    isOnline: boolean;
    socketId: string;
    tutor?: {
        qualification: string;
        experience: string;
        subjects: [String];
        profilePicture: string;
        bio: string;
        rating: number;
    };
    student?: {
        grade: string;
        curriculum: string;
        gender: string;
        profilePicture: string;
        institutionOrSchool: string;
    }
}

const userSchema = new mongoose.Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    role: { type: String, enum: ["tutor", "student"], required: true },
    isOnline: { type: Boolean, default: false },
    socketId: { type: String },
    tutor: {
        qualification: String,
        experience: String,
        subjects: { type: [String], default: undefined },
        bio: String,
        profilePicture: String,
        rating: { type: Number, default: 4 }
    },
    student: {
        grade: String,
        curriculum: String,
        gender: String,
        profilePicture: String,
        institutionOrSchool: String,
    },
}, { timestamps: true });

const userModel: Model<User> = mongoose.models.User || mongoose.model<User>('User', userSchema);

export default userModel;