import { Classroom } from "../../../shared/domain/entities/classroom";
import { IClassroomRepository } from "../../../shared/domain/interfaces/IClassroomRepository";
import { BadRequestException } from "../../../shared/helpers/exceptions";

export interface CreateClassroomDTO {
    name: string,
    capacity: number,
    location?: string
}

export class CreateClassroomUseCase {
    constructor(private readonly classroomRepository: IClassroomRepository) {}

    async execute({name, capacity, location}: CreateClassroomDTO): Promise<Classroom> {
        const classroomId = crypto.randomUUID();
        const classroom = new Classroom(classroomId, name, capacity, location);
        
        await this.classroomRepository.createClassroom(classroom);
        
        return classroom;
    }
}

