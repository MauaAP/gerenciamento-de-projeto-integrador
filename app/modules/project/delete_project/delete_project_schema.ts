import { z } from "zod";

export const DeleteProjectRequest= z.object({
    id: z.string().length(36, "O id deve conter 36 caracteres")
});

export const DeleteProjectResponse = z.object({
    message: z.string()
});