import { Presentation } from "../../../../shared/domain/entities/presentation";
import { IPresentationRepository, PresentationFilter, PresentationUpdateOptions } from "../../../../shared/domain/interfaces/IPresentationRepository";
import { PRESENTATION_STATUS } from "../../../../shared/domain/enums/presentation_status";
import { DynamoDBResources } from "./dynamo_datasource";

function getPresentationPK(presentationId: string): string {
  return `APRESENTACAO#${presentationId}`;
}

function getPresentationSK(): string {
  return "METADATA";
}

function getGroupPK(groupId: string): string {
  return `GROUP#${groupId}`;
}

function getExaminationBoardPK(examinationBoardId: string): string {
  return `BANCA#${examinationBoardId}`;
}

function getAlunoPK(userId: string): string {
  return `ALUNO#${userId}`;
}

function getProfPK(professorId: string): string {
  return `PROF#${professorId}`;
}

export class PresentationRepositoryDynamoDB implements IPresentationRepository {
    private db: DynamoDBResources;

    constructor(db: DynamoDBResources) {
        this.db = db;
    }
    
    async createPresentation(presentation: Presentation, professorIds?: string[], alunoIds?: string[]): Promise<Presentation> {
        const pk = getPresentationPK(presentation.presentationId);
        
        // 1. Criar item principal: APRESENTACAO#ID + SK: METADATA
        const metadataItem = {
            PK: pk,
            SK: getPresentationSK(),
            ...presentation.toJson()
        };
        await this.db.put(metadataItem, pk, getPresentationSK());

        // 2. Criar relacionamento: APRESENTACAO#ID + SK: GROUP#ID
        const groupRelationshipItem = {
            PK: pk,
            SK: `GROUP#${presentation.groupId}`,
            groupId: presentation.groupId
        };
        await this.db.put(groupRelationshipItem, pk, `GROUP#${presentation.groupId}`);

        // 3. Criar relacionamento: APRESENTACAO#ID + SK: BANCA#ID
        const bancaRelationshipItem = {
            PK: pk,
            SK: `BANCA#${presentation.examinationBoartId}`,
            examinationBoardId: presentation.examinationBoartId
        };
        await this.db.put(bancaRelationshipItem, pk, `BANCA#${presentation.examinationBoartId}`);

        // 4. Criar relacionamentos com professores: APRESENTACAO#ID + SK: PROF#ID (com GSI2)
        if (professorIds && professorIds.length > 0) {
            for (const professorId of professorIds) {
                const profPK = getProfPK(professorId);
                const profRelationshipItem = {
                    PK: pk,
                    SK: `PROF#${professorId}`,
                    professorId: professorId,
                    GSI2PK: profPK,
                    GSI2SK: `APRESENTACAO#${presentation.presentationId}`,
                    status: presentation.status,
                    date: presentation.date
                };
                await this.db.put(profRelationshipItem, pk, `PROF#${professorId}`);
            }
        }

        // 5. Criar relacionamentos com alunos: APRESENTACAO#ID + SK: ALUNO#ID (com GSI1)
        if (alunoIds && alunoIds.length > 0) {
            for (const alunoId of alunoIds) {
                const alunoPK = getAlunoPK(alunoId);
                const alunoRelationshipItem = {
                    PK: pk,
                    SK: `ALUNO#${alunoId}`,
                    alunoId: alunoId,
                    GSI1PK: alunoPK,
                    GSI1SK: `APRESENTACAO#${presentation.presentationId}`,
                    status: presentation.status,
                    date: presentation.date
                };
                await this.db.put(alunoRelationshipItem, pk, `ALUNO#${alunoId}`);
            }
        }

        console.log(`[DynamoDB] Apresentação criada: ${pk}`);
        
        return presentation;
    }

    async fetchPresentation(): Promise<Presentation[]> {
        const items = await this.db.scanAll({
            FilterExpression: "begins_with(#pk, :presentationPrefix) AND #sk = :metadata",
            ExpressionAttributeNames: { 
                "#pk": "PK",
                "#sk": "SK"
            },
            ExpressionAttributeValues: { 
                ":presentationPrefix": "APRESENTACAO#",
                ":metadata": "METADATA"
            },
        });
        console.log(`[DynamoDB] FetchPresentation retornou ${items.length} itens`);
        return items.map(Presentation.fromJson);
    }

    async getPresentationById(presentationId: string): Promise<Presentation | null> {
        const pk = getPresentationPK(presentationId);
        const sk = getPresentationSK();

        const item = await this.db.get(pk, sk);

        if (!item) {
            console.log(`[DynamoDB] Busca por ID: ${presentationId} - Não encontrado`);
            return null;
        }

        console.log(`[DynamoDB] Busca por ID: ${pk} - Encontrado`);
        return Presentation.fromJson(item);
    }

