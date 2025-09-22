import { ForbiddenException } from "../../../shared/helpers/exceptions";
import { UserFromToken } from "../../../shared/middleware/jwt_middleware";
import { parseBody } from "../../../shared/utils/parse_body";
import { Request, Response } from "express";
import { DeletePartnerRequest, DeletePartnerResponse } from "./delete_partner_schema";
import { DeletePartnerUseCase } from "./delete_partner_usecase";

export class DeletePartnerController {
    constructor (private readonly usecase: DeletePartnerUseCase) {}

    async handler(req: Request, res: Response) {
        const userFromToken= req.user as UserFromToken;

        const allowedRoles= ["ADIMIN", "MODERATOR"];

        if (!allowedRoles.includes(userFromToken.role)) {
            throw new ForbiddenException(
                "Você não tem permissão para acessar este recurso"
            );
        }

        const {id} = parseBody (
            DeletePartnerRequest,
            req.body
        );

        const deletedPartner= await this.usecase.execute({
            id
        });

        const response = DeletePartnerResponse.parse({
            message: "Parceiro deletado com sucesso"
        })
        res.status(200).json(response)
    }
}