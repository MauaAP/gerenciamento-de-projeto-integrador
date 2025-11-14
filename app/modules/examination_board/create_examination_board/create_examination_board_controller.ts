import { ForbiddenException } from "../../../shared/helpers/exceptions";
import { UserFromToken } from "../../../shared/middleware/jwt_middleware";
import { parseBody } from "../../../shared/utils/parse_body";
import { Request, Response } from "express"
import { CreateExaminationBoardRequest, CreateExaminationBoardResponse } from "./create_examination_board_schema";
import { CreateExaminationBoardUseCase } from "./create_examination_board_usecase";

export class CreateExaminationBoardController {
    constructor(private readonly usecase: CreateExaminationBoardUseCase) {}

    async handler(req: Request, res: Response) {
        const userFromToken= req.user as UserFromToken;
        
        const allowedRoles= ["ADMIN", "MODERATOR"]
        
        if (!allowedRoles.includes(userFromToken.role)){
            throw new ForbiddenException(
                "Você não tem permissão para acessar este recurso"
            );
        }

        const {professorIdList} = parseBody(
            CreateExaminationBoardRequest,
            req.body
        );

        const {newExaminationBoard, professorNameList}= await this.usecase.execute({
            professorIdList
        });

        const response= CreateExaminationBoardResponse.parse({
            message: "Banca avalidora criada com sucesso",
            examinationBoard: {
                id: newExaminationBoard.examinationBoardId,
                professorNameList: professorNameList
            }
        });
        res.status(201).json(response)
    }
}