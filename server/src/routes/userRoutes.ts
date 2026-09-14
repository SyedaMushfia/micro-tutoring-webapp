import express from 'express'
import userAuth from '../middleware/userAuth';
import { changePassword, deleteAccount, getFavoriteTutors, getOnlineTutorsBySubject, getUserData, toggleFavoriteTutor, updateBankDetails, updateTutorProfile } from '../controllers/userController';
import fileUpload from '../middleware/fileUpload';

const userRouter = express.Router();

userRouter.get('/data', userAuth, getUserData);
userRouter.get('/favorites', userAuth, getFavoriteTutors);
userRouter.post('/favorites/:tutorId', userAuth, toggleFavoriteTutor);
userRouter.get('/online-tutors', userAuth, getOnlineTutorsBySubject);
userRouter.put('/profile', userAuth, fileUpload('profile_pictures').single('profilePicture'), updateTutorProfile);
userRouter.put('/password', userAuth, changePassword);
userRouter.put('/bank-details', userAuth, updateBankDetails);
userRouter.delete('/account', userAuth, deleteAccount);

export default userRouter;