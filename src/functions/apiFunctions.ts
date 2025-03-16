// Endpoints Calling 
import {
  APIError,
  INetworkFunction,
  LessonFormType,
  LessonResponse,
  LoginFormType,
  LoginResponse,
  SignUpFormType,
  UserResponse,
  QuizResponse,
  QuizResultResponse,
  CreateQuizRequest,
  SubmitQuizRequest,
} from "@/lib/types";
import { networkFunctions } from "./networkFunctions";

const throwError = async (response: Response) => {
  const r = await response.json();
  throw new APIError(response.status, r.detail);
};

export const loginFunction = async (
  data: LoginFormType
): Promise<LoginResponse> => {
  const qs = new URLSearchParams();
  qs.append("username", data.email);
  qs.append("password", data.password);
  const config: INetworkFunction = {
    request: "/api/auth/login",
    method: "POST",
    body: qs,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    credentials: "include",
  };
  const response = await networkFunctions(config);
  if (!response.ok) {
    await throwError(response);
  }
  return response.json() as Promise<LoginResponse>;
};

export const signupFunction = async (data: SignUpFormType): Promise<void> => {
  const config: INetworkFunction = {
    request: "/api/auth/signup",
    method: "POST",
    body: JSON.stringify({
      first_name: data.first_name,
      last_name: data.last_name,
      username: data.email,
      password: data.password,
    }),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  };
  const response = await networkFunctions(config);
  if (!response.ok) {
    console.log(response);
    await throwError(response);
  }
};

export const refreshTokenFunction = async (): Promise<LoginResponse> => {
  const config: INetworkFunction = {
    request: "/api/auth/refresh",
    method: "POST",
    credentials: "include",
  };
  const response = await networkFunctions(config);
  if (!response.ok) {
    await throwError(response);
  }
  return response.json() as Promise<LoginResponse>;
};

export const getMeFunction = async (
  access_token: string
): Promise<UserResponse> => {
  const config: INetworkFunction = {
    request: "/api/user/me",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${access_token}`,
    },
  };
  const response = await networkFunctions(config);
  if (!response.ok) {
    await throwError(response);
  }
  return response.json() as Promise<UserResponse>;
};

export const logoutFunction = async (access_token: string): Promise<void> => {
  const config: INetworkFunction = {
    request: "/api/auth/logout",
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${access_token}`,
    },
    credentials: "include",
  };
  const response = await networkFunctions(config);
  if (!response.ok) {
    await throwError(response);
  }
};

export const getAllUsersFunction = async (
  access_token: string
): Promise<UserResponse[]> => {
  const config: INetworkFunction = {
    request: "/api/user/all",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${access_token}`,
    },
  };
  const response = await networkFunctions(config);
  if (!response.ok) {
    await throwError(response);
  }
  return response.json() as Promise<UserResponse[]>;
};

export const updateActiveStatusFunction = async (
  access_token: string,
  id: number,
  status: boolean
): Promise<void> => {
  const config: INetworkFunction = {
    request: `/api/user/activate-status/${id}/`,
    method: "PATCH",
    query: {
      status: status,
    },
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token}`,
    },
  };
  const response = await networkFunctions(config);
  if (!response.ok) {
    await throwError(response);
  }
};

export const getAllLessonsFunction = async (
  access_token: string
): Promise<LessonResponse[]> => {
  const config: INetworkFunction = {
    request: "/api/lesson/all",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${access_token}`,
    },
  };

  const response = await networkFunctions(config);

  if (!response.ok) {
    await throwError(response);
  }
  return response.json() as Promise<LessonResponse[]>;
};

export const addLessonFunction = async (
  access_token: string,
  value: LessonFormType
): Promise<void> => {
  const formData = new FormData();
  formData.append("name", value.name);
  formData.append("thumbnail_image", value.image[0]);
  formData.append("theory_file", value.theory);
  if (value.practical) {
    formData.append("practical_file", value.practical);
  }
  if (value.consultation) {
    formData.append("consultation_sheet", value.consultation);
  }

  const config: INetworkFunction = {
    request: "/api/lesson/create",
    method: "POST",
    body: formData,
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${access_token}`,
    },
  };
  const response = await networkFunctions(config);
  if (!response.ok) {
    await throwError(response);
  }
};

export const getLessonFunction = async (
  access_token: string,
  id: number
): Promise<LessonResponse> => {
  const config: INetworkFunction = {
    request: `/api/lesson/get/${id}`,
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${access_token}`,
    },
  };
  const response = await networkFunctions(config);
  if (!response.ok) {
    await throwError(response);
  }
  return response.json() as Promise<LessonResponse>;
};

export const deleteLessonFunction = async (
  access_token: string,
  id: number
) => {
  const config: INetworkFunction = {
    request: `/api/lesson/delete/${id}`,
    method: "DELETE",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${access_token}`,
    },
  };
  const response = await networkFunctions(config);

  if (!response.ok) {
    await throwError(response);
  }
};

export const getQuizFunction = async (
  access_token: string,
  id: number
): Promise<QuizResponse> => {
  const config: INetworkFunction = {
    request: `/api/quiz/get_quiz/${id}`,
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${access_token}`,
    },
  };
  console.log("🚀 ~ id:", id);
  const response = await networkFunctions(config);
  if (!response.ok) {
    await throwError(response);
  }
  return response.json() as Promise<QuizResponse>;
};

export const getQuizResultFunction = async (
  access_token: string,
  q_id: number
): Promise<QuizResultResponse> => {
  const config: INetworkFunction = {
    request: `/api/quiz/quiz_results/${q_id}`,
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${access_token}`,
    },
  };
  console.log("🚀 ~ id:", q_id);
  const response = await networkFunctions(config);
  if (!response.ok) {
    await throwError(response);
  }
  return response.json() as Promise<QuizResultResponse>;
};

export const addQuizFunction = async (
  access_token: string,
  quizData: CreateQuizRequest
): Promise<void> => {
  const config: INetworkFunction = {
    request: `/api/quiz/create_quiz`,
    method: "POST",
    body: JSON.stringify(quizData),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token}`,
    },
  };
  const response = await networkFunctions(config);
  if (!response.ok) {
    await throwError(response);
  }
};

export const submitQuizAnswersFunction = async (
  access_token: string,
  quizAnswerData: SubmitQuizRequest
): Promise<void> => {
  const config: INetworkFunction = {
    request: `/api/quiz/submit_quiz`,
    method: "POST",
    body: JSON.stringify(quizAnswerData),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token}`,
    },
  };
  console.log("🚀 ~ config: INetworkFunction.quizAnswerData:", quizAnswerData);
  const response = await networkFunctions(config);
  if (!response.ok) {
    await throwError(response);
  }
};
