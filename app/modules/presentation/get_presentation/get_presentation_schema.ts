import { z } from "zod";
import { PresentationSchema } from "../create_presentation/create_presentation_schema";
import { PRESENTATION_STATUS } from "../../../shared/domain/enums/presentation_status";

export const GetPresentationRequest = z.object({
    id: z.string({ message: "O id deve ser dado em string" }).length(36, "O id deve conter 36 caracteres").optional(),

    date: z.coerce.number({message: "date deve ser dada em numero"}).optional(),

    groupId: z.string({message: "groupId deve ser dado em string"}).length(36, "O group id deve conter 36 caracteres").optional(),

    examinationBoartId: z.string({message: "examinationBoardId deve ser dado em string"}).length(36, "O examinationBoart id deve conter 36 caracteres").optional(),

    status: z.enum(["SCHEDULED", "REVIEWING", "COMPLETED"], {
        errorMap: () => ({ message: "Status deve ser SCHEDULED, REVIEWING ou COMPLETED" })
    }).transform((val) => {
        const statusMap: Record<string, PRESENTATION_STATUS> = {
            "SCHEDULED": PRESENTATION_STATUS.SCHEDULED,
            "REVIEWING": PRESENTATION_STATUS.REVIEWING,
            "COMPLETED": PRESENTATION_STATUS.COMPLETED
        };
        return statusMap[val];
    }).optional()
}).refine((data) => {
    const filterFields = [data.date, data.groupId, data.examinationBoartId];
    const hasOtherFilters = filterFields.some(f => f !== undefined);
    const hasId = data.id !== undefined;
    const hasStatus = data.status !== undefined;

    // Permitir: 
    // 1. id sozinho (sem outros filtros)
    // 2. filtros normais (sem id e sem status)
    // 3. status sozinho (será usado com user_id do token)
    // 4. status + outros filtros (não permitido - status deve ser usado sozinho)
    if (hasId) {
        return !hasOtherFilters && !hasStatus; // id sozinho
    }
    if (hasStatus) {
        return !hasOtherFilters; // status sozinho
    }
    return hasOtherFilters; // filtros normais
},
    {
        message: "Você deve informar: (1) id, OU (2) filtros (date/groupId/examinationBoartId), OU (3) status (será usado com seu user_id do token)"
    }
)

export const PresentationSchemaArray = z.array(PresentationSchema);

export const GetPresentationResponse = z.object({
    message: z.string(),
    presentations: PresentationSchemaArray
});