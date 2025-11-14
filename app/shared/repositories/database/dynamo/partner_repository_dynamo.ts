import type { IPartnerRepository, PartnerUpdateOptions } from "../../../../shared/domain/interfaces/IPartnerRepository";
import type { DynamoDBResources } from "./dynamo_datasource";
import { Partner } from "../../../../shared/domain/entities/partner";
import { NotFoundException } from "../../../../shared/helpers/exceptions";
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
    console.log("[PartnerRepositoryDynamoDB] ========== createPartner INICIANDO ==========");
    console.log("[PartnerRepositoryDynamoDB] Partner recebido:", JSON.stringify(partner.toJson(), null, 2));
    
    try {
      const pk= getPartnerPK(partner.partnerId);
      const sk= getPartnerSK();
      console.log("[PartnerRepositoryDynamoDB] PK gerado:", pk);
      console.log("[PartnerRepositoryDynamoDB] SK gerado:", sk);

      const item= {
        PK: pk,
        SK: sk,
        ...partner.toJson()
      };
      console.log("[PartnerRepositoryDynamoDB] Item completo para salvar:", JSON.stringify(item, null, 2));

      console.log("[PartnerRepositoryDynamoDB] Chamando db.put...");
      await this.db.put(item, pk, sk);
      console.log("[PartnerRepositoryDynamoDB] ✅ Item salvo no DynamoDB com sucesso");
      console.log(`[DynamoDB] Parceiro criado: ${pk} - ${partner.name}`);
      
      return partner
    } catch (error: any) {
      console.error("[PartnerRepositoryDynamoDB] ❌❌❌ ERRO NO createPartner ❌❌❌");
      console.error("[PartnerRepositoryDynamoDB] Error name:", error.name);
      console.error("[PartnerRepositoryDynamoDB] Error message:", error.message);
      console.error("[PartnerRepositoryDynamoDB] Error stack:", error.stack);
      console.error("[PartnerRepositoryDynamoDB] Error completo:", JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
      throw error;
    }
  }

  async fetchPartners(): Promise<Partner[]> {
    const items = await this.db.scanAll({
      FilterExpression: "begins_with(#pk, :partnerPrefix) AND #sk = :metadata",
      ExpressionAttributeNames: { 
        "#pk": "PK",
        "#sk": "SK"
      },
      ExpressionAttributeValues: { 
        ":partnerPrefix": "PARTNER#",
        ":metadata": "METADATA"
      },
    });
    console.log(`[DynamoDB] FetchPartners retornou ${items.length} itens`);
    return items.map(Partner.fromJson);
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
    console.log("[PartnerRepositoryDynamoDB] ========== getPartnerByname INICIANDO ==========");
    console.log("[PartnerRepositoryDynamoDB] Buscando por nome:", name);
    
    try {
      console.log("[PartnerRepositoryDynamoDB] Tentando buscar com GSI_Name...");
      // Tentar usar GSI_Name se estiver disponível
      const items = await this.db.queryAll(
        name,
        undefined,
        "GSI_Name",
        "name"
      );
      console.log("[PartnerRepositoryDynamoDB] GSI_Name retornou", items.length, "itens");

      if (items.length > 0) {
        console.log(`[DynamoDB] Busca por nome: ${name} - Encontrado (GSI)`);
        return Partner.fromJson(items[0]);
      }
    } catch (error: any) {
      // Se GSI não existir, usar scan com FilterExpression como fallback
      console.log(`[DynamoDB] GSI_Name não disponível ou erro ao usar:`, error.message);
      console.log(`[DynamoDB] Usando scan como fallback para buscar por nome: ${name}`);
    }

    // Fallback: usar scan com FilterExpression
    console.log("[PartnerRepositoryDynamoDB] Executando scan com FilterExpression...");
    const items = await this.db.scanAll({
      FilterExpression: "begins_with(#pk, :partnerPrefix) AND #sk = :metadata AND #name = :name",
      ExpressionAttributeNames: { 
        "#pk": "PK",
        "#sk": "SK",
        "#name": "name"
      },
      ExpressionAttributeValues: { 
        ":partnerPrefix": "PARTNER#",
        ":metadata": "METADATA",
        ":name": name
      },
    });
    console.log("[PartnerRepositoryDynamoDB] Scan retornou", items.length, "itens");

    console.log(
      `[DynamoDB] Busca por nome: ${name} - ${
        items.length > 0 ? "Encontrado" : "Não encontrado"
      }`
    );

    return items.length > 0 ? Partner.fromJson(items[0]) : null;
  }

  async deletePartnerById(partnerId: string): Promise<Partner | null> {
    const partner= await this.getPartnerById(partnerId);

    if(!partner)
      throw new NotFoundException("Partner not fount");

    const pk= getPartnerPK(partnerId);
    const sk= getPartnerSK();

    await this.db.delete(pk, sk);
    console.log(`[DynamoDB] Parceiro deletado: ${pk}`)

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

    console.log(`[DynamoDB] Parceiro atualizado: ${pk}`);

    return Partner.fromJson(updatedPartner);
  }
}
