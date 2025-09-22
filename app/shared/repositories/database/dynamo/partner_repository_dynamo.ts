import type { IPartnerRepository, PartnerUpdateOptions } from "../../../../shared/domain/interfaces/IPartnerRepository";
import type { DynamoDBResources } from "./dynamo_datasource";
import type { Partner } from "../../../../shared/domain/entities/partner";

export class PartnerRepositoryDynamoDB implements IPartnerRepository {
  private db: DynamoDBResources;

  constructor(db: DynamoDBResources) {
    this.db = db;
  }
  createPartner(partner: Partner): Promise<Partner> {
    throw new Error("Method not implemented.");
  }
  fetchPartners(): Promise<Partner[]> {
    throw new Error("Method not implemented.");
  }
  getPartnerById(partnerId: string): Promise<Partner | null> {
    throw new Error("Method not implemented.");
  }
  getPartnerByname(name: string): Promise<Partner | null> {
    throw new Error("Method not implemented.");
  }
  deletePartnerById(partnerId: string): Promise<Partner | null> {
    throw new Error("Method not implemented.");
  }
  updatePartner(partnerId: string, updateOptions: PartnerUpdateOptions): Promise<Partner | null> {
    throw new Error("Method not implemented.");
  }
}
