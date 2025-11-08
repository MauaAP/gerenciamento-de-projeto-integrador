import { ICourseRepository } from "../../../shared/domain/interfaces/ICourseRepository";
import { NotFoundException } from "../../../shared/helpers/exceptions";

export class DeleteCourseUseCase {
    constructor(private courseRepository: ICourseRepository) {}

    async execute(id: string) {
        const deletedCourse= await this.courseRepository.deleteCourse(id);

        if (deletedCourse === null)
            throw new NotFoundException("Curso não encontrado no banco");

        return deletedCourse;
    }
}