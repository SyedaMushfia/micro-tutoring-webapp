import type { ReactNode } from "react";

export type NavLinkType = {
  name: string;
  link: string;
}

export type InputField = {
  nameOfInput: string;
  id: string;
  type: string;
  minLength?: number;
  pattern?: string;
  ariaLabel: string;
}

export type MenuItem = {
  icon: ReactNode;
  name: string;
}

export type Role = "student" | "tutor";

export type QuestionRow = {
  id: number;
  subject: string;
  question: string;
  grade: string;
  student: string;
  image?: string;
  button?: string;
}