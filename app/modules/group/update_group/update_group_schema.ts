import { COURSE } from "../../../shared/domain/enums/course"
import { z } from "zod"
import { GroupSchema } from "../create_group/create_group_schema"
export const UpdateGroupRequest = z.object({
    id: z
        .string({ message: "O id deve ser dado em string" }).length(36, "O id deve conter 36 caracteres"),

    codSubj: z.string({ message: "O codSubj deve ser dado em string" }).optional(),

    userIdList: z.array(
        z.string({ message: "O userId deve ser dado em string" }).length(36, "O userId deve conter 36 caracteres"),
        { message: "O userIdList deve ser um array" }
    )
        .nonempty({ message: "O userIdList deve conter ao menos um id de usuário" }
        ).optional(),

    yearSem: z.number({ message: "O yearSem deve ser dadas em numero" }).min(1, { message: "O yearSem deve ser maior que 0" }).optional(),

    projectId: z.string({ message: "O projectId deve ser dado em string" }).length(36, "O projectId deve conter 36 caracteres").optional(),

    course: z.nativeEnum(COURSE, { errorMap: () => ({ message: "course não está entre os disponíveis" }) }).optional()
    
}).refine(
    (data) => (data.codSubj !== undefined || data.userIdList !== undefined || data.yearSem !== undefined || data.projectId !== undefined || data.course !== undefined),
    {
        message: "Você deve passar algum atributo para ser alterado"
    }
)

export const UpdateGroupResponse = z.object({
    message: z.string(),
    group: GroupSchema
})