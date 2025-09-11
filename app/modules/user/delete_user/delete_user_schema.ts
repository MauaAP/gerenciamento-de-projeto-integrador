import { z } from "zod";

export const RegisterDeleteUserRequest= z.object({
    id: z.string().length(36, "O id deve conter 36 caractéres"),
});

export type RegisterUserDeleteRequest = z.infer<typeof RegisterDeleteUserRequest>

const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string()
});

export const RegisterDeleteUserResponse = z.object({
    message: z.string(),
    deleted_user: UserSchema,
    token: z.string()
});

export type RegisterDeleteUserResponse = z.infer<typeof RegisterDeleteUserResponse>