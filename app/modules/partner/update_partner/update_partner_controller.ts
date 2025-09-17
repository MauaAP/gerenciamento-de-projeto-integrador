import { ForbiddenException } from "app/shared/helpers/exceptions";
import { UserFromToken } from "app/shared/middleware/jwt_middleware";
import { parseBody } from "app/shared/utils/parse_body";
import { Request, Response } from "express";
import { UpdatedPartnerResponse, UpdatePartnerRequest } from "./update_partner_schema";
import { UpdatePartnerUseCase } from "./update_partner_usecase";
export class UpdatePartnerController {
    constructor(private readonly usecase: UpdatePartnerUseCase) {}

    async handler(req: Request, res: Response) {
        const userFromToken= req.user as UserFromToken

        const allowedRoles= ["ADMIN", "MODERATOR"];

        if(!allowedRoles.includes(userFromToken.role)) {
            throw new ForbiddenException(
                "Você não tem permissão para acessar este recurso"
            );
        }

        const {id, name, sector} = parseBody(
            UpdatePartnerRequest,
            req.body
        );

        const updatePartner= await this.usecase.execute({
            id,
            updateOptions: {
                name,
                sector
            }
        });

        const response= UpdatedPartnerResponse.parse({
            message: "Partner foi alterando com sucesso",
            partner: {
                id: updatePartner.partnerId,
                name: updatePartner.name,
                sector: updatePartner.sector
            }
        })
        res.status(200).json(response)
    }
}