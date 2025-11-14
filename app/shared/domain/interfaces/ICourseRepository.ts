import { Course } from "../entities/course";

export interface ICourseRepository {
    createCourse(course: Course): Promise<Course>;
    fetchCourses(): Promise<Course[]>;
    getCourseById(courseId: string): Promise<Course | null>;
    deleteCourse(courseId: string): Promise<Course | null>;
}

