import { ForbiddenException } from "app/shared/helpers/exceptions";
import { UserFromToken } from "app/shared/middleware/jwt_middleware";
import { parseBody } from "app/shared/utils/parse_body";
import { Request, Response } from "express";
import { DeleteExaminationBoardRequest, DeleteExaminationBoardResponse } from "./delete_examination_board_schema";
import { DeleteExaminationBoardUseCase } from "./delete_examination_board_usecase";

export class DeleteExaminationBoardController {
    constructor(private readonly usecase: DeleteExaminationBoardUseCase) {}

    async handler(req: Request, res: Response){
        const userFromToken= req.user as UserFromToken;
                
        const allowedRoles= ["ADMIN", "MODERATOR"]
                
        if (!allowedRoles.includes(userFromToken.role)){
            throw new ForbiddenException(
                "Você não tem permissão para acessar este recurso"
            );
        }

        const {id} = parseBody(
            DeleteExaminationBoardRequest,
            req.body
        );

        const deletedExaminationBoard= await this.usecase.execute(
            id
        )

        const response= DeleteExaminationBoardResponse.parse({
            message: "Banca avaliadora delatada com sucesso"
        });
        res.status(200).json(response);
    }
}