import { Presentation } from "../entities/presentation";
import { STATUS } from "../enums/status";
export type PresentationFilter = {
    date?: number,
    groupId?: string,
    examinationBoardId?: string
    status?: string
}

export type PresentationUpdateOptions = {
    date?: number,
    groupId?: string,
    examinationBoardId?: string,
    classRoomId?: string
    staus?: string
}


export interface IPresentationRepository {
    createPresentation(presentation: Presentation): Promise<Presentation>;

    fetchPresentation(): Promise<Presentation[]>;

    getPresentationById(presentationId: string): Promise<Presentation | null>;

    getPresentationsByFilter(filter: PresentationFilter): Promise<Presentation[] | null>;

    getPresentationByStudentId(studentId: string, status: STATUS): Promise<Presentation[] | null>;

    getPresentationByExaminatorId(examinatorId: string, status: STATUS): Promise<Presentation[] | null>;

    deletePresentation(presentationId: string): Promise<Presentation | null>;

    updatePresentation(presentationId: string, updateOptions: PresentationUpdateOptions): Promise<Presentation | null>
}