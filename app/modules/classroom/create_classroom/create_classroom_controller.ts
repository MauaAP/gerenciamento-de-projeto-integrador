import { ForbiddenException } from "../../../shared/helpers/exceptions";
import { UserFromToken } from "../../../shared/middleware/jwt_middleware";
import { parseBody } from "../../../shared/utils/parse_body";
import { Request, Response } from "express";
import { CreateClassroomRequest, CreateClassroomResponse } from "./create_classroom_schema";
import { CreateClassroomUseCase } from "./create_classroom_usecase";

export class CreateClassroomController {
    constructor(private readonly usecase: CreateClassroomUseCase) {}

    async handler(req: Request, res: Response) {
        const userFromToken = req.user as UserFromToken;

        const allowedRoles = ["ADMIN", "MODERATOR"]
                
        if (!allowedRoles.includes(userFromToken.role)){
            throw new ForbiddenException(
                "Você não tem permissão para acessar este recurso"
            );
        }

        const {name, capacity, location} = parseBody(
            CreateClassroomRequest,
            req.body
        );

        const classroom = await this.usecase.execute({
            name,
            capacity,
            location
        });

        const response = CreateClassroomResponse.parse({
            message: "Sala criada com sucesso",
            classroom: {
                id: classroom.classroomId,
                name: classroom.name,
                capacity: classroom.capacity,
                ...(classroom.location && { location: classroom.location })
            }
        });
        
        res.status(201).json(response)
    }
}

