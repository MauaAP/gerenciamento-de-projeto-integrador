import { z } from "zod";

export const CreateCourseRequest = z.object({
    name: z.string({ message: "O nome do curso é obrigatório" }).min(1, { message: "O nome do curso não pode ser vazio" })
})

export const CourseSchema = z.object({
    courseId: z.string(),
    name: z.string()
})

export const CreateCourseResponse = z.object({
    message: z.string(),
    course: CourseSchema
});