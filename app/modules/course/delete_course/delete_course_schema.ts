import { z } from "zod";

export const DeleteCourseRequest = z.object({
    id: z.string({message: "o id deve ser dado em string"}).length(36, "O id deve conter 36 caracteres")
});

export const DeleteCourseResponse = z.object({
    message: z.string()
});