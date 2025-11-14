import { ForbiddenException } from "../../../shared/helpers/exceptions";
import { UserFromToken } from "../../../shared/middleware/jwt_middleware";
import { parseBody } from "../../../shared/utils/parse_body";
import { Request, Response } from "express";
import { CreatePartnerRequest, CreatePartnerResponse } from "./create_partner_schema";
import { CreatePartnerUseCase } from "./create_partner_usecase";

export class CreatePartnerController {
    constructor(private readonly usecase: CreatePartnerUseCase) {}

    async handler(req: Request, res: Response) {
        console.log("[CreatePartnerController] ========== INICIANDO ==========");
        console.log("[CreatePartnerController] Body recebido:", JSON.stringify(req.body, null, 2));
        console.log("[CreatePartnerController] User do token:", JSON.stringify(req.user, null, 2));
        
        try {
            const userFromToken= req.user as UserFromToken;

            const allowedRoles= ["ADMIN", "MODERATOR"]

            console.log("[CreatePartnerController] Verificando permissões...");
            if(!allowedRoles.includes(userFromToken.role)) {
                console.log("[CreatePartnerController] ❌ Usuário sem permissão. Role:", userFromToken.role);
                throw new ForbiddenException(
                        "Você não tem permissão para acessar este recurso"
                );
            }
            console.log("[CreatePartnerController] ✅ Permissões OK");

            console.log("[CreatePartnerController] Parseando body com Zod...");
            const {name, sector} = parseBody(
                CreatePartnerRequest,
                req.body
            );
            console.log("[CreatePartnerController] ✅ Body parseado - name:", name, "| sector:", sector, "| tipo sector:", typeof sector);

            console.log("[CreatePartnerController] Chamando usecase.execute...");
            const partner = await this.usecase.execute({
                name, 
                sector
            });
            console.log("[CreatePartnerController] ✅ Partner criado:", JSON.stringify(partner.toJson(), null, 2));

            console.log("[CreatePartnerController] Criando response schema...");
            const response= CreatePartnerResponse.parse({
                message: "Parceiro criado com sucesso",
                partner: {
                    id: partner.partnerId,
                    name: partner.name,
                    sector: partner.sector
                }
            });
            console.log("[CreatePartnerController] ✅ Response criado com sucesso");
            
            res.status(201).json(response)
        } catch (error: any) {
            console.error("[CreatePartnerController] ❌❌❌ ERRO CAPTURADO ❌❌❌");
            console.error("[CreatePartnerController] Error name:", error.name);
            console.error("[CreatePartnerController] Error message:", error.message);
            console.error("[CreatePartnerController] Error stack:", error.stack);
            console.error("[CreatePartnerController] Error completo:", JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
            throw error;
        }
    }
}