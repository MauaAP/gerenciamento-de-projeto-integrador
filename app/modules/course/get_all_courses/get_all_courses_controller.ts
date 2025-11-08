import { ForbiddenException } from "../../../shared/helpers/exceptions";
import { Request, Response } from "express";
import { GetAllCoursesResponse } from "./get_all_courses_schema";
import { UserFromToken } from "../../../shared/middleware/jwt_middleware";
import { GetAllCoursesUseCase } from "./get_all_courses_usecase";

export class GetAllCoursesController {
    constructor(private readonly usecase: GetAllCoursesUseCase) {}

    async handler(req: Request, res: Response){
        const userFromToken= req.user as UserFromToken
        
        const allowedRoles = ["ADMIN", "MODERATOR"];
        
        if(!allowedRoles.includes(userFromToken.role)) {
            throw new ForbiddenException(
                "Você não tem permissão para acessar este recurso"
            );
        }

        const coursesList= await this.usecase.execute();

        const response= GetAllCoursesResponse.parse({
            message: "Lista de Cursos retornada com sucesso",
            courses: coursesList.map((course) => ({
                id: course.courseId,
                name: course.name,
            }))
        });
        res.status(200).json(response)
    }
}