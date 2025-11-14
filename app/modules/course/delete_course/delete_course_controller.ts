import { ForbiddenException } from "../../../shared/helpers/exceptions";
import { UserFromToken } from "../../../shared/middleware/jwt_middleware";
import { parseBody } from "../../../shared/utils/parse_body";
import { Request, Response } from "express";
import { DeleteCourseRequest, DeleteCourseResponse } from "./delete_course_schema";
import { DeleteCourseUseCase } from "./delete_course_usecase";

export class DeleteCourseController {
    constructor(private readonly usecase: DeleteCourseUseCase) {}

    async handler(req: Request, res: Response) {
        const userFromToken = req.user as UserFromToken;

        const allowedRoles = ["ADMIN", "MODERATOR"]
                
        if (!allowedRoles.includes(userFromToken.role)){
            throw new ForbiddenException(
                "Você não tem permissão para acessar este recurso"
            );
        }

        const {id} = parseBody(
            DeleteCourseRequest,
            req.body
        );

        await this.usecase.execute(id);

        const response = DeleteCourseResponse.parse({
            message: "Curso deletado com sucesso"
        });
        
        res.status(200).json(response)
    }
}

