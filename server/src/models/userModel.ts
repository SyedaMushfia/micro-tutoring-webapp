import mongoose, {Document, Model} from "mongoose";

interface TutorProfile {
  qualification?: string;
  experience?: string;
  subjects?: string[];
  bio?: string;
  profilePicture?: string;
  earnings?: number;
}

interface StudentProfile {
  grade?: string;
  curriculum?: string;
  gender?: string;
  profilePicture?: string;
  institutionOrSchool?: string;
  balance?: number;
  savedCard?: {
    cardName: string;
    cardNumber: string;
    expiry: string;
  };
}

const tutorSchema = new mongoose.Schema({
  qualification: String,
  experience: String,
  subjects: [String],
  bio: String,
  profilePicture: String,
  earnings: { type: Number, default: 0 },
}, { _id: false });

const studentSchema = new mongoose.Schema({
  grade: String,
  curriculum: String,
  gender: String,
  profilePicture: String,
  institutionOrSchool: String,
  balance: { type: Number, default: 0 },
  savedCard: {
    cardName: String,
    cardNumber: String,
    expiry: String
  }
}, { _id: false });


interface User extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: "tutor" | "student";
  isOnline: boolean;
  socketId?: string;
  tutor?: TutorProfile;
  student?: StudentProfile;
}


const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["tutor", "student"], required: true },
  isOnline: { type: Boolean, default: false },
  socketId: { type: String },

  tutor: {
    type: tutorSchema,
    default: undefined
  },

  student: {
    type: studentSchema,
    default: undefined
  }

}, { timestamps: true });


const userModel: Model<User> = mongoose.models.User || mongoose.model<User>('User', userSchema);

export default userModel;