import { z } from "zod";

export const DeleteClassroomRequest = z.object({
    id: z.string({message: "o id deve ser dado em string"}).length(36, "O id deve conter 36 caracteres")
});

export const DeleteClassroomResponse = z.object({
    message: z.string()
})