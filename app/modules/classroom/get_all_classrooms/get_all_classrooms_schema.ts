import { z } from "zod";

const ClassroomSchema = z.object({
    id: z.string(),
    name: z.string(),
    capacity: z.number(),
    location: z.string().optional()
});

export const GetAllClassroomsResponse = z.object({
    message: z.string(),
    classrooms: z.array(ClassroomSchema)
})

export type GetAllClassroomsResponse = z.infer<typeof GetAllClassroomsResponse>;

