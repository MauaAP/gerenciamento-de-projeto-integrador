import { z } from "zod";

export const DeleteUserRequest= z.object({
  id: z.string().length(36, "O id deve conter 36 caracteres")
});

export type DeleteUserRequest = z.infer<typeof DeleteUserRequest>


export const DeleteUserResponse = z.object({
    message: z.string()
});

export type DeleteUserResponse = z.infer<typeof DeleteUserResponse>