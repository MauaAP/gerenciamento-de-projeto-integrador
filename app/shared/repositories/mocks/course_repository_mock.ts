import { Course } from "../../domain/entities/course";
import { COURSE } from "../../domain/enums/course";
import { ICourseRepository } from "../../domain/interfaces/ICourseRepository";

export class CourseRepoMock implements ICourseRepository {
    private courses: Course[] = [
        new Course(
            "00000000-0000-0000-0000-000000000001",
            COURSE.CIC
        ),
        new Course(
            "00000000-0000-0000-0000-000000000002",
            COURSE.SIN
        ),
        new Course(
            "00000000-0000-0000-0000-000000000003",
            COURSE.RIN
        ),
        new Course(
            "00000000-0000-0000-0000-000000000004",
            COURSE.DSN
        )
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

    async getCourseByName(name: COURSE | string): Promise<Course | null> {
        // Se name for enum COURSE, comparar diretamente
        // Se name for string, comparar com o valor do enum
        return this.courses.find((course) => {
            if (typeof name === 'string') {
                // Se name é string, pode ser o valor do enum ou o nome completo
                return course.name === name || course.name.toString() === name;
            } else {
                // Se name é enum COURSE, comparar diretamente
                return course.name === name;
            }
        }) || null;
    }

    async deleteCourse(courseId: string): Promise<Course | null> {
        const index = this.courses.findIndex((course) => course.courseId === courseId);
        if (index === -1) {
            return null;
        }
        return this.courses.splice(index, 1)[0];
    }
}

