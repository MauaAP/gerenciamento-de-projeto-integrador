import { z } from "zod";

export const CreateClassroomRequest = z.object({
    name: z.string({ message: "O nome da sala de aula é obrigatório" }).min(1, { message: "O nome da sala de aula não pode ser vazio" })
})

export const ClassroomSchema = z.object({
    classroomId: z.string(),
    name: z.string()
})

export const CreateClassroomResponse = z.object({
    message: z.string(),
    classroom: ClassroomSchema
});