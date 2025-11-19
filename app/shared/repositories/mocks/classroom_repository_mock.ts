import { Classroom } from "../../domain/entities/classroom";
import { IClassroomRepository } from "../../domain/interfaces/IClassroomRepository";

export class ClassroomRepoMock implements IClassroomRepository {
    private classrooms: Classroom[] = [
        new Classroom(
            "00000000-0000-0000-0000-000000000001",
            "Sala A101",
            50
        ),
        new Classroom(
            "00000000-0000-0000-0000-000000000002",
            "Sala B202",
            40
        ),
        new Classroom(
            "00000000-0000-0000-0000-000000000003",
            "Sala C303",
            60
        ),
        new Classroom(
            "00000000-0000-0000-0000-000000000004",
            "Sala D404",
            30
        ),
        new Classroom(
            "00000000-0000-0000-0000-000000000005",
            "Sala E505",
            45
        )
    ];

    async createClassroom(classroom: Classroom): Promise<Classroom> {
        this.classrooms.push(classroom);
        return classroom;
    }

    async fetchClassrooms(): Promise<Classroom[]> {
        return this.classrooms;
    }

    async getClassroomById(classroomId: string): Promise<Classroom | null> {
        return this.classrooms.find((classroom) => classroom.classroomId === classroomId) || null;
    }

    async getClassroomByName(name: string): Promise<Classroom | null> {
        throw new Error("getClassroomByName not implemented in mock");
    }

    async deleteClassroom(classroomId: string): Promise<Classroom | null> {
        const index = this.classrooms.findIndex((classroom) => classroom.classroomId === classroomId);
        if (index === -1) {
            return null;
        }
        return this.classrooms.splice(index, 1)[0];
    }
}

