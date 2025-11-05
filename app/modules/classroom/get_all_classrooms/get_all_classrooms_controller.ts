import { ForbiddenException } from "../../../shared/helpers/exceptions";
import { Request, Response } from "express";
import { GetAllClassroomsResponse } from "./get_all_classrooms_schema";
import { UserFromToken } from "../../../shared/middleware/jwt_middleware";
import { GetAllClassroomsUseCase } from "./get_all_classrooms_usecase";

export class GetAllClassroomsController {
    constructor(private readonly usecase: GetAllClassroomsUseCase) {}

    async handler(req: Request, res: Response){
        const userFromToken= req.user as UserFromToken

        const allowedRoles = ["ADMIN", "MODERATOR"];
        
        if(!allowedRoles.includes(userFromToken.role)) {
            throw new ForbiddenException(
                "Você não tem permissão para acessar este recurso"
            );
        }

        const classroomsList= await this.usecase.execute();

        const response= GetAllClassroomsResponse.parse({
            message: "Lista de Salas de Aula retornada com sucesso",
            classrooms: classroomsList.map((classroom) => ({
                id: classroom.classroomId,
                name: classroom.name,
            }))
        });
        res.status(200).json(response)
    }
}