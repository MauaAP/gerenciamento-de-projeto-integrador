import { Classroom } from "../../../shared/domain/entities/classroom";
import { IClassroomRepository } from "../../../shared/domain/interfaces/IClassroomRepository";

export class GetAllClassroomsUseCase {
    constructor(private readonly classroomRepository: IClassroomRepository) {}

    async execute(): Promise<Classroom[]> {
        return await this.classroomRepository.fetchClassrooms();
    }
}

