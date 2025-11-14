import type { DynamoDBResources } from "./dynamo_datasource";
import { Course } from "../../../../shared/domain/entities/course";
import { ICourseRepository } from "../../../../shared/domain/interfaces/ICourseRepository";
import { COURSE } from "../../../../shared/domain/enums/course";

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

  async getCourseByName(name: COURSE | string): Promise<Course | null> {
    // O enum COURSE já tem valores string, então podemos usar diretamente
    // Se name for enum COURSE, o valor já é uma string como "CIÊNCIAS DA COMPUTAÇÃO"
    const nameString = name;
    
    const items = await this.db.scanAll({
      FilterExpression: "begins_with(#pk, :coursePrefix) AND #sk = :metadata AND #name = :nameValue",
      ExpressionAttributeNames: { 
        "#pk": "PK",
        "#sk": "SK",
        "#name": "name"
      },
      ExpressionAttributeValues: { 
        ":coursePrefix": "COURSE#",
        ":metadata": "METADATA",
        ":nameValue": nameString
      },
    });
    
    if (items.length > 0) {
      console.log(`[DynamoDB] Busca por nome: ${nameString} - Encontrado`);
      return Course.fromJson(items[0]);
    }

    console.log(`[DynamoDB] Busca por nome: ${nameString} - Não encontrado`);
    return null;
  }

  async deleteCourse(courseId: string): Promise<Course | null> {
    const course = await this.getCourseById(courseId);

    if (!course) {
      return null;
    }

    const pk = getCoursePK(courseId);
    const sk = getCourseSK();

    await this.db.delete(pk, sk);
    console.log(`[DynamoDB] Curso deletado: ${pk}`);

    return course;
  }
}

