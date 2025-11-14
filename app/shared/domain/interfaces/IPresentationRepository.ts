import { Presentation } from "../entities/presentation";
import { PRESENTATION_STATUS } from "../enums/presentation_status";

export type PresentationFilter = {
    date?: number,
    groupId?: string,
    examinationBoardId?: string,
    status?: PRESENTATION_STATUS
}

export type PresentationUpdateOptions = {
    date?: number,
    groupId?: string,
    examinationBoardId? : string,
    classroomId?: string,
    status?: PRESENTATION_STATUS
}


export interface IPresentationRepository {
    createPresentation(presentation: Presentation, professorIds?: string[], alunoIds?: string[]): Promise<Presentation>;

    fetchPresentation(): Promise<Presentation[]>;

    getPresentationById(presentationId: string): Promise<Presentation | null>;

    getPresentationByFilter(filter: PresentationFilter): Promise<Presentation[] | null>;

    getPresentationByStudentId(studentId: string, status?: PRESENTATION_STATUS): Promise<Presentation[] | null>;

    getPresentationByExaminatorId(examinatorId: string, status?: PRESENTATION_STATUS): Promise<Presentation[] | null>;

    deletePresentation(presentationId: string): Promise<Presentation | null>;

    updatePresentation(presentationId: string, updateOptions: PresentationUpdateOptions): Promise<Presentation | null>
}