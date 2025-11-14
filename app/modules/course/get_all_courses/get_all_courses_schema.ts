import { z } from "zod";

const CourseSchema = z.object({
    id: z.string(),
    name: z.string(),
    code: z.string().optional()
});

export const GetAllCoursesResponse = z.object({
    message: z.string(),
    courses: z.array(CourseSchema)
})

export type GetAllCoursesResponse = z.infer<typeof GetAllCoursesResponse>;

