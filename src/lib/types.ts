import { z } from "zod";

export interface INetworkFunction {
  request: string;
  params?: string[];
  query?: { [key: string]: string | number | boolean | undefined };
  body?: BodyInit | null | undefined;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  headers?: { [key: string]: string };
  credentials?: RequestCredentials;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export interface UserResponse {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  role: string;
}

export const loginFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export type LoginFormType = z.infer<typeof loginFormSchema>;

export const signUpFormSchema = z
  .object({
    first_name: z.string().nonempty(),
    last_name: z.string().nonempty(),
    email: z.string().email(),
    password: z.string().min(8),
    confirm: z.string().min(8),
  })
  .superRefine(({ confirm, password }, ctx) => {
    const containsUppercase = (ch: string) => /[A-Z]/.test(ch);
    const containsLowercase = (ch: string) => /[a-z]/.test(ch);
    const containsSpecialChar = (ch: string) =>
      /[`!@#$%^&*()_\-+=\\[\]{};':"\\|,.<>\\/?~ ]/.test(ch);
    let countOfUpperCase = 0,
      countOfLowerCase = 0,
      countOfNumbers = 0,
      countOfSpecialChar = 0;
    for (let i = 0; i < password.length; i++) {
      const ch = password.charAt(i);
      if (!isNaN(+ch)) countOfNumbers++;
      else if (containsUppercase(ch)) countOfUpperCase++;
      else if (containsLowercase(ch)) countOfLowerCase++;
      else if (containsSpecialChar(ch)) countOfSpecialChar++;
    }
    if (countOfUpperCase < 1) {
      ctx.addIssue({
        code: "custom",
        message: "Password must contain at least one uppercase letter",
        path: ["password"],
      });
    }
    if (countOfLowerCase < 1) {
      ctx.addIssue({
        code: "custom",
        message: "Password must contain at least one lowercase letter",
        path: ["password"],
      });
    }
    if (countOfNumbers < 1) {
      ctx.addIssue({
        code: "custom",
        message: "Password must contain at least one number",
        path: ["password"],
      });
    }
    if (countOfSpecialChar < 1) {
      ctx.addIssue({
        code: "custom",
        message: "Password must contain at least one special character",
        path: ["password"],
      });
    }
    if (confirm !== password) {
      ctx.addIssue({
        code: "custom",
        message: "The passwords did not match",
        path: ["confirm"],
      });
    }
  });

export type SignUpFormType = z.infer<typeof signUpFormSchema>;

export class APIError extends Error {
  status?: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export interface LessonResponse {
  id: number;
  name: string;
  thumbnail_image: string;
  theory_file: string;
  practical_file?: string;
  consultation_sheet?: string;
}

export interface QuizResponse {
  id: number;
  name: string;
  lesson_id: number;
  quiz_json: string;
  quiz_answers: string;
  duration: number;
}

export interface QuizResultResponse {
  id: number;
  score: number;
  user_id: number;
  quiz_id: number;
  start_time: Date;
  end_time: Date;
  submitted_answers: string;
}

const MAX_FILE_SIZE = 500000;
export const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];
export const ACCEPTED_DOCUMENT_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export const lessonFormSchema = z
  .object({
    name: z.string().nonempty(),
    image: z
      .any()
      .refine((files) => files?.length == 1, "Image is required.")
      .refine(
        (files) => files?.[0]?.size <= MAX_FILE_SIZE,
        "Max file size is 5MB"
      )
      .refine(
        (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
        "Please upload a valid image file"
      ),
    theory: z
      .instanceof(File, { message: "Theory Document is Required" })
      .refine(
        (file) => ACCEPTED_DOCUMENT_TYPES.includes(file.type),
        "Please upload a valid document file"
      ),
    practical: z
      .instanceof(File)
      .refine(
        (file) => file?.type && ACCEPTED_DOCUMENT_TYPES.includes(file.type),
        "Please upload a valid document file"
      )
      .optional(),
    consultation: z
      .instanceof(File)
      .refine(
        (file) => file?.type && ACCEPTED_DOCUMENT_TYPES.includes(file.type),
        "Please upload a valid document file"
      )
      .optional(),
  })
  .superRefine(({ practical, consultation }, ctx) => {
    if (practical && !consultation) {
      ctx.addIssue({
        code: "custom",
        message: "Please upload consultation sheets",
        path: ["consultation"],
      });
    }
  });

export type LessonFormType = z.infer<typeof lessonFormSchema>;

export interface QuizJson {
  type: "multiple_choice" | "single_choice";
  question_id: number;
  question: string;
  answers: string[];
}

export interface Answer {
  question_id: number;
  answer: number | number[];
}

export interface QuizAnswerJson {
  question_id: number;
  answer: string[];
}

export interface CreateQuizRequest {
  name: string;
  lesson_id: number;
  quiz_json: Record<string, QuizJson[]>;
  quiz_answers: Record<string, QuizAnswerJson[]>;
  duration: number;
}

export interface SubmitQuizRequest {
  quiz_id: number;
  submitted_answers: Record<string, QuizAnswerJson[]>;
  start_time: Date;
  end_time: Date;
}
