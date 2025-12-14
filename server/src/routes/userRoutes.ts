import express from 'express'
import userAuth from '../middleware/userAuth';
import { getOnlineTutorsBySubject, getUserData } from '../controllers/userController';

const userRouter = express.Router();

userRouter.get('/data', userAuth, getUserData);
userRouter.get('/online-tutors', userAuth, getOnlineTutorsBySubject);

export default userRouter;