import { Classroom } from "../entities/classroom"

export interface IClassroomRepository {
    createClassroom(classroom: Classroom): Promise<Classroom>

    fetchClassrooms(): Promise<Classroom[]>

    getClassroomById(classroomId: string): Promise<Classroom | null>

    getClassroomByName(name: string): Promise<Classroom | null>

    deleteClassroom(classroomId: string): Promise<Classroom | null>

    // update classroom creio que não seja necessário no momento
}