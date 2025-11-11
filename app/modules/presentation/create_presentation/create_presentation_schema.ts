import { z } from "zod";

export const CreatePresentationRequest = z.object({
    date: z.number({ message: "A data deve ser data em numero" }),

    groupId: z.string({ message: "O groupId deve ser dado em string" }).length(36, "O groupId deve conter 36 caracteres"),

    examinationBoardId: z.string({ message: "O examinationBoardId deve ser dado em string" }).length(36, "O examinationBoardId deve conter 36 caracteres"),

    classRoomId: z.string({ message: "O classRoomId deve ser dado em string" }).length(36, "O classRoomId deve conter 36 caracteres")
});

export const PresentationSchema = z.object({
    id: z.string(),
    date: z.number(),
    classRoomName: z.string(),
    status: z.string(),
    group: z.object({
        codSubj: z.string(),
        userNameList: z.array(z.string()),
        yearSem: z.number(),
        project: z.object({
            title: z.string(),
            partnerName: z.string(),
            extensionHours: z.number().optional()
        }),
        courseName: z.string()
    }),
    examinationBoard: z.object({
        professorNameList: z.array(z.string())
    })
});

export const CreatePresentationResponse = z.object({
    message: z.string(),
    presentation: PresentationSchema
});