import { ForbiddenException } from "../../../shared/helpers/exceptions";
import { UserFromToken } from "../../../shared/middleware/jwt_middleware";
import { parseBody } from "../../../shared/utils/parse_body";
import { Request, Response } from "express";
import { CreateCourseRequest, CreateCourseResponse } from "./create_course_schema";
import { CreateCourseUseCase } from "./create_course_usecase";

export class CreateCourseController {
    constructor(private readonly usecase: CreateCourseUseCase) {}

    async handler(req: Request, res: Response) {
        const userFromToken = req.user as UserFromToken;

        const allowedRoles = ["ADMIN", "MODERATOR"]
                
        if (!allowedRoles.includes(userFromToken.role)){
            throw new ForbiddenException(
                "Você não tem permissão para acessar este recurso"
            );
        }

        const {name, code} = parseBody(
            CreateCourseRequest,
            req.body
        );

        const course = await this.usecase.execute({
            name,
            code
        });

        const response = CreateCourseResponse.parse({
            message: "Curso criado com sucesso",
            course: {
                id: course.courseId,
                name: course.name,
                ...(course.code && { code: course.code })
            }
        });
        
        res.status(201).json(response)
    }
}

