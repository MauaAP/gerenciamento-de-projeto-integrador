import { SECTOR } from "app/shared/domain/enums/sector";
import { z } from "zod";

export const RegisterPartnerRequest = z.object({
    name: z.string().min(1, "Nome é obrigatório"),
    sector: z.nativeEnum(SECTOR, { errorMap: () => ({ message: "Setor é obrigatório"})})
})

export type RegisterPartnerRequest= z.infer<typeof RegisterPartnerRequest>;

const PartnerSchema= z.object({
    id: z.string(),
    name: z.string(),
    sector: z.string()
});

export const RegisterPartnerResponse= z.object({
    message: z.string(),
    partner: PartnerSchema
})

export type RegisterPartnerResponse= z.infer<typeof RegisterPartnerResponse>;