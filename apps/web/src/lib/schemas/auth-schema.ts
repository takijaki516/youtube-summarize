import { z } from "zod";

export const emailSignupSchema = z
  .object({
    email: z.string().email({ message: "유요한 이메일 주소를 입력해주세요" }),
    password: z
      .string()
      .min(8, { message: "비밀번호는 최소 8자 이상이어야 합니다." }),
    confirm: z
      .string()
      .min(8, { message: "비밀번호 확인은 최소 8자 이상이어야 합니다." }),
  })
  .refine((data) => data.password === data.confirm, {
    message: "패스워드가 일치하지 않습니다.",
    path: ["confirm"],
  });

export const emailSigninSchema = z.object({
  email: z.string().email({ message: "유효한 이메일 주소를 입력해주세요." }),
  password: z
    .string()
    .min(8, { message: "비밀번호는 최소 8자 이상이어야 합니다." }),
});
