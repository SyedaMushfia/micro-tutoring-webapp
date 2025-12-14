import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload, Secret } from "jsonwebtoken"
import userModel from "../models/userModel";

interface JwtPayloadType extends JwtPayload {
  id: string;
}

const userAuth = async (req: Request, res: Response, next: NextFunction) => {

  let token; 

  if (req.cookies.token) {
    try {
      token = req.cookies.token;

      const secret = process.env.JWT_SECRET;
      if (!secret) throw new Error("JWT_SECRET not defined");

      const decoded = jwt.verify(token, secret) as JwtPayloadType;

      (req as any).user = await userModel.findById(decoded.id).select('-password');

      next()
      
    } catch (error: any) {
      return res.json({success: false, message: 'Not authorized, token failed'});
    }
  } else {
    return res.json({success: false, message: 'Not authorized, no token'})
  }
};

export default userAuth;