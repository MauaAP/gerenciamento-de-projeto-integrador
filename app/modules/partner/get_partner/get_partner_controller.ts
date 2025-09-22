import { ForbiddenException } from "../../../shared/helpers/exceptions";
import { UserFromToken } from "../../../shared/middleware/jwt_middleware";
import { parseBody } from "../../../shared/utils/parse_body";
import { Request, Response } from "express";
import { GetPartnerRequest, GetPartnerResponse } from "./get_partner_schema";
import { GetPartnerUseCase } from "./get_partner_usecase";

export class GetPartnerController {
    constructor(private readonly usecase: GetPartnerUseCase) {}

    async handler(req: Request, res: Response) {
        const userFromToken= req.user as UserFromToken

        const allowedRoles= ["ADMIN", "MODERATOR"];

        if (!allowedRoles.includes(userFromToken.role)){
            throw new ForbiddenException(
                "Você não tem permissão para acessar este recurso"
            );
        }

        const {id, name} = parseBody (
            GetPartnerRequest,
            req.query
        );

        const selectedPartner= await this.usecase.execute({
            id,
            name
        });

        const response= GetPartnerResponse.parse({
            message: "Parceiro retornado com sucesso",
            user: {
                id: selectedPartner.partnerId,
                name: selectedPartner.name,
                sector: selectedPartner.sector
            }
        });
        res.status(200).json(response)
    }
}