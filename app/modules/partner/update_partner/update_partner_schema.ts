import { SECTOR } from "../../../shared/domain/enums/sector";
import { z } from "zod";

export const UpdatePartnerRequest = z.object({
    id: z.string({ message: "Id do parceiro é obrigatório" }).length(36, "O id deve conter 36 caracteres"),
    name: z.string({ message: "Name deve ter pelo menos um caracter" }).optional(),
    sector: z.enum([
        "EDUCACIONAL",
        "GOVERNAMENTAL",
        "INDUSTRIAL",
        "SAÚDE",
        "ONG",
        "AMBIENTAL",
        "FINANCEIRO"
    ], { 
        errorMap: () => ({ message: "Sector selecionado não está entre os disponíveis" }) 
    }).transform((val) => {
        const sectorMap: Record<string, SECTOR> = {
            "EDUCACIONAL": SECTOR.EDUCATIONAL,
            "GOVERNAMENTAL": SECTOR.GOVERNAMENTAL,
            "INDUSTRIAL": SECTOR.INDUSTRIAL,
            "SAÚDE": SECTOR.HEALTHCARE,
            "ONG": SECTOR.ONG,
            "AMBIENTAL": SECTOR.ENVIRONMENTAL,
            "FINANCEIRO": SECTOR.FINANCIAL
        };
        return sectorMap[val];
    }).optional()
}).refine(
    (data) => (data.name !== undefined || data.sector !== undefined),
    {
        message: "Você deve passar algum atributo para ser alterado"
    }
)

export type UpdatePartnerRequest = z.infer<typeof UpdatePartnerRequest>

const PartnerSchema = z.object({
    id: z.string(),
    name: z.string(),
    sector: z.string()
})

export const UpdatedPartnerResponse = z.object({
    message: z.string(),
    partner: PartnerSchema
})