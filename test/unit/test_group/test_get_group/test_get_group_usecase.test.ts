import { GetGroupUseCase } from "app/modules/group/get_group/get_group_usecase";
import { COURSE } from "app/shared/domain/enums/course";
import { GroupRepoMock } from "app/shared/repositories/mocks/group_repository_mock";
import { PartnerRepoMock } from "app/shared/repositories/mocks/partner_repository_mock";
import { ProjectRepoMock } from "app/shared/repositories/mocks/project_repository_mock";
import { UserRepoMock } from "app/shared/repositories/mocks/user_repository_mock";
import e from "express";
import { describe, it, expect, beforeEach } from "vitest"

describe("GetGroupUsecase", () => {
    let groupRepo: GroupRepoMock;
    let userRepo: UserRepoMock;
    let projectRepo: ProjectRepoMock;
    let partnerRepo: PartnerRepoMock;
    let useCase: GetGroupUseCase;
    
    beforeEach(() => {
        groupRepo = new GroupRepoMock();
        userRepo = new UserRepoMock();
        projectRepo = new ProjectRepoMock();
        partnerRepo = new PartnerRepoMock();
        useCase = new GetGroupUseCase(groupRepo, userRepo, projectRepo, partnerRepo);
    });

    it("should get the group by id in repository mock and return it, with user names and project title", async () => {
        const result= await useCase.execute({ id: "14e97d3c-d309-43d4-bfa0-7724e1e54fb2" })

        expect(result[0].id).toBe("14e97d3c-d309-43d4-bfa0-7724e1e54fb2")
        expect(result[0].codSubj).toBe("TTI202")
        expect(result[0].yearSem).toBe(202501)
        expect(result[0].course).toBe("CIÊNCIAS DA COMPUTAÇÃO")
        expect(result[0].userNameList).toEqual(["Luke Skywalker", "Peter Parker", "Clark Kent", "Nuncio Perrela"])
        expect(result[0].project.title).toBe("Bot de investimentos com a Mastercard")
        expect(result[0].project.partnerName).toBe("Mastercard")
        expect(result[0].project.extensionHours).toBe(undefined)
    });

    it("should get the group by filter in repository mock and return it, with user names and project title", async () => {
        const result= await useCase.execute({ groupFilter: {
            userId: "f7c9d1e1-9d23-4f6e-94e1-8f45b50f2389",
            codSubj: "TTI202",
            yearSem: 202501,
            projectId: "4d2419c0-4955-4412-900f-e1d49b87f92b",
            courseId: "00000000-0000-0000-0000-000000000001"
        } })

        expect(result[0].id).toBe("14e97d3c-d309-43d4-bfa0-7724e1e54fb2")
        expect(result[0].codSubj).toBe("TTI202")
        expect(result[0].yearSem).toBe(202501)
        expect(result[0].course).toBe("CIÊNCIAS DA COMPUTAÇÃO")
        expect(result[0].userNameList).toEqual(["Luke Skywalker", "Peter Parker", "Clark Kent", "Nuncio Perrela"])
        expect(result[0].project.title).toBe("Bot de investimentos com a Mastercard")
        expect(result[0].project.partnerName).toBe("Mastercard")
        expect(result[0].project.extensionHours).toBe(undefined)
    });

    it("should get all the projects of a user by filter in repository mock and return them, with user names and project title", async () => {
        const result= await useCase.execute({ groupFilter: {
            userId: "f7c9d1e1-9d23-4f6e-94e1-8f45b50f2389"
        }})

        expect(result.length).toBe(3)

        expect(result[0].id).toBe("14e97d3c-d309-43d4-bfa0-7724e1e54fb2")
        expect(result[0].codSubj).toBe("TTI202")
        expect(result[0].yearSem).toBe(202501)
        expect(result[0].course).toBe("CIÊNCIAS DA COMPUTAÇÃO")
        expect(result[0].userNameList).toEqual(["Luke Skywalker", "Peter Parker", "Clark Kent", "Nuncio Perrela"])
        expect(result[0].project.title).toBe("Bot de investimentos com a Mastercard")
        expect(result[0].project.partnerName).toBe("Mastercard")
        expect(result[0].project.extensionHours).toBe(undefined)
        
        expect(result[1].id).toBe("25f08e4d-e41a-4c5f-9c3b-8835e2f65c43")
        expect(result[1].codSubj).toBe("TTI101")
        expect(result[1].yearSem).toBe(202401)
        expect(result[1].course).toBe("CIÊNCIAS DA COMPUTAÇÃO")
        expect(result[1].userNameList).toEqual(["Luke Skywalker", "Peter Parker", "Clark Kent", "Nuncio Perrela"])
        expect(result[1].project.title).toBe("Show do milhão poliedro")
        expect(result[1].project.partnerName).toBe("Poliedro")
        expect(result[1].project.extensionHours).toBe(216000)
        
        expect(result[2].id).toBe("5b9d4100-13f5-4bd9-92b3-0a420bb3d3e3")
        expect(result[2].codSubj).toBe("ENG101")
        expect(result[2].yearSem).toBe(202301)
        expect(result[2].course).toBe("ENGENHARIA DE PRODUÇÃO")
        expect(result[2].userNameList).toEqual(["Luke Skywalker", "Hal Jordan"])
        expect(result[2].project.title).toBe("Fazendo circuitos com a GM")
        expect(result[2].project.partnerName).toBe("General Motors")
        expect(result[2].project.extensionHours).toBeUndefined()
    });

    it("should get the projects of a user by the couse filter in repository mock and return them, with user names and project title", async () => {
        const result= await useCase.execute({ groupFilter: {
            userId: "f7c9d1e1-9d23-4f6e-94e1-8f45b50f2389",
            courseId: "00000000-0000-0000-0000-000000000001"
        }})

        expect(result.length).toBe(2)

        expect(result[0].id).toBe("14e97d3c-d309-43d4-bfa0-7724e1e54fb2")
        expect(result[0].codSubj).toBe("TTI202")
        expect(result[0].yearSem).toBe(202501)
        expect(result[0].course).toBe("CIÊNCIAS DA COMPUTAÇÃO")
        expect(result[0].userNameList).toEqual(["Luke Skywalker", "Peter Parker", "Clark Kent", "Nuncio Perrela"])
        expect(result[0].project.title).toBe("Bot de investimentos com a Mastercard")
        expect(result[0].project.partnerName).toBe("Mastercard")
        expect(result[0].project.extensionHours).toBe(undefined)
        
        expect(result[1].id).toBe("25f08e4d-e41a-4c5f-9c3b-8835e2f65c43")
        expect(result[1].codSubj).toBe("TTI101")
        expect(result[1].yearSem).toBe(202401)
        expect(result[1].course).toBe("CIÊNCIAS DA COMPUTAÇÃO")
        expect(result[1].userNameList).toEqual(["Luke Skywalker", "Peter Parker", "Clark Kent", "Nuncio Perrela"])
        expect(result[1].project.title).toBe("Show do milhão poliedro")
        expect(result[1].project.partnerName).toBe("Poliedro")
        expect(result[1].project.extensionHours).toBe(216000)
    });

    it("should throw (Nenhum grupo encontrado) if id doesn't exist", async () => {
        try {
            await useCase.execute({ id: "14e97d3c-d309-43d4-bfa0-7724e1e54fb" })
        }
        catch (error: any) {
            expect(error.constructor.name).toBe("NotFoundException");
            expect(error.message).toBe("Nenhum grupo encontrado")
            expect(error.statusCode).toBe(404)
        }
    });

    it("should throw (Nenhum grupo encontrado) if filter doesn't match any group", async () => {
        try {
            await useCase.execute({ groupFilter: {
                userId: "f7c9d1e1-9d23-4f6e-94e1-8f45b50f2389",
                codSubj: "TTI202",
                yearSem: 202501,
                projectId: "4d2419c0-4955-4412-900f-e1d49b87f92b",
                courseId: "00000000-0000-0000-0000-000000000002" //that's the problem
            }})
        }
        catch (error: any) {
            expect(error.constructor.name).toBe("NotFoundException");
            expect(error.message).toBe("Nenhum grupo encontrado")
            expect(error.statusCode).toBe(404)
        }
    });

    it("should throw (Nenhum grupo encontrado) if the userId in filter doesn't exists", async () => {
        try {
            await useCase.execute({ groupFilter: {
                userId: "e84aca18-0455-4f44-8e99-06c55bc482de", // this userId is not in the mock
                codSubj: "TTI202",
                yearSem: 202501,
                projectId: "4d2419c0-4955-4412-900f-e1d49b87f92b",
                courseId: "00000000-0000-0000-0000-000000000001"
            }})
        }
        catch (error: any) {
            expect(error.constructor.name).toBe("NotFoundException");
            expect(error.message).toBe("Nenhum grupo encontrado")
            expect(error.statusCode).toBe(404)
        }
    });
});