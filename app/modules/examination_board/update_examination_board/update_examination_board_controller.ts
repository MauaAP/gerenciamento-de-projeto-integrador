import { ForbiddenException } from "app/shared/helpers/exceptions";
import { UserFromToken } from "app/shared/middleware/jwt_middleware";
import { parseBody } from "app/shared/utils/parse_body";
import { Request, Response } from "express";
import { UpdateExaminationBoardRequest, UpdateExaminationBoardResponse } from "./update_examination_board_schema";
import { UpdateExaminationBoardUseCase } from "./update_examination_board_usecase";

export class UpdateExaminationBoardController {
    constructor(private readonly usecase: UpdateExaminationBoardUseCase) {}

    async handler(req: Request, res: Response) {
        const userFromToken= req.user as UserFromToken;
        
        const allowedRoles= ["ADMIN", "MODERATOR"];

        if(!allowedRoles.includes(userFromToken.role)) {
            throw new ForbiddenException(
                "Você não tem permissão para acessar este recurso"
            );
        }

        const {id, newProfessorIdList} = parseBody(
            UpdateExaminationBoardRequest,
            req.body
        );

        const {updatedExaminationBoard, professorNameList} = await this.usecase.execute({
            id,
            newProfessorIdList
        })

        const response= UpdateExaminationBoardResponse.parse({
            message: "Baca avaliadora alterada com sucesso",
            examinationBoard: {
                id: updatedExaminationBoard.examinationBoardId,
                professorNameList: professorNameList
            }
        });
        res.status(200).json(response)
    }
}