import { Course } from "../../../shared/domain/entities/course";
import { ICourseRepository } from "../../../shared/domain/interfaces/ICourseRepository";
import { NotFoundException } from "../../../shared/helpers/exceptions";

export class DeleteCourseUseCase {
    constructor(private readonly courseRepository: ICourseRepository) {}

    async execute(courseId: string): Promise<void> {
        const course = await this.courseRepository.deleteCourse(courseId);

        if (!course) {
            throw new NotFoundException("Curso não está no banco");
        }
    }
}

