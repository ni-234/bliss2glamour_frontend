import { SignUpForm } from "@/components/login/register-form";
import { useMe } from "@/hooks/use-auth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function SignUpPage() {
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
    <div
      className="w-full h-screen bg-cover bg-center bg-opacity-50 dark:bg-opacity-30"
      style={{ backgroundImage: "url(/img/signUp.jpg)" }}
    >
      <div className="flex min-h-svh flex-col ml-[15px] sm:ml-[200px] md:ml-[300px] justify-center gap-6 p-6 md:p-10">
        <div className="flex max-w-sm flex-col gap-6">
          <SignUpForm />
        </div>
      </div>
    </div>
  );
}
