import { COURSE } from "../../../shared/domain/enums/course"
import { z } from "zod"

export const CreateGroupRequest = z.object({
    codSubj: z.string({ message: "Código da matéria é obrigatório" }),
    userIdList: z.array(
        z.string({ message: "O userId deve ser dado em string" }).length(36, "O userId deve conter 36 caracteres"),
        { message: "A lista de usuários é obrigatório" }
    )
        .nonempty({ message: "A lista de usuários deve conter ao menos um id de usuário" }
        ),
    yearSem: z.number({ message: "O yearSem deve ser dadas em numero" }).min(1, { message: "O yearSem deve ser maior que 0" }),
    projectId: z.string({ message: "projectId é obrigatório" }).length(36, "O projectId deve conter 36 caracteres"),
    course: z.nativeEnum(COURSE, { errorMap: () => ({ message: "course é obrigatório" }) })
})

export const GroupSchema = z.object({
    id: z.string(),
    codSubj: z.string(),
    userNameList: z.array(z.string()),
    yearSem: z.number(),
    project: z.object({
        title: z.string(),
        partnerName: z.string(),
        extensionHours: z.number().optional()
    }),
    course: z.string()
})

export const CreateGroupResponse = z.object({
    message: z.string(),
    group: GroupSchema
});