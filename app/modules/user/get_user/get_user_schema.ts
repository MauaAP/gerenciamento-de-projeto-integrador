import { z } from "zod";

export const GetUserRequest = z.object({
    id: z.string().length(36, "O id deve conter 36 caractéres").optional(),
    email: z.string().email("Endereço de e-mail inválido").optional()
}).refine(
    (data) => (data.id !== undefined && data.email === undefined) || (data.id === undefined && data.email !== undefined),
    {
        message: "Você deve informar o id ou o email (exatamente um)"
    }
);

export type GetUserRequest= z.infer<typeof GetUserRequest>

const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: z.string(),
  email: z.string(),
});

export const GetUserResponse = z.object({
  message: z.string(),
  user: UserSchema
});

export type GetUserResponse = z.infer<typeof GetUserResponse>;