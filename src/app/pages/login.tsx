import { LoginForm } from "@/components/login/login-form";
import { useMe } from "@/hooks/use-auth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();
  const { data: me, isSuccess } = useMe();

  useEffect(() => {
    if (!isSuccess) return;
    if (me.role === "admin") {
      navigate("/admin", { replace: true });
    } else if (me.role === "user") {
      navigate("/", { replace: true });
    }
  }, [isSuccess, me, navigate]);

  return (
    <div className="w-full h-screen bg-[url('/img/loginbg.jpg')] bg-cover bg-center bg-opacity-50 dark:bg-opacity-30">
      <div className="grid min-h-svh lg:grid-cols-2">
        <div className="flex flex-col gap-4 p-6 md:p-10">
          <div className="flex flex-1 items-center justify-center">
            <div className="w-full max-w-xs">
              <LoginForm />
            </div>
          </div>
        </div>
        <div className="relative hidden bg-muted lg:block">
          <img
            src="/img/login.jpg"
            alt="Image"
            className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale "
          />
        </div>
      </div>
    </div>
  );
}
