import { Course } from "../../../shared/domain/entities/course";
import { ICourseRepository } from "../../../shared/domain/interfaces/ICourseRepository";
import { COURSE } from "../../../shared/domain/enums/course";

export interface CreateCourseDTO {
    name: COURSE,
    code?: string
}

export class CreateCourseUseCase {
    constructor(private readonly courseRepository: ICourseRepository) {}

    async execute({name, code}: CreateCourseDTO): Promise<Course> {
        const courseId = crypto.randomUUID();
        const course = new Course(courseId, name, code);
        
        await this.courseRepository.createCourse(course);
        
        return course;
    }
}

