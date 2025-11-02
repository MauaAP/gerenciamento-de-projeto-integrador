import { z } from "zod";
import { PresentationSchema } from "../create_presentation/create_presentation_schema";

export const GetPresentationRequest = z.object({
    id: z.string({ message: "O id deve ser dado em string" }).length(36, "O id deve conter 36 caracteres").optional(),

    date: z.number({message: "date deve ser dada em numero"}).optional(),

    groupId: z.string({message: "groupId deve ser dado em string"}).length(36, "O group id deve conter 36 caracteres").optional(),

    examinationBoartId: z.string({message: "examinationBoardId deve ser dado em string"}).length(36, "O examinationBoart id deve conter 36 caracteres").optional()
}).refine((data) => {
    const filterFields = [data.date, data.groupId, data.examinationBoartId];

    const hasFilter = filterFields.some(f => f !== undefined);

    const hasId = data.id !== undefined

    return (hasId && !hasFilter) || (!hasId && hasFilter)
},
    {
        message: "Você deve informar id ou filtros (exatemente um)"
    }
)

export const PresentationSchemaArray = z.array(PresentationSchema);

export const GetPresentationResponse = z.object({
    message: z.string(),
    presentations: PresentationSchemaArray
});