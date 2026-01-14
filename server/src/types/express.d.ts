import { Request as Req, Response as Res, NextFunction as Next } from "express";

interface User {
  user?: {
    _id: string;
    firstName: string;
    lastName: String;
    email: string;
    password: String,
    role: String,
  };
}

export type Request = Req & User;
export type Response = Res & User;
export type NextFunction = Next;