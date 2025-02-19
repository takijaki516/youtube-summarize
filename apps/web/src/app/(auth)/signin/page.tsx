"use client";

import * as React from "react";
import { Loader } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import { emailSigninSchema } from "@/lib/schemas/auth-schema";
import { authClient } from "@/lib/auth-client";
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

export default function LoginPage() {
  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof emailSigninSchema>>({
    resolver: zodResolver(emailSigninSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof emailSigninSchema>) => {
    setIsLoading(true);

    await authClient.signIn.email({
      email: data.email,
      password: data.password,
      fetchOptions: {
        onError: () => {
          toast.error("로그인에 실패했어요. 다시 시도해주세요");
        },
        onSuccess: () => {
          toast.success("로그인 했어요");
          router.push("/u");
        },
      },
    });

    setIsLoading(false);
  };

  const googleLogin = async () => {
    setIsLoading(true);

    await authClient.signIn.social({
      provider: "google",
      fetchOptions: {
        onSuccess: () => {
          router.push("/u");
          toast.success("회원가입 완료");
        },
      },
    });

    setIsLoading(false);
  };

  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <Card className="mx-auto w-full max-w-md rounded-none bg-white p-4 shadow-input dark:bg-black md:rounded-2xl md:p-8">
        <CardHeader className="text-2xl">
          <CardTitle>로그인</CardTitle>
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
                <p className="text-sm text-red-500">올바르지 않은 정보</p>
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
                <p className="text-sm text-red-500">올바르지 않은 정보</p>
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
                  <Loader className="size-4 w-full animate-spin" />
                ) : (
                  "로그인"
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
            href="/signup"
            className="text-muted-foreground/60 transition-colors hover:text-muted-foreground"
          >
            회원가입
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
