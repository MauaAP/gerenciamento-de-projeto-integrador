import { Course } from "../../domain/entities/couse";
import { ICourseRepository } from "../../domain/interfaces/ICourseRepository";

export class CourseRepoMock  implements ICourseRepository {
    private courses: Course[]= [
        new Course(
            "1a2b3c4d-5e6f-7g8h-9i0j-k1l2m3n4o5p6",
            "Ciência da Computação"
        ),
        new Course(
            "2b3c4d5e-6f7g-8h9i-0j1k-l2m3n4o5p6q7",
            "Ia"
        ),
        new Course(
            "3c4d5e6f-7g8h-9i0j-1k2l-m3n4o5p6q7r8",
            "Sistemas de Informação"
        ),
        new Course(
            "4d5e6f7g-8h9i-0j1k-2l3m-n4o5p6q7r8s9",
            "ADMINISTRAÇÃO"
        ),
    ];

    async createCourse(course: Course): Promise<Course> {
        this.courses.push(course);
        return course;
    }

    async fetchCourses(): Promise<Course[]> {
        return this.courses;
    }

    async getCourseById(courseId: string): Promise<Course | null> {
        return this.courses.find((course) => course.courseId === courseId) || null;
    }

    async getCourseByName(name: string): Promise<Course | null> {
        return this.courses.find((course) => course.name === name) || null;
    }

    async deleteCourse(courseId: string): Promise<Course | null> {
        const index = this.courses.findIndex((course) => course.courseId === courseId);

        if (index === -1) return null;

        return this.courses.splice(index, 1)[0];
    }
}