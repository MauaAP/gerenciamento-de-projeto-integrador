import { UserFromToken } from "../../../shared/middleware/jwt_middleware";
import { Request, Response } from "express";
import { ForbiddenException } from "../../../shared/helpers/exceptions";
import { parseXlsx } from "../../../shared/utils/parse_xlsx";
import { uploadUserXlsxRowSchema } from "./upload_user_xlsx_schema";
import { UploadUserXlsxUseCase } from "./upload_user_xlsx_usecase";

export class UploadUserXlsxController {
    constructor(private usecase: UploadUserXlsxUseCase) { }

    async handler(req: Request, res: Response) {
        const userFromToken = req.user as UserFromToken;

        const allowedRoles = ["ADMIN", "MODERATOR"];

        if (!allowedRoles.includes(userFromToken.role)) {
            throw new ForbiddenException(
                "Você não tem permissão para acessar este recurso"
            );
        }

        if (!req.file) {
            return res.status(400).json({ message: "Nenhum arquivo enviado" });
        }

        // Valida se as colunas obrigatórias (RA e Nome) existem no Excel
        const userData = parseXlsx(
            req.file.buffer,
            uploadUserXlsxRowSchema
        );

        const response = await this.usecase.execute(userData);

        return res.status(200).json({
            message: "Todos os usuários foram criados com sucesso",
        });
    }
}