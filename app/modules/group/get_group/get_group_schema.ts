import { COURSE } from "../../../shared/domain/enums/course";
import { z } from "zod";
import { GroupSchema } from "../create_group/create_group_schema";

export const GetGroupRequest = z.object({
    id: z.string().length(36, "O id deve conter 36 caracteres").optional(),

    userId: z.string().length(36, "O user id deve conter 36 caracteres").optional(),

    codSubj: z.string().optional(),

    yearSem: z.coerce.number({ message: "O yearSem deve ser dadas em numero" }).min(1, { message: "O yearSem deve ser maior que 0" }).optional(),

    projectId: z.string({ message: "projectId é obrigatório" }).length(36, "O projectId deve conter 36 caracteres").optional(),

    courseId: z.string({ message: "courseId deve ser dado em string" }).length(36, "O courseId deve conter 36 caracteres").optional()

}).refine((data) => {
    const filterFields = [data.userId, data.codSubj, data.yearSem, data.projectId, data.courseId];

    const hasFilter = filterFields.some(f => f !== undefined);

    const hasId = data.id !== undefined

    return (hasId && !hasFilter) || (!hasId && hasFilter)
},
    {
        message: "Você deve informar id ou filtros (exatemente um))"
    })

export const GroupSchemaArray = z.array(GroupSchema)

export const GetGroupResponse = z.object({
    message: z.string(),
    group: GroupSchemaArray
});

