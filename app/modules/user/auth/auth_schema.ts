import { z } from "zod";

export const AuthRequest = z.object({
  email: z.string().email("email inválido"),
  password: z.string().min(6, "A password deve ter pelo menos 6 caracteres"),
});
export type AuthRequest = z.infer<typeof AuthRequest>;

export const AuthResponse = z.object({
  message: z.string(),
  token: z.string(),
  user: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    role: z.string(),
  }),
});
export type AuthResponse = z.infer<typeof AuthResponse>;
