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

    async deleteCourse(courseId: string): Promise<Course | null> {
        const index = this.courses.findIndex((course) => course.courseId === courseId);
        if (index === -1) {
            return null;
        }
        return this.courses.splice(index, 1)[0];
    }
}

