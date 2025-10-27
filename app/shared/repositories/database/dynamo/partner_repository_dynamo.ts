import type { IPartnerRepository, PartnerUpdateOptions } from "../../../../shared/domain/interfaces/IPartnerRepository";
import type { DynamoDBResources } from "./dynamo_datasource";
import { Partner } from "../../../../shared/domain/entities/partner";
function getPartnerPK(partnerId: string): string{
  return `PARTNER#${partnerId}`;
}

function getPartnerSK(): string {
  return "METADATA";
}

export class PartnerRepositoryDynamoDB implements IPartnerRepository {
  private db: DynamoDBResources;

  constructor(db: DynamoDBResources) {
    this.db = db;
  }

  async createPartner(partner: Partner): Promise<Partner> {
    const pk= getPartnerPK(partner.partnerId);
    const sk= getPartnerSK();

    const item= {
      PK: pk,
      SK: sk,
      ...partner.toJson()
    };

    await this.db.put(item, pk, sk);
    console.log(`[DynamoDB] Usuário criado: ${pk} - ${partner.name}`);
    
    return partner
  }
  fetchPartners(): Promise<Partner[]> {
    throw new Error("Method not implemented.");
    // conversar de talvez usar o querryAll, talvez precise tirar o partitionKeyValue de obrigatorio
  }

  async getPartnerById(partnerId: string): Promise<Partner | null> {
    const pk= getPartnerPK(partnerId);
    const sk= getPartnerSK();

    const item= await this.db.get(pk, sk)

    if(item){
      console.log(`[DynamoDB] Busca por ID: ${pk} - Encontrado`);
      return Partner.fromJson(item);
    }

    console.log(`[DynamoDB] Busca por ID: ${partnerId} - Não encontrado`);

    return null
  }

  async getPartnerByname(name: string): Promise<Partner | null> {
    // pensando em trocar para partnerId
    const items= await this.db.queryAll(
      name,
      undefined,
      "GSI_Name",
      "name" //pensar aqui
    );

    console.log(
      `[DynamoDB] Busca por email: ${name} - ${
        items.length > 0 ? "Encontrado" : "Não encontrado"
      }`
    );

    return items.length > 0 ? Partner.fromJson(items[0]) : null
  }

  async deletePartnerById(partnerId: string): Promise<Partner | null> {
    const partner= await this.getPartnerById(partnerId);

    if(!partner)
      throw new Error("Partner not fount");

    const pk= getPartnerPK(partnerId);
    const sk= getPartnerSK();

    await this.db.delete(pk, sk);
    console.log(`[DynamoDB] Usuário deletado: ${pk}`)

    return partner
  }

  async updatePartner(partnerId: string, updateOptions: PartnerUpdateOptions): Promise<Partner | null> {
    const current= await this.getPartnerById(partnerId);

    if(!current) {
      return null;
    }

    const pk= getPartnerPK(partnerId);
    const sk= getPartnerSK();

    const updateDict: Partial<Partner>= {};

    if(updateOptions.name) updateDict.name= updateOptions.name;
    if(updateOptions.sector) updateDict.sector= updateOptions.sector;

    const updatedPartner= await this.db.update(pk, sk, updateDict);

    console.log(`[DynamoDB] Usuário atualizado: ${pk}`);

    return Partner.fromJson(updatedPartner);
  }
}
