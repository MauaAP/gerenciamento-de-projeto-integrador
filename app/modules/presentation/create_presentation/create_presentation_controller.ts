import { ForbiddenException } from "../../../shared/helpers/exceptions";
import { UserFromToken } from "../../../shared/middleware/jwt_middleware";
import { parseBody } from "../../../shared/utils/parse_body";
import { Request, Response } from "express"
import { CreatePresentationRequest, CreatePresentationResponse } from "./create_presentation_schema";
import { CreatePresentationUseCase } from "./create_presentation_usecase";

export class CreatePresentationController {
    constructor(private readonly usecase: CreatePresentationUseCase) { }

    async handler(req: Request, res: Response) {
        const userFromToken = req.user as UserFromToken;

        const allowedRoles = ["ADMIN", "MODERATOR"]

        if (!allowedRoles.includes(userFromToken.role)) {
            throw new ForbiddenException("Você não tem permissão para acessar este recurso"
            );
        }

        const { date, groupId, examinationBoardId, classRoomId} = parseBody(
            CreatePresentationRequest,
            req.body
        );

        const newPresentation = await this.usecase.execute({
            date,
            groupId,
            examinationBoardId,
            classRoomId
        });

        const response = CreatePresentationResponse.parse({
            message: "Apresentação criada com sucesso",
            presentation: {
                id: newPresentation.id,
                date: newPresentation.date,
                classRoomName: newPresentation.classRoomName,
                status: newPresentation.status,
                group: {
                    codSubj: newPresentation.group.codSubj,
                    userNameList: newPresentation.group.userNameList,
                    yearSem: newPresentation.group.yearSem,
                    project: {
                        title: newPresentation.group.project.title,
                        partnerName: newPresentation.group.project.partnerName,
                        extensionHours: newPresentation.group.project.extensionHours
                    },
                    courseName: newPresentation.group.courseName
                },
                examinationBoard: {
                    professorNameList: newPresentation.examinationBoard.porfessorNameList
                }
            }
        });
        res.status(201).json(response)
    }
}