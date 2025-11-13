import { z } from "zod";

export const DeleteClassroomRequest = z.object({
    id: z.string({ message: "O id deve ser dado em string" }).length(36, "O id deve conter 36 caracteres")
})

export type DeleteClassroomRequest = z.infer<typeof DeleteClassroomRequest>;

export const DeleteClassroomResponse = z.object({
    message: z.string(),
    classroom: z.object({
        id: z.string(),
        name: z.string(),
        capacity: z.number(),
        location: z.string().optional()
    })
})

export type DeleteClassroomResponse = z.infer<typeof DeleteClassroomResponse>;