    async getPresentationByFilter(filter: PresentationFilter): Promise<Presentation[] | null> {
        let presentations: Presentation[] = [];
        const presentationIds = new Set<string>();

        // Filtro por groupId - Query APRESENTACAO#ID onde SK = GROUP#ID
        if (filter.groupId) {
            // Buscar todas as apresentações e filtrar por groupId
            const allPresentations = await this.fetchPresentation();
            const filtered = allPresentations.filter(p => p.groupId === filter.groupId);
            for (const pres of filtered) {
                if (!presentationIds.has(pres.presentationId)) {
                    presentations.push(pres);
                    presentationIds.add(pres.presentationId);
                }
            }
        }

        // Filtro por examinationBoardId - Query APRESENTACAO#ID onde SK = BANCA#ID
        if (filter.examinationBoartId) {
            const allPresentations = await this.fetchPresentation();
            const filtered = allPresentations.filter(p => p.examinationBoartId === filter.examinationBoartId);
            
            for (const pres of filtered) {
                if (!presentationIds.has(pres.presentationId)) {
                    presentations.push(pres);
                    presentationIds.add(pres.presentationId);
                }
            }
        }

        // Filtro por date - Scan com FilterExpression
        if (filter.date) {
            const items = await this.db.scanAll({
                FilterExpression: "begins_with(#pk, :presentationPrefix) AND #sk = :metadata AND #date = :date",
                ExpressionAttributeNames: { 
                    "#pk": "PK",
                    "#sk": "SK",
                    "#date": "date"
                },
                ExpressionAttributeValues: { 
                    ":presentationPrefix": "APRESENTACAO#",
                    ":metadata": "METADATA",
                    ":date": filter.date
                },
            });
            
            const filtered = items.map(Presentation.fromJson);
            for (const pres of filtered) {
                if (!presentationIds.has(pres.presentationId)) {
                    presentations.push(pres);
                    presentationIds.add(pres.presentationId);
                }
            }
        }

        // Se nenhum filtro foi aplicado, retornar todas as apresentações
        if (!filter.groupId && !filter.examinationBoartId && !filter.date) {
            return await this.fetchPresentation();
        }

        console.log(`[DynamoDB] Busca por filtro retornou ${presentations.length} apresentações`);
        return presentations.length > 0 ? presentations : null;
    }

    async getPresentationByStudentId(studentId: string, status?: PRESENTATION_STATUS): Promise<Presentation[] | null> {
        const alunoPK = getAlunoPK(studentId);
        
        // Query GSI1 para buscar apresentações do aluno
        const items = await this.db.queryAll(
            alunoPK,
            "APRESENTACAO#",
            "GSI1",
            "GSI1PK"
        );

        if (items.length === 0) {
            console.log(`[DynamoDB] Busca por StudentId: ${studentId} - Nenhuma apresentação encontrada`);
            return null;
        }

        // Filtrar por status se fornecido
        let filteredItems = items;
        if (status) {
            filteredItems = items.filter(item => item.status === status);
        }

        // Buscar METADATA de cada apresentação encontrada
        const presentations: Presentation[] = [];
        const presentationIds = new Set<string>();
        
        for (const item of filteredItems) {
            // Extrair presentationId do GSI1SK ou PK
            let presentationId: string | undefined;
            if (item.GSI1SK) {
                presentationId = item.GSI1SK.replace("APRESENTACAO#", "");
            } else if (item.PK) {
                presentationId = item.PK.replace("APRESENTACAO#", "");
            }
            
            if (presentationId && !presentationIds.has(presentationId)) {
                presentationIds.add(presentationId);
                const presentation = await this.getPresentationById(presentationId);
                if (presentation) {
                    presentations.push(presentation);
                }
            }
        }

        // Ordenar por date (ascendente)
        presentations.sort((a, b) => a.date - b.date);

        console.log(`[DynamoDB] Busca por StudentId: ${studentId}${status ? ` com status ${status}` : ''} - ${presentations.length} apresentações encontradas`);
        return presentations.length > 0 ? presentations : null;
    }

