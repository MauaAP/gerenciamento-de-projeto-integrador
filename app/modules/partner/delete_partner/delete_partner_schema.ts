import { z } from "zod";

export const DeletePartnerRequest= z.object({
    id: z.string().length(36, "O id deve conter 36 caracteres")
});

export type DeletePartnerRequest = z.infer<typeof DeletePartnerRequest>

export const DeletePartnerResponse= z.object({
    message: z.string()
});

export type DeletePartnerResponse = z.infer<typeof DeletePartnerResponse>