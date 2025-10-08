import { SECTOR } from "../../../shared/domain/enums/sector";
import { z } from "zod";

export const CreatePartnerRequest = z.object({
    name: z.string({ message: "Nome é obrigatório" }),
    sector: z.nativeEnum(SECTOR, { errorMap: () => ({ message: "Setor é obrigatório" }) })
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