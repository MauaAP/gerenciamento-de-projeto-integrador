import { Request, Response } from "express";
import { GetAllCoursesResponse } from "./get_all_courses_schema";
import { GetAllCoursesUseCase } from "./get_all_courses_usecase";

export class GetAllCoursesController {
    constructor(private readonly usecase: GetAllCoursesUseCase) {}

    async handler(req: Request, res: Response) {
        const courses = await this.usecase.execute();

        const response = GetAllCoursesResponse.parse({
            message: "Cursos retornados com sucesso",
            courses: courses.map((course) => ({
                id: course.courseId,
                name: course.name,
                ...(course.code && { code: course.code })
            }))
        });
        
        res.status(200).json(response)
    }
}

