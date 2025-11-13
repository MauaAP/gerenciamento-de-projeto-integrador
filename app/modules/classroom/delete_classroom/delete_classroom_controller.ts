import { ForbiddenException } from "../../../shared/helpers/exceptions";
import { UserFromToken } from "../../../shared/middleware/jwt_middleware";
import { parseBody } from "../../../shared/utils/parse_body";
import { Request, Response } from "express";
import { DeleteClassroomRequest, DeleteClassroomResponse } from "./delete_classroom_schema";
import { DeleteClassroomUseCase } from "./delete_classroom_usecase";

export class DeleteClassroomController {
    constructor(private readonly usecase: DeleteClassroomUseCase) {}

    async handler(req: Request, res: Response) {
        const userFromToken = req.user as UserFromToken;

        const allowedRoles = ["ADMIN", "MODERATOR"]
                
        if (!allowedRoles.includes(userFromToken.role)){
            throw new ForbiddenException(
                "Você não tem permissão para acessar este recurso"
            );
        }

        const {id} = parseBody(
            DeleteClassroomRequest,
            req.body
        );

        const classroom = await this.usecase.execute(id);

        const response = DeleteClassroomResponse.parse({
            message: "Sala deletada com sucesso",
            classroom: {
                id: classroom.classroomId,
                name: classroom.name,
                capacity: classroom.capacity,
                ...(classroom.location && { location: classroom.location })
            }
        });
        
        res.status(200).json(response)
    }
}

