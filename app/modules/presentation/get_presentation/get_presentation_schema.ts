import { z } from "zod";
import { PresentationSchema } from "../create_presentation/create_presentation_schema";
import { STATUS } from "../../../shared/domain/enums/status";

export const GetPresentationRequest = z.object({
    id: z.string({ message: "O id deve ser dado em string" }).length(36, "O id deve conter 36 caracteres").optional(),

    status: z.nativeEnum(STATUS, {
        errorMap: () => ({ message: "status deve ser dado entre um dos valores aceitos: SCHEDULED, REVIEWING, COMPLETED" }),
    }).optional(),
}).refine((data) => {
    return data.status === undefined || data.id === undefined
}, {
    message: "Ao menos um dos campos deve ser preenchido: id, status"
});

export const PresentationSchemaArray = z.array(PresentationSchema);

export const GetPresentationResponse = z.object({
    message: z.string(),
    presentations: PresentationSchemaArray
});