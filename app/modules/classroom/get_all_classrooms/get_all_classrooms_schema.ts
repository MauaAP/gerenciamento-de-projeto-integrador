import { z } from "zod";
import { ClassroomSchema } from "../create_classroom/create_classroom_schema";

export const ClassroomSchemaArray = z.array(ClassroomSchema)

export const GetAllClassroomsResponse= z.object({
    message: z.string(),
    classrooms: ClassroomSchemaArray
})