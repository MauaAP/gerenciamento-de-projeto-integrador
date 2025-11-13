import { z } from "zod";

export const DeleteCourseRequest = z.object({
    id: z.string({ message: "O id deve ser dado em string" }).length(36, "O id deve conter 36 caracteres")
})

export type DeleteCourseRequest = z.infer<typeof DeleteCourseRequest>;

export const DeleteCourseResponse = z.object({
    message: z.string(),
    course: z.object({
        id: z.string(),
        name: z.string(),
        code: z.string().optional()
    })
})

export type DeleteCourseResponse = z.infer<typeof DeleteCourseResponse>;

