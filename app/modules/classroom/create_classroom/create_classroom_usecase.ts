import { Classroom } from "../../../shared/domain/entities/classroom";
import { IClassroomRepository } from "../../../shared/domain/interfaces/IClassroomRepository";
import { BadRequestException } from "../../../shared/helpers/exceptions";

interface CreateClassInputInterface {
    name: string;
}

export class CreateClassroomUseCase {
    constructor(private readonly classroomRepository: IClassroomRepository) {}

    async execute({name}: CreateClassInputInterface): Promise<Classroom>{
        const existingClassroom= await this.classroomRepository.getClassroomByName(name);

        if (existingClassroom){
            throw new BadRequestException("Já existe uma sala com esse nome");
        }

        const classroomId= crypto.randomUUID();

        const newClassroom= new Classroom(
            classroomId,
            name
        );

        await this.classroomRepository.createClassroom(newClassroom);

        return newClassroom;
    }
}