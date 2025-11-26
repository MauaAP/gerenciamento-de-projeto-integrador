import { Classroom } from "../entities/classroom";

export interface IClassroomRepository {
    createClassroom(classroom: Classroom): Promise<Classroom>;
    fetchClassrooms(): Promise<Classroom[]>;
    getClassroomById(classroomId: string): Promise<Classroom | null>;
    //metodo que eu adicionei a baixo
    getClassroomByName(name: string): Promise<Classroom | null>;
    deleteClassroom(classroomId: string): Promise<Classroom | null>;
}

