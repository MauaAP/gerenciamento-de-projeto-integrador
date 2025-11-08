import { Course } from "../../../shared/domain/entities/couse";
import { ICourseRepository } from "../../../shared/domain/interfaces/ICourseRepository";
import { BadRequestException } from "../../../shared/helpers/exceptions";

interface CreateCourseInputInterface {
    name: string;
}

export class CreateCourseUseCase {
    constructor(private readonly courseRepository: ICourseRepository) {}

    async execute({name}: CreateCourseInputInterface): Promise<Course>{
        const existingCourse= await this.courseRepository.getCourseByName(name);

        if (existingCourse){
            throw new BadRequestException("Já existe um curso com esse nome");
        }

        const courseId= crypto.randomUUID();

        const newCourse= new Course(
            courseId,
            name
        );

        await this.courseRepository.createCourse(newCourse);

        return newCourse;
    }
}