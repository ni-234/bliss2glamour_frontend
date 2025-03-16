import { useEffect } from "react";
import { matchPath, useNavigate } from "react-router-dom";
import { useMe } from "@/hooks/use-auth";

type ProtectedRouteProps = {
  children: React.ReactNode;
};

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const navigate = useNavigate();
  const { isError, data: me, isSuccess } = useMe();
  const pathName = window.location.pathname;

  useEffect(() => {
    const userSafePaths = ["/lesson/:lessonId"];

    const isPathSafe = userSafePaths.some((path) => {
      if (path.includes(":")) {
        return matchPath(
          {
            path,
            caseSensitive: true,
          },
          pathName
        );
      }
      return path === pathName;
    });

    if (isError || me === undefined) {
      navigate("/login");
    }
    if (isSuccess && me.role !== "admin" && !isPathSafe) {
      navigate("/");
    }
  }, [isError, isSuccess, me, navigate, pathName]);

  return children;
};
