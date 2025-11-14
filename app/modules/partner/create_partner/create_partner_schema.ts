import { SECTOR } from "../../../shared/domain/enums/sector";
import { z } from "zod";

export const CreatePartnerRequest = z.object({
    name: z.string({ message: "Name é obrigatório" }),
    sector: z.enum([
        "EDUCACIONAL",
        "GOVERNAMENTAL",
        "INDUSTRIAL",
        "SAÚDE",
        "ONG",
        "AMBIENTAL",
        "FINANCEIRO"
    ], { 
        errorMap: () => ({ message: "Sector é obrigatório. Valores aceitos: EDUCACIONAL, GOVERNAMENTAL, INDUSTRIAL, SAÚDE, ONG, AMBIENTAL, FINANCEIRO" }) 
    }).transform((val) => {
        // Transformar o valor string para o enum correto
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
    })
})

export type CreatePartnerRequest = z.infer<typeof CreatePartnerRequest>;

const PartnerSchema = z.object({
    id: z.string(),
    name: z.string(),
    sector: z.string()
});

export const CreatePartnerResponse = z.object({
    message: z.string(),
    partner: PartnerSchema
})

export type CreatePartnerResponse = z.infer<typeof CreatePartnerResponse>;