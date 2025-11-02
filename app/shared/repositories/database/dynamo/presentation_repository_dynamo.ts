import { Presentation } from "app/shared/domain/entities/presentation";
import { IPresentationRepository, PresentationFilter, PresentationUpdateOptions } from "app/shared/domain/interfaces/IPresentationRepository";
import { DynamoDBResources } from "./dynamo_datasource";

export class PresentationRepositoryDynamoDB implements IPresentationRepository {
    private db: DynamoDBResources;

    constructor(db: DynamoDBResources) {
        this.db = db;
    }
    
    createPresentation(presentation: Presentation): Promise<Presentation> {
        throw new Error("Method not implemented.");
    }

    fetchPresentation(): Promise<Presentation[]> {
        throw new Error("Method not implemented.");
    }

    getPresentationById(presentationId: string): Promise<Presentation | null> {
        throw new Error("Method not implemented.");
    }

    getPresentationByFilter(filter: PresentationFilter): Promise<Presentation[] | null> {
        throw new Error("Method not implemented.");
    }

    deletePresentation(presentationId: string): Promise<Presentation | null> {
        throw new Error("Method not implemented.");
    }

    updatePresentation(presentationId: string, updateOptions: PresentationUpdateOptions): Promise<Presentation | null> {
        throw new Error("Method not implemented.");
    }
}