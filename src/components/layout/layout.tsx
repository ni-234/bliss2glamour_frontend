import { Outlet, Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useTheme } from "../providers/theme-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Moon, Sun, LogOut } from "lucide-react";
import { useLogout, useMe, useRefreshToken } from "@/hooks/use-auth";
import { useEffect, useState } from "react";
import AIButton from "../ai/ai-button";
import { Chat } from "../ai/chat";
import ClickOverlay from "../ai/click-overlay";

export default function Layout() {
  const [viewChat, setViewChat] = useState<boolean>(false);
  const { setTheme } = useTheme();
  const navigate = useNavigate();
  const { data: user, isError } = useMe();
  const logoutMutation = useLogout();

  const refreshTokenMutation = useRefreshToken();
  useEffect(() => {
    const interval = setInterval(() => {
      refreshTokenMutation.mutate();
    }, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [refreshTokenMutation, isError]);

  const onAdminClick = () => {
    navigate("/admin");
  };

  const onLogoutClick = async () => {
    try {
      logoutMutation.mutate();
    } catch (error) {
      console.error(error);
      navigate("/login");
    }
  };

  return (
    <main className="mx-auto w-full border-border/40 dark:border-border min-[1800px]:max-w-[1536px] min-[1800px]:border-x">
      <div className="border-b">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex w-full rounded-lg bg-card p-4 h-14 items-center justify-between">
            <Link to="/">
              <img src="/LOGO.png" alt="logo" className="h-10 w-10" />
            </Link>
            <div className="flex items-center gap-2">
              {user && user.role === "admin" && (
                <Button onClick={onAdminClick} variant={"outline"}>
                  Admin
                </Button>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setTheme("light")}>
                    Light
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("dark")}>
                    Dark
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("system")}>
                    System
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button onClick={onLogoutClick} variant={"ghost"} size="icon">
                <LogOut className="" />
              </Button>
            </div>
          </div>
          <Outlet />
          <ClickOverlay
            isVisible={viewChat}
            onClose={() => setViewChat(false)}
          />
          {viewChat && <Chat onClick={() => setViewChat(!viewChat)} />}
          {!viewChat && (
            <div className="fixed bottom-6 right-6 z-40 animate-bounce">
              <AIButton
                onClick={() => {
                  setViewChat(!viewChat);
                }}
              />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
