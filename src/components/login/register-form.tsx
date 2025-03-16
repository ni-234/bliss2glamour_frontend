import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useNavigate } from "react-router-dom";
import { useFetchedQuery } from "@/hooks/use-fetched-query";
import {
  APIError,
  signUpFormSchema,
  SignUpFormType,
  UserResponse,
} from "@/lib/types";
import { toast } from "sonner";
import { signupFunction } from "@/functions/apiFunctions";

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const form = useForm<SignUpFormType>({
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      confirm: "",
    },
    resolver: zodResolver(signUpFormSchema),
  });

  const navigate = useNavigate();
  const user = useFetchedQuery(["me"]) as UserResponse;

  if (user) {
    if (user.role === "admin") {
      navigate("/admin", { replace: true });
    } else {
      navigate("/", { replace: true });
    }
  }

  const onSubmit = async (values: z.infer<typeof signUpFormSchema>) => {
    try {
      await signupFunction(values);
      toast.success("Account created successfully");
      navigate("/login");
    } catch (error: unknown) {
      if (error instanceof APIError) {
        if (error.status && error.status === 400) {
          toast.error(error.message);
          if (error.message.includes("exists")) {
            form.setError("email", {
              type: "manual",
              message: error.message,
            });
          }
        }
      }
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("flex flex-col gap-6", className)}
        {...props}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold "> Sign Up</h1>
          <p className="text-balance text-sm text-muted-foreground ">
            Enter your details below to Sign Up
          </p>
        </div>
        <FormField
          control={form.control}
          name="first_name"
          render={({ field }) => (
            <FormItem className="grid gap-2">
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input className="w-100" {...field} type="text" required />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="last_name"
          render={({ field }) => (
            <FormItem className="grid gap-2">
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input className="w-100" {...field} type="text" required />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="grid gap-2">
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input className="w-100" {...field} type="email" required />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="grid gap-2">
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input className="w-100" {...field} type="password" required />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirm"
          render={({ field }) => (
            <FormItem className="grid gap-2">
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input className="w-100" {...field} type="password" required />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid gap-6">
          <Button type="submit" className="w-full  w-100">
            Submit
          </Button>
          <div className="text-center text-sm">
            Already have an account?{" "}
            <a href="/login" className="underline underline-offset-4">
              Login
            </a>
          </div>
        </div>
      </form>
    </Form>
  );
}
