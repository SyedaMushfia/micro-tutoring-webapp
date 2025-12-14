import express from "express";
import { getUserProfile, isAuthenticated, loginUser, logoutUser, registerUser, setupProfile } from "../controllers/authController";
import userAuth from "../middleware/userAuth";
import fileUpload from "../middleware/fileUpload";

const authRouter = express.Router();

authRouter.post('/register', registerUser);
authRouter.post('/setup-profile', userAuth, fileUpload("profile_pictures").single("profilePicture"), setupProfile);
authRouter.post('/login', loginUser);
authRouter.post('/logout', userAuth, logoutUser);
authRouter.get('/is-authenticated', userAuth, isAuthenticated);
authRouter.get('/profile', userAuth, getUserProfile);

export default authRouter;
