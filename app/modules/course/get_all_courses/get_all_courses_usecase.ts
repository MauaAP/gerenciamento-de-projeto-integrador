import { Course } from "../../../shared/domain/entities/couse";
import { ICourseRepository } from "../../../shared/domain/interfaces/ICourseRepository";

export class GetAllCoursesUseCase {
    constructor(private readonly courseRepository: ICourseRepository) {}

    async execute(): Promise<Course[]> {
        const coursesList= await this.courseRepository.fetchCourses();

        return coursesList;
    }
}