import { Classroom } from "../../domain/entities/classroom"
import { IClassroomRepository } from "../../domain/interfaces/IClassroomRepository"

export class ClassroomRepoMock implements IClassroomRepository {
    private classrooms: Classroom[] = [
        new Classroom(
            "076ce3be-58ce-4ec7-8e64-7f8052929e21",
            "U27"
        ),
        new Classroom(
            "b1be4676-ed3b-418e-959b-b5b6a114ed44",
            "U29"
        ),
        new Classroom(
            "83583dfb-160d-430c-9da3-364c41d42846",
            "U31"
        ),
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
        return this.classrooms.find((classroom) => classroom.name === name) || null;
    }

    async deleteClassroom(classroomId: string): Promise<Classroom | null> {
        const index = this.classrooms.findIndex((classroom) => classroom.classroomId === classroomId);

        if (index === -1) return null;

        return this.classrooms.splice(index, 1)[0];
    }
}