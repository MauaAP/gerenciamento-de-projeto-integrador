import { IClassroomRepository } from "../../../shared/domain/interfaces/IClassroomRepository";
import { NotFoundException } from "../../../shared/helpers/exceptions";

export class DeleteClassroomUseCase {
    constructor(private classroomRepository: IClassroomRepository) {}

    async execute(id: string) {
        const deletedClassroom = await this.classroomRepository.deleteClassroom(id);

        if (deletedClassroom === null) {
            throw new NotFoundException("Sala de aula não encontrada");
        }

        return deletedClassroom;
    }
}