    async getPresentationByExaminatorId(examinatorId: string, status?: PRESENTATION_STATUS): Promise<Presentation[] | null> {
        const profPK = getProfPK(examinatorId);
        
        // Query GSI2 para buscar apresentações do examinador
        const items = await this.db.queryAll(
            profPK,
            "APRESENTACAO#",
            "GSI2",
            "GSI2PK"
        );

        if (items.length === 0) {
            console.log(`[DynamoDB] Busca por ExaminatorId: ${examinatorId} - Nenhuma apresentação encontrada`);
            return null;
        }

        // Filtrar por status se fornecido
        let filteredItems = items;
        if (status) {
            filteredItems = items.filter(item => item.status === status);
        }

        // Buscar METADATA de cada apresentação encontrada
        const presentations: Presentation[] = [];
        const presentationIds = new Set<string>();
        
        for (const item of filteredItems) {
            // Extrair presentationId do GSI2SK ou PK
            let presentationId: string | undefined;
            if (item.GSI2SK) {
                presentationId = item.GSI2SK.replace("APRESENTACAO#", "");
            } else if (item.PK) {
                presentationId = item.PK.replace("APRESENTACAO#", "");
            }
            
            if (presentationId && !presentationIds.has(presentationId)) {
                presentationIds.add(presentationId);
                const presentation = await this.getPresentationById(presentationId);
                if (presentation) {
                    presentations.push(presentation);
                }
            }
        }

        // Ordenar por date (ascendente)
        presentations.sort((a, b) => a.date - b.date);

        console.log(`[DynamoDB] Busca por ExaminatorId: ${examinatorId}${status ? ` com status ${status}` : ''} - ${presentations.length} apresentações encontradas`);
        return presentations.length > 0 ? presentations : null;
    }

    async deletePresentation(presentationId: string): Promise<Presentation | null> {
        const presentation = await this.getPresentationById(presentationId);

        if (!presentation) {
            return null;
        }

        const pk = getPresentationPK(presentationId);

        // Buscar todos os itens relacionados com esta apresentação
        const allItems = await this.db.queryAll(pk);

        // Preparar itens para batch delete (máximo 25 por vez)
        const deletePromises: Promise<void>[] = [];
        for (const item of allItems) {
            deletePromises.push(this.db.delete(pk, item.SK));
        }

        // Executar todas as deleções
        await Promise.all(deletePromises);

        console.log(`[DynamoDB] Apresentação deletada: ${pk}`);

        return presentation;
    }

    async updatePresentation(presentationId: string, updateOptions: PresentationUpdateOptions): Promise<Presentation | null> {
        const currentPresentation = await this.getPresentationById(presentationId);

        if (!currentPresentation) {
            return null;
        }

        const pk = getPresentationPK(presentationId);
        const sk = getPresentationSK();

        const updateDict: Partial<Presentation> = {};

        if (updateOptions.date) updateDict.date = updateOptions.date;
        if (updateOptions.groupId) {
            // Atualizar relacionamento GROUP
            // Deletar relacionamento antigo
            await this.db.delete(pk, `GROUP#${currentPresentation.groupId}`);
            
            // Criar novo relacionamento
            const groupRelationshipItem = {
                PK: pk,
                SK: `GROUP#${updateOptions.groupId}`,
                groupId: updateOptions.groupId
            };
            await this.db.put(groupRelationshipItem, pk, `GROUP#${updateOptions.groupId}`);
            
            updateDict.groupId = updateOptions.groupId;
        }
        if (updateOptions.examinationBoartId) {
            // Atualizar relacionamento BANCA
            // Deletar relacionamento antigo
            await this.db.delete(pk, `BANCA#${currentPresentation.examinationBoartId}`);
            
            // Criar novo relacionamento
            const bancaRelationshipItem = {
                PK: pk,
                SK: `BANCA#${updateOptions.examinationBoartId}`,
                examinationBoardId: updateOptions.examinationBoartId
            };
            await this.db.put(bancaRelationshipItem, pk, `BANCA#${updateOptions.examinationBoartId}`);
            
            updateDict.examinationBoartId = updateOptions.examinationBoartId;
        }
        if (updateOptions.sala) updateDict.sala = updateOptions.sala;
        if (updateOptions.status) {
            updateDict.status = updateOptions.status;
            
            // Atualizar status em todos os relacionamentos (GSI1 e GSI2)
            const allItems = await this.db.queryAll(pk);
            for (const item of allItems) {
                if (item.SK?.startsWith("ALUNO#") || item.SK?.startsWith("PROF#")) {
                    const updateRelDict: any = { status: updateOptions.status };
                    // Manter date atualizado também
                    if (item.date) {
                        updateRelDict.date = item.date;
                    }
                    await this.db.update(pk, item.SK, updateRelDict);
                }
            }
        }

        const updated = await this.db.update(pk, sk, updateDict);
        console.log(`[DynamoDB] Apresentação atualizada: ${pk}`);

        return Presentation.fromJson(updated);
    }
}