import type { DynamoDBResources } from "./dynamo_datasource";
import { Classroom } from "../../../../shared/domain/entities/classroom";
import { IClassroomRepository } from "../../../../shared/domain/interfaces/IClassroomRepository";

function getClassroomPK(classroomId: string): string {
  return `CLASSROOM#${classroomId}`;
}

function getClassroomSK(): string {
  return "METADATA";
}

export class ClassroomRepositoryDynamoDB implements IClassroomRepository {
  private db: DynamoDBResources;

  constructor(db: DynamoDBResources) {
    this.db = db;
  }

  async createClassroom(classroom: Classroom): Promise<Classroom> {
    const pk = getClassroomPK(classroom.classroomId);
    const sk = getClassroomSK();

    const item = {
      PK: pk,
      SK: sk,
      ...classroom.toJson()
    };

    await this.db.put(item, pk, sk);
    console.log(`[DynamoDB] Sala criada: ${pk} - ${classroom.name}`);
    
    return classroom;
  }

  async fetchClassrooms(): Promise<Classroom[]> {
    const items = await this.db.scanAll({
      FilterExpression: "begins_with(#pk, :classroomPrefix) AND #sk = :metadata",
      ExpressionAttributeNames: { 
        "#pk": "PK",
        "#sk": "SK"
      },
      ExpressionAttributeValues: { 
        ":classroomPrefix": "CLASSROOM#",
        ":metadata": "METADATA"
      },
    });
    console.log(`[DynamoDB] FetchClassrooms retornou ${items.length} itens`);
    return items.map(Classroom.fromJson);
  }

  async getClassroomById(classroomId: string): Promise<Classroom | null> {
    const pk = getClassroomPK(classroomId);
    const sk = getClassroomSK();

    const item = await this.db.get(pk, sk);

    if (item) {
      console.log(`[DynamoDB] Busca por ID: ${pk} - Encontrado`);
      return Classroom.fromJson(item);
    }

    console.log(`[DynamoDB] Busca por ID: ${classroomId} - Não encontrado`);
    return null;
  }
}

