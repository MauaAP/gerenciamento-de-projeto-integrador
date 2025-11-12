import type { DynamoDBResources } from "./dynamo_datasource";
import { Course } from "../../../../shared/domain/entities/course";
import { ICourseRepository } from "../../../../shared/domain/interfaces/ICourseRepository";

function getCoursePK(courseId: string): string {
  return `COURSE#${courseId}`;
}

function getCourseSK(): string {
  return "METADATA";
}

export class CourseRepositoryDynamoDB implements ICourseRepository {
  private db: DynamoDBResources;

  constructor(db: DynamoDBResources) {
    this.db = db;
  }

  async createCourse(course: Course): Promise<Course> {
    const pk = getCoursePK(course.courseId);
    const sk = getCourseSK();

    const item = {
      PK: pk,
      SK: sk,
      ...course.toJson()
    };

    await this.db.put(item, pk, sk);
    console.log(`[DynamoDB] Curso criado: ${pk} - ${course.name}`);
    
    return course;
  }

  async fetchCourses(): Promise<Course[]> {
    const items = await this.db.scanAll({
      FilterExpression: "begins_with(#pk, :coursePrefix) AND #sk = :metadata",
      ExpressionAttributeNames: { 
        "#pk": "PK",
        "#sk": "SK"
      },
      ExpressionAttributeValues: { 
        ":coursePrefix": "COURSE#",
        ":metadata": "METADATA"
      },
    });
    console.log(`[DynamoDB] FetchCourses retornou ${items.length} itens`);
    return items.map(Course.fromJson);
  }

  async getCourseById(courseId: string): Promise<Course | null> {
    const pk = getCoursePK(courseId);
    const sk = getCourseSK();

    const item = await this.db.get(pk, sk);

    if (item) {
      console.log(`[DynamoDB] Busca por ID: ${pk} - Encontrado`);
      return Course.fromJson(item);
    }

    console.log(`[DynamoDB] Busca por ID: ${courseId} - Não encontrado`);
    return null;
  }
}

