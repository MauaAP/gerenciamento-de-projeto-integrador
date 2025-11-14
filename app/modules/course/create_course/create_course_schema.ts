import { COURSE } from "../../../shared/domain/enums/course";
import { z } from "zod";

export const CreateCourseRequest = z.object({
    name: z.string({ message: "O nome do curso é obrigatório" }).min(1, { message: "O nome do curso não pode estar vazio" }),
    code: z.string().optional()
})

export type CreateCourseRequest = z.infer<typeof CreateCourseRequest>;

const CourseSchema = z.object({
    id: z.string(),
    name: z.string(),
    code: z.string().optional()
});

export const CreateCourseResponse = z.object({
    message: z.string(),
    course: CourseSchema
})

export type CreateCourseResponse = z.infer<typeof CreateCourseResponse>;

