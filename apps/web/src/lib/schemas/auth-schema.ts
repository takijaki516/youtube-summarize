import { z } from "zod";

export const emailSignupSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(8),
    confirm: z.string().min(8),
  })
  .refine((data) => data.password === data.confirm, {
    message: "패스워드가 일치하지 않습니다.",
    path: ["confirm"],
  });

export const emailSigninSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
