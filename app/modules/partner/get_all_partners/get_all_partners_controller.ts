import { ForbiddenException } from "../../../shared/helpers/exceptions";
import { UserFromToken } from "../../../shared/middleware/jwt_middleware";
import { Request, Response } from "express";
import { GetAllPartnersResponse } from "./get_all_partners_schema";
import { GetAllPartnersUseCase } from "./get_all_partners_usecase";

export class GetAllPartnersController{
    constructor(private readonly usecase: GetAllPartnersUseCase) {}

    async handler(req: Request, res: Response){
        const userFromToken= req.user as UserFromToken

        const allowedRoles = ["ADMIN", "MODERATOR"];

        if (!allowedRoles.includes(userFromToken.role)){
            throw new ForbiddenException(
                "Você não tem permissão para acessar este recurso"
            );
        }

        const partnerList= await this.usecase.execute();

        const response= GetAllPartnersResponse.parse({
            message: "Lista de Parceiros retornado com sucesso",
            partnerList
        });
        res.status(200).json(response);
    }
}