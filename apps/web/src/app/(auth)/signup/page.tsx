"use client";

import { Loader } from "lucide-react";
import * as React from "react";
import Link from "next/link";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { authClient } from "@/lib/auth-client";
import { emailSignupSchema } from "@/lib/schemas/auth-schema";
import { GoogleIcon } from "@/components/logos/google";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function SignupPage() {
  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof emailSignupSchema>>({
    resolver: zodResolver(emailSignupSchema),
    defaultValues: {
      email: "",
      password: "",
      confirm: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof emailSignupSchema>) => {
    setIsLoading(true);

    const { email, password } = data;
    const name = email.split("@")[0];

    if (!name) {
      toast.error("이메일을 올바르게 입력해주세요");
      setIsLoading(false);
      return;
    }

    await authClient.signUp.email({
      email: email,
      password: password,
      name: name,
      fetchOptions: {
        onError: () => {
          setIsLoading(false);
          toast.error("회원가입에 실패했어요. 다시 시도해주세요");
        },
        onSuccess: () => {
          setIsLoading(false);
          router.push("/u");
          toast.success("회원가입 완료");
        },
      },
    });
  };

  const googleLogin = async () => {
    setIsLoading(true);

    await authClient.signIn.social({
      provider: "google",
      fetchOptions: {
        onError: () => {
          setIsLoading(false);
          toast.error("회원가입에 실패했어요. 다시 시도해주세요");
        },
        onSuccess: () => {
          setIsLoading(false);
          router.push("/u");
          toast.success("회원가입 완료");
        },
      },
    });
  };

  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <Card className="mx-auto w-full max-w-md rounded-none bg-white p-4 shadow-input dark:bg-black md:rounded-2xl md:p-8">
        <CardHeader>
          <CardTitle className="text-2xl">회원가입</CardTitle>
        </CardHeader>

        <CardContent className="py-2">
          <form
            className="flex flex-col gap-6"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="flex flex-col gap-1">
              <Label htmlFor="email">이메일</Label>
              <Input
                required
                id="email"
                type="email"
                {...form.register("email")}
              />
              {form.formState.errors.email && (
                <p className="text-sm text-red-500">
                  이메일을 올바르게 입력해주세요
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <Label htmlFor="password">비밀번호</Label>
              <Input
                required
                id="password"
                type="password"
                {...form.register("password")}
              />
              {form.formState.errors.password && (
                <p className="text-sm text-red-500">
                  비밀번호가 일치하지 않습니다.
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <Label htmlFor="confirm">비밀번호 확인</Label>
              <Input
                required
                id="confirm"
                type="password"
                {...form.register("confirm")}
              />
              {form.formState.errors.confirm && (
                <p className="text-sm text-red-500">
                  비밀번호가 일치하지 않습니다.
                </p>
              )}
            </div>

            <div className="flex flex-col items-center gap-1.5 sm:flex-row">
              <Button
                className="w-full"
                type="submit"
                variant={"outline"}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader className="size-4 animate-spin" />
                ) : (
                  "회원가입"
                )}
              </Button>

              <Button
                className="flex w-full items-center gap-1.5"
                type="button"
                variant={"outline"}
                onClick={googleLogin}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader className="size-4 animate-spin" />
                ) : (
                  <>
                    <GoogleIcon className="size-4" />
                    <span>구글 로그인</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center pt-2">
          <Link
            href="/signin"
            className="text-muted-foreground/60 transition-colors hover:text-muted-foreground"
          >
            로그인
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
