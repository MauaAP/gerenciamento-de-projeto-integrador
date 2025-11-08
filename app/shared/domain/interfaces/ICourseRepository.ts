import { Course } from "../entities/couse";

export interface ICourseRepository {
    createCourse(course: Course): Promise<Course>

    fetchCourses(): Promise<Course[]>

    getCourseById(courseId: string): Promise<Course | null>

    getCourseByName(name: string): Promise<Course | null>

    deleteCourse(courseId: string): Promise<Course | null>

    // update course não é necessário no momento
}