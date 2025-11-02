import { ForbiddenException } from "app/shared/helpers/exceptions";
import { UserFromToken } from "app/shared/middleware/jwt_middleware";
import { parseBody } from "app/shared/utils/parse_body";
import { Request, Response } from "express";
import { GetExaminationBoardRequest, GetExaminationBoardResponse } from "./get_examination_board_schema";
import { GetExaminationBoardUseCase } from "./get_examination_board_usecase";

export class GetExaminationBoardController {
    constructor(private readonly usecase: GetExaminationBoardUseCase) {}

    async handler(req: Request, res: Response){
        const userFromToken= req.user as UserFromToken;
        
        const allowedRoles= ["ADMIN", "MODERATOR"]
                
        if (!allowedRoles.includes(userFromToken.role)){
            throw new ForbiddenException(
                "Você não tem permissão para acessar este recurso"
            );
        }

        const {id, professorId} = parseBody(
            GetExaminationBoardRequest,
            req.query
        );

        const examinationBoardList= await this.usecase.execute({
            id,
            professorId
        })

        const response= GetExaminationBoardResponse.parse({
            message: "Banca(s) avaliadora(s) retornada(s) com sucesso",
            examinationBoard: examinationBoardList.map((examinationBoard) => ({
                id: examinationBoard.id,
                professorNameList: examinationBoard.professorNameList
            }))
        });
        res.status(200).json(response)
    }
}