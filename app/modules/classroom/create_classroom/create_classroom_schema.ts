import { z } from "zod";

export const CreateClassroomRequest = z.object({
    name: z.string().min(1, "O nome da sala é obrigatório"),
    capacity: z.number().min(1, "A capacidade deve ser maior que 0"),
    location: z.string().optional()
})

export type CreateClassroomRequest = z.infer<typeof CreateClassroomRequest>;

const ClassroomSchema = z.object({
    id: z.string(),
    name: z.string(),
    capacity: z.number(),
    location: z.string().optional()
});

export const CreateClassroomResponse = z.object({
    message: z.string(),
    classroom: ClassroomSchema
})

export type CreateClassroomResponse = z.infer<typeof CreateClassroomResponse>;

