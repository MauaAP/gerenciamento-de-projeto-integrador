import { Presentation } from "../../../shared/domain/entities/presentation";
import { IPresentationRepository, PresentationFilter, PresentationUpdateOptions } from "../../../shared/domain/interfaces/IPresentationRepository";

export class PresentationRepositoryMock implements IPresentationRepository {
    private presentations: Presentation[] = [
        new Presentation(
            "8c77b6b9-a249-4318-a982-b07972bd1fb9",
            1750854600000,
            "14e97d3c-d309-43d4-bfa0-7724e1e54fb2",
            "3896e005-bc5c-4839-a43b-463ae9c3583c"
        ),
        new Presentation(
            "1151f310-8623-4359-91cd-a2959e8918ce",
            1719239400000,
            "25f08e4d-e41a-4c5f-9c3b-8835e2f65c43",
            "d7e6218a-001b-4fd6-9d97-ddf985f6ab5b"
        ),
        new Presentation(
            "ea98b092-b34b-476b-a8aa-8c407bc3343e",
            1764507000000,
            "36g19f5e-f52b-4d6e-a4d4-9946f3g76d54",
            "a28ed23d-3660-4ed4-b384-b1c12920c8d4"
        ),
        new Presentation(
            "4bf04c45-818e-496d-a308-71ef827f175d",
            1719235800000,
            "d547bcc1-911f-4a7f-b8f6-455b7cbd2184",
            "d7e6218a-001b-4fd6-9d97-ddf985f6ab5b"
        ),
        new Presentation(
            "a259782e-f3bf-4cd5-b335-b178d8306cbe",
            1764509400000,
            "3ed81785-bf6c-4e83-9543-d4c7e8c9d27b",
            "3896e005-bc5c-4839-a43b-463ae9c3583c"
        ),
        new Presentation(
            "310b65d0-eec0-4712-83dc-b1fb5c29400c",
            1687266600000,
            "5b9d4100-13f5-4bd9-92b3-0a420bb3d3e3",
            "3896e005-bc5c-4839-a43b-463ae9c3583c"
        )
    ]

    async createPresentation(presentation: Presentation): Promise<Presentation> {
        this.presentations.push(presentation);
        return presentation;
    }

    async fetchPresentation(): Promise<Presentation[]> {
        return this.presentations
    }

    async getPresentationById(presentationId: string): Promise<Presentation | null> {
        return this.presentations.find((presentation) => presentation.presentationId === presentationId) || null
    }

    async getPresentationByFilter(filter: PresentationFilter): Promise<Presentation[] | null> {
        const result= this.presentations.filter((presentation) =>
            (!filter.date || presentation.date === filter.date) &&
            (!filter.groupId || presentation.groupId.includes(filter.groupId)) &&
            (!filter.examinationBoartId || presentation.examinationBoartId === filter.examinationBoartId)
        );
        return result.length > 0 ? result : null;
    }
    // Falar com o Luca aqui tinha pensado que seria legal caso a gente recebesse um array de date que pudesse possuir até duas timestamps e a gente pudesse fazer o filtro para presentation que estão nesse intervalo, caso viesse uma duplicava o timestamp

    async deletePresentation(presentationId: string): Promise<Presentation | null> {
        const index= this.presentations.findIndex((presentation) => presentation.presentationId === presentationId);

        if (index === -1) return null;

        return this.presentations.splice(index, 1)[0];
    }

    async updatePresentation(presentationId: string, updateOptions: PresentationUpdateOptions): Promise<Presentation | null> {
        const presentation= this.presentations.find((presentation) => presentation.presentationId === presentationId) || null;

        if(presentation === null){
            return null;
        }

        Object.assign(presentation, updateOptions);

        return presentation
    }
}