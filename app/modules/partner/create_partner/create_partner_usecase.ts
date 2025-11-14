import { Partner } from "../../../shared/domain/entities/partner";
import { SECTOR } from "../../../shared/domain/enums/sector";
import { IPartnerRepository } from "../../../shared/domain/interfaces/IPartnerRepository";
import { BadRequestException } from "../../../shared/helpers/exceptions";
export interface CreatePartnerDTO {
    name: string,
    sector: SECTOR
}
export class CreatePartnerUseCase {
    constructor(private readonly partnerRepository: IPartnerRepository) {}

    async execute({name, sector}: CreatePartnerDTO) : Promise<Partner> {
        console.log("[CreatePartnerUseCase] ========== INICIANDO ==========");
        console.log("[CreatePartnerUseCase] Dados recebidos:");
        console.log("[CreatePartnerUseCase]   - name:", name, "(tipo:", typeof name, ")");
        console.log("[CreatePartnerUseCase]   - sector:", sector, "(tipo:", typeof sector, ")");
        console.log("[CreatePartnerUseCase] Valores possíveis do enum SECTOR:", Object.values(SECTOR));
        console.log("[CreatePartnerUseCase] Chaves do enum SECTOR:", Object.keys(SECTOR));
        
        try {
            console.log("[CreatePartnerUseCase] Verificando se parceiro já existe por nome...");
            const existingPartner= await this.partnerRepository.getPartnerByname(name)
            console.log("[CreatePartnerUseCase] Parceiro existente?", existingPartner ? "SIM - " + JSON.stringify(existingPartner.toJson()) : "NÃO");
            
            if (existingPartner) {
                console.log("[CreatePartnerUseCase] ❌ Parceiro já cadastrado");
                throw new BadRequestException("Parceiro já cadastrado");
            }
            console.log("[CreatePartnerUseCase] ✅ Parceiro não existe, pode criar");

            console.log("[CreatePartnerUseCase] Gerando partnerId...");
            const partnerId= crypto.randomUUID();
            console.log("[CreatePartnerUseCase] partnerId gerado:", partnerId);

            console.log("[CreatePartnerUseCase] Criando entidade Partner...");
            console.log("[CreatePartnerUseCase]   - partnerId:", partnerId);
            console.log("[CreatePartnerUseCase]   - name:", name);
            console.log("[CreatePartnerUseCase]   - sector:", sector, "(tipo enum:", typeof sector, ")");
            const partner = new Partner(partnerId, name, sector);
            console.log("[CreatePartnerUseCase] ✅ Partner criado:", JSON.stringify(partner.toJson(), null, 2));

            console.log("[CreatePartnerUseCase] Salvando no repositório DynamoDB...");
            await this.partnerRepository.createPartner(partner)
            console.log("[CreatePartnerUseCase] ✅ Partner salvo com sucesso no DynamoDB");

            return partner
        } catch (error: any) {
            console.error("[CreatePartnerUseCase] ❌❌❌ ERRO CAPTURADO ❌❌❌");
            console.error("[CreatePartnerUseCase] Error name:", error.name);
            console.error("[CreatePartnerUseCase] Error message:", error.message);
            console.error("[CreatePartnerUseCase] Error stack:", error.stack);
            console.error("[CreatePartnerUseCase] Error completo:", JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
            throw error;
        }
    }
}