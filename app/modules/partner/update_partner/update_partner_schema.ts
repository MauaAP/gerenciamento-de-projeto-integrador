import { SECTOR } from "../../../shared/domain/enums/sector";
import { z } from "zod";

export const UpdatePartnerRequest= z.object({
    id: z.string().length(36, "O id deve conter 36 caractéres"),
    name: z.string().min(1, "O nome deve ter pelo menos um caracter").optional(),
    sector: z.nativeEnum(SECTOR).optional()
}).refine(
    (data) => (data.name !== undefined || data.sector !== undefined),
    {
        message: "Você deve passar algum atributo para ser alterado"
    }
)

export type UpdatePartnerRequest= z.infer<typeof UpdatePartnerRequest>

const PartnerSchema= z.object({
    id: z.string(),
    name: z.string(),
    sector: z.string()
})

export const UpdatedPartnerResponse= z.object({
    message: z.string(),
    partner: PartnerSchema
})