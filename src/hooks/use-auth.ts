import {
  getMeFunction,
  loginFunction,
  logoutFunction,
  refreshTokenFunction,
} from "@/functions/apiFunctions";
import { APIError } from "@/lib/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const useLogin = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationKey: ["login"],
    mutationFn: loginFunction,
    onSuccess: (data) => {
      localStorage.setItem("access_token", data.access_token);
      queryClient.setQueryData(["login"], data);

      queryClient.fetchQuery({
        queryKey: ["me"],
        queryFn: () =>
          getMeFunction(data.access_token).then((user) => {
            if (user.role === "admin") {
              navigate("/admin");
            } else {
              navigate("/");
            }
          }),
      });
    },

    onError: (error: APIError) => {
      if (error.status && error.status === 400) {
        toast.error(error.message, {
          position: "bottom-left",
        });
      }
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationKey: ["logout"],
    mutationFn: () =>
      logoutFunction(localStorage.getItem("access_token") as string),
    onSuccess: () => {
      localStorage.removeItem("access_token");
      queryClient.clear();
      navigate("/login");
    },
  });
};

export const useRefreshToken = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["refreshToken"],
    mutationFn: refreshTokenFunction,
    onSuccess: (data) => {
      localStorage.setItem("access_token", data.access_token);
      queryClient.setQueryData(["login"], data);
    },
  });
};

export const useMe = () => {
  return useQuery({
    queryKey: ["me"],
    queryFn: () =>
      getMeFunction(localStorage.getItem("access_token") as string),
    enabled: !!localStorage.getItem("access_token"),
    refetchInterval: 10000,
  });
};
