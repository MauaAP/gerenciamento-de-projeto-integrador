import { ForbiddenException } from "../../../shared/helpers/exceptions";
import { UserFromToken } from "../../../shared/middleware/jwt_middleware";
import { parseXlsx } from "../../../shared/utils/parse_xlsx";
import { Request, Response } from "express";
import { uploadPresentationXlsxRowSchema } from "./upload_presentation_xlsx_schema";
import { UploadPresentationXlsxUseCase } from "./upload_presentation_xlsx_usecase";


export class UploadPresentationXlsxController {
    constructor(private readonly usecase: UploadPresentationXlsxUseCase) {}

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

        const presentationData = parseXlsx(
            req.file.buffer,
            uploadPresentationXlsxRowSchema,
            {
                validateAllSheets: true
            }
        );

        const response = await this.usecase.execute(presentationData);

        return res.status(200).json({
            message: "Todas as apresentações foram criadas com sucesso",
        });
    }
}