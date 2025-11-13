import { Classroom } from "../entities/classroom";

export interface IClassroomRepository {
    createClassroom(classroom: Classroom): Promise<Classroom>;
    fetchClassrooms(): Promise<Classroom[]>;
    getClassroomById(classroomId: string): Promise<Classroom | null>;
    deleteClassroom(classroomId: string): Promise<Classroom | null>;
}

