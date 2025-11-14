import { ForbiddenException } from "../../../shared/helpers/exceptions";
import { UserFromToken } from "../../../shared/middleware/jwt_middleware";
import { Request, Response } from "express";
import { GetAllExaminationBoardsResponse } from "./get_all_examination_boards_schema";
import { GetAllExaminationBoardsUseCase } from "./get_all_examination_boards_usecase";

export class GetAllExaminationBoardsController {
    constructor(private readonly usecase: GetAllExaminationBoardsUseCase) {}

    async handler(req: Request, res: Response){
        const userFromToken= req.user as UserFromToken;
                        
        const allowedRoles= ["ADMIN", "MODERATOR"]
                
        if (!allowedRoles.includes(userFromToken.role)){
            throw new ForbiddenException(
                "Você não tem permissão para acessar este recurso"
            );
        }

        const examinationBoardsList= await this.usecase.execute();

        const response= GetAllExaminationBoardsResponse.parse({
            message: "Lista de Bancas Avaliadoras retornado com sucesso",
            examinationBoards: examinationBoardsList.map((examinationBoard) => ({
                id: examinationBoard.id,
                professorNameList: examinationBoard.professorNameList
            }))
        });
        res.status(200).json(response)
    }
}