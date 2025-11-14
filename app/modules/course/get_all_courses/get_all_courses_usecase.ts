import { Course } from "../../../shared/domain/entities/course";
import { ICourseRepository } from "../../../shared/domain/interfaces/ICourseRepository";

export class GetAllCoursesUseCase {
    constructor(private readonly courseRepository: ICourseRepository) {}

    async execute(): Promise<Course[]> {
        return await this.courseRepository.fetchCourses();
    }
}

