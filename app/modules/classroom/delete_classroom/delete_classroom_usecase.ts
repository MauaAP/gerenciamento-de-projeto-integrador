import { Classroom } from "../../../shared/domain/entities/classroom";
import { IClassroomRepository } from "../../../shared/domain/interfaces/IClassroomRepository";
import { NotFoundException } from "../../../shared/helpers/exceptions";

export class DeleteClassroomUseCase {
    constructor(private readonly classroomRepository: IClassroomRepository) {}

    async execute(classroomId: string): Promise<Classroom> {
        const classroom = await this.classroomRepository.deleteClassroom(classroomId);

        if (!classroom) {
            throw new NotFoundException("Sala não está no banco");
        }

        return classroom;
    }
}

