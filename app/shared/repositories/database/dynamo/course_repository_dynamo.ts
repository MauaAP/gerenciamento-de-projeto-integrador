import { Course } from "../../../../shared/domain/entities/couse";
import { ICourseRepository } from "../../../../shared/domain/interfaces/ICourseRepository";
import { DynamoDBResources } from "./dynamo_datasource";

export class CourseRepositoryDynamoDB  implements ICourseRepository {
    private db: any;

    constructor(dynamoDb: DynamoDBResources) {
        this.db = dynamoDb;
    }

    async createCourse(course: Course): Promise<any> {
        throw new Error("Method not implemented.");
    }

    async fetchCourses(): Promise<Course[]> {
        throw new Error("Method not implemented.");
    }

    async getCourseById(courseId: string): Promise<Course | null> {
        throw new Error("Method not implemented.");
    }

    async getCourseByName(name: string): Promise<Course | null> {
        throw new Error("Method not implemented.");
    }

    async deleteCourse(courseId: string): Promise<Course | null> {
        throw new Error("Method not implemented.");
    }
}