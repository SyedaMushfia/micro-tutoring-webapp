import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload, Secret } from "jsonwebtoken"
import userModel from "../models/userModel";

interface JwtPayloadType extends JwtPayload {
  id: string;
}

const userAuth = async (req: Request, res: Response, next: NextFunction) => {

  let token; 

  // Check if JWT token exists in HTTP-only cookies
  if (req.cookies.token) {
    try {
      token = req.cookies.token;

      // Retrieve secret key from environment variables
      const secret = process.env.JWT_SECRET;
      if (!secret) throw new Error("JWT_SECRET not defined");

      // Verify token and decode payload
      const decoded = jwt.verify(token, secret) as JwtPayloadType;

      // Fetch authenticated user from database excluding password
      (req as any).user = await userModel.findById(decoded.id).select('-password');

      // Allow request to proceed to protected route
      next()
      
    } catch (error: any) {
      // Token verification failed or token expired
      return res.json({success: false, message: 'Not authorized, token failed'});
    }
  } else {
    // Token not found in request
    return res.json({success: false, message: 'Not authorized, no token'})
  }
};

export default userAuth;