import { CourseSchema } from "../create_course/create_course_schema";
import { z } from "zod";

export const CourseSchemaArray= z.array(CourseSchema)

export const GetAllCoursesResponse= z.object({
    message: z.string(),
    courses: CourseSchemaArray
})