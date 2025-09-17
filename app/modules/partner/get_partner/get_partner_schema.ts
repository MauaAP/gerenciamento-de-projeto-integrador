import { z } from "zod";

export const GetPartnerRequest= z.object({
    id: z.string().length(36, "O id deve conter 36 caractéres").optional(),
    name: z.string().min(1, "O nome deve ter pelo menos um caracter").optional()
}).refine(
    (data) => (data.id !== undefined && data.name === undefined) || (data.id === undefined && data.name !== undefined),
    {
         message: "Você deve informar o id ou o nome (exatamente um)"
    }
)

export type GetPartnerRequest= z.infer<typeof GetPartnerRequest>

const PartnerSchema= z.object({
    id: z.string(),
    name: z.string(),
    sector: z.string()
});

export const GetPartnerResponse= z.object({
    message: z.string(),
    partner: PartnerSchema
});

export type GetPartnerResponse= z.infer<typeof GetPartnerResponse>;