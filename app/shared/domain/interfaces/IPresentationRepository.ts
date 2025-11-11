import { Presentation } from "../entities/presentation";
export type PresentationFilter = {
    date?: number,
    groupId?: string,
    examinationBoardId?: string
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

    getPresentationByFilter(filter: PresentationFilter): Promise<Presentation[] | null>;

    getPresentationByStudentId(studentId: string): Promise<Presentation[] | null>;

    getPresentationByExaminatorId(examinatorId: string): Promise<Presentation[] | null>;

    deletePresentation(presentationId: string): Promise<Presentation | null>;

    updatePresentation(presentationId: string, updateOptions: PresentationUpdateOptions): Promise<Presentation | null>
}