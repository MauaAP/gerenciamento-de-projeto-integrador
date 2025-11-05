import { BadRequestException } from "../../../../shared/helpers/exceptions";
import { IClassroomRepository } from "../../../../shared/domain/interfaces/IClassroomRepository";
import { Classroom } from "../../../../shared/domain/entities/classroom";
import { DynamoDBResources } from "./dynamo_datasource";

export class ClassroomRepositoryDynamoDB implements IClassroomRepository {
    private db: DynamoDBResources;

    constructor(dynamoDb: DynamoDBResources) {
        this.db = dynamoDb;
    }
    async createClassroom(classroom: Classroom): Promise<Classroom> {
        throw new BadRequestException("Method not implemented.");
    }
    async fetchClassrooms(): Promise<Classroom[]> {
        throw new BadRequestException("Method not implemented.");
    }
    async getClassroomById(classroomId: string): Promise<Classroom | null> {
        throw new BadRequestException("Method not implemented.");
    }
    async getClassroomByName(name: string): Promise<Classroom | null> {
        throw new BadRequestException("Method not implemented.");
    }
    async deleteClassroom(classroomId: string): Promise<Classroom | null> {
        throw new BadRequestException("Method not implemented.");
    }
}