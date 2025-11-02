import { ForbiddenException } from "../../../shared/helpers/exceptions";
import { UserFromToken } from "../../../shared/middleware/jwt_middleware";
import { parseBody } from "../../../shared/utils/parse_body";
import { Request, Response } from "express";
import { CreatePartnerRequest, CreatePartnerResponse } from "./create_partner_schema";
import { CreatePartnerUseCase } from "./create_partner_usecase";

export class CreatePartnerController {
    constructor(private readonly usecase: CreatePartnerUseCase) {}

    async handler(req: Request, res: Response) {
        const userFromToken= req.user as UserFromToken;

        const allowedRoles= ["ADMIN", "MODERATOR"]

        if(!allowedRoles.includes(userFromToken.role)) {
            throw new ForbiddenException(
                    "Você não tem permissão para acessar este recurso"
            );
        }

        const {name, sector} = parseBody(
            CreatePartnerRequest,
            req.body
        );

        const partner = await this.usecase.execute({
            name, 
            sector
        });

        const response= CreatePartnerResponse.parse({
            message: "Parceiro criado com sucesso",
            partner: {
                id: partner.partnerId,
                name: partner.name,
                sector: partner.sector
            }
        });
        res.status(201).json(response)
    }
}