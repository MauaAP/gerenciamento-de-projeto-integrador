import { Classroom } from "../../../shared/domain/entities/classroom";
import { Course } from "../../../shared/domain/entities/course";
import { ExaminationBoard } from "../../../shared/domain/entities/examination_board";
import { Group } from "../../../shared/domain/entities/group";
import { Partner } from "../../../shared/domain/entities/partner";
import { Presentation } from "../../../shared/domain/entities/presentation";
import { Project } from "../../../shared/domain/entities/project";
import { toEnumCourse } from "../../../shared/domain/enums/course";
import { PRESENTATION_STATUS } from "../../../shared/domain/enums/presentation_status";
import { toEnum } from "../../../shared/domain/enums/sector";
import { IClassroomRepository } from "../../../shared/domain/interfaces/IClassroomRepository";
import { ICourseRepository } from "../../../shared/domain/interfaces/ICourseRepository";
import { IExaminationBoardRepository } from "../../../shared/domain/interfaces/IExaminationBoardRepository";
import { IGroupRepository } from "../../../shared/domain/interfaces/IGroupRepository";
import { IPartnerRepository } from "../../../shared/domain/interfaces/IPartnerRepository";
import { IPresentationRepository } from "../../../shared/domain/interfaces/IPresentationRepository";
import { IProjectRepository } from "../../../shared/domain/interfaces/IProjectRepository";
import { IUserRepository } from "../../../shared/domain/interfaces/IUserRepository";

interface PresentationXlsxInterface {
    RA: string,
    "Tu-Gp": string,
    Tema: string,
    Sala: string,
    Data: string,
    Hora: string,
    "Banca Profs": string,
}

export class UploadPresentationXlsxUseCase {
    constructor(
        private readonly presentationRepository: IPresentationRepository,
        private readonly groupRepository: IGroupRepository,
        private readonly examinationBoardRepository: IExaminationBoardRepository,
        private readonly userRepository: IUserRepository,
        private readonly projectRepository: IProjectRepository,
        private readonly partnerRepository: IPartnerRepository,
        private readonly classroomRepository: IClassroomRepository,
        private readonly courseRepository: ICourseRepository
    ) {}

    async execute(presentationData: PresentationXlsxInterface[]): Promise<void> {
        let currentGroupCode = "";
        let currentProjectName = "";
        let currentDate = "";
        let currentHour = "";
        let currentClassroom = "";
        let currentUserIdList = new Set<string>(); 
        let currentProfessorIdList = new Set<string>();

        for(const row of presentationData) {
            const rowGroupCode= row["Tu-Gp"];

            if (rowGroupCode !== currentGroupCode) {

                if (currentGroupCode !== "") {
                    await this.savePresentation(
                        currentGroupCode,
                        currentProjectName,
                        currentDate,
                        currentHour,
                        currentClassroom,
                        Array.from(currentUserIdList),
                        Array.from(currentProfessorIdList)
                    );
                }

                currentGroupCode = rowGroupCode;
                currentProjectName = row.Tema;
                currentDate = row.Data; 
                currentHour = row.Hora;
                currentClassroom = row.Sala;
                currentUserIdList.clear();
                currentProfessorIdList.clear();
            }

            // pega os alunos
            const ra = row.RA;
            const email = `${ra}@maua.br`;
            const user = await this.userRepository.getUserByEmail(email);

            if (user) {
                currentUserIdList.add(user.userId);
            } else {
                console.warn(`[Warning] Student RA ${ra} not found in DB. Skipping student.`);
            }

            // pega os professores
            const professorName = row["Banca Profs"];
            if (professorName) {
                const professor = await this.userRepository.getUserByProfessorName(professorName);

                if (professor) {
                    currentProfessorIdList.add(professor.userId);
                } 
                else {
                    console.log(`[Warning] Professor ${professorName} not found in DB.`);
                }
            }
        }
        if (currentGroupCode !== "") {
            await this.savePresentation(
                currentGroupCode,
                currentProjectName,
                currentDate,
                currentHour,
                currentClassroom,
                Array.from(currentUserIdList),
                Array.from(currentProfessorIdList)
            );
        }
    }
    
    private async savePresentation(
        codGroupName: string,
        fullProject: string,
        dateStr: string,
        hourStr: string,
        classroomName: string,
        userIdList: string[],
        professorIdList: string[]
    ) {
        const codSubj= "TTI201"; // esta padrao porque nao temos no excel (nao estou mudando la em baixo)
        const courseName= "CIENCIAS DA COMPUTAÇÃO"; // esta padrao porque nao temos no excel (nao estou mudando la em baixo)
        
        const formattedDate = dateStr.includes("/") ? dateStr.split("/").reverse().join("-") : dateStr;
        const formattedHour = hourStr.includes("h") ? hourStr.split("h").join(":") : hourStr;
        
        
        // criando parceiro
        const partner= await this.partnerRepository.getPartnerByname(fullProject.split(" - ")[0]);
        
        let partnerId: string= partner ? partner.partnerId : "";
        
        if (!partner) {
            const newPartner= await this.partnerRepository.createPartner(new Partner(
                crypto.randomUUID(),
                fullProject.split(" - ")[0], 
                toEnum("EDUCATION"))
            );
            
            partnerId= newPartner.partnerId;
        }
        
        // criando projeto
        const project= await this.projectRepository.getProjectByTitle(fullProject.split(" - ")[1]);
        
        let projectId: string= project ? project.projectId : "";
        
        if (!project) {
            const newProject= await this.projectRepository.createProject( new Project(
                crypto.randomUUID(),
                fullProject.split(" - ")[1],
                partnerId, undefined) //passei a extensionHours como undefined pois nao se tem na tabela
            );
            
            projectId= newProject.projectId;
        }
        
        // criando grupo
        const yearSem= parseInt(formattedDate.split("-")[0] + (parseInt(formattedDate.split("-")[1]) <=6 ? "01" : "02"));
        
        const course= await this.courseRepository.getCourseByName(courseName);
        
        let courseId: string= course ? course.courseId : "";
        
        if (!course) {
            const newCourse= await this.courseRepository.createCourse( new Course(
                crypto.randomUUID(),
                toEnumCourse(courseName))
            );

            courseId= newCourse.courseId;
        }

        const group= await this.groupRepository.createGroup(new Group(
            crypto.randomUUID(),
            codSubj,
            userIdList,
            yearSem,
            projectId,
            toEnumCourse(courseName),
            courseId
        ))
    
        // criando banca
        const examinationBoard= await this.examinationBoardRepository.getExaminationBoardByProfessorsId(professorIdList);
        
        let examinationBoardId: string= examinationBoard ? examinationBoard.examinationBoardId : "";
        
        if (!examinationBoard) {
            const newExaminationBoard= await this.examinationBoardRepository.createExaminationBoard( new ExaminationBoard(
                crypto.randomUUID(),
                professorIdList)
            );
            
            examinationBoardId= newExaminationBoard.examinationBoardId;
        }


        // criando apresentação
        const classroom= await this.classroomRepository.getClassroomByName(classroomName);
        
        let classroomId= classroom ? classroom.classroomId : "";
        
        if (!classroom) {
            const newClassroom= await this.classroomRepository.createClassroom( new Classroom(
                crypto.randomUUID(),
                classroomName,
                10) //passei a capacity como 10 pq nao tem na tabela e também nao é relevante
            );
            
            classroomId= newClassroom.classroomId;
        }
        
        const timestamp= new Date(`${formattedDate}T${formattedHour}:00`).getTime();
        
        await this.presentationRepository.createPresentation(
            new Presentation(
                crypto.randomUUID(),
                timestamp,
                group.groupId,
                examinationBoardId,
                classroomId,
                PRESENTATION_STATUS.SCHEDULED
            ),
            professorIdList,
            userIdList
        )
    }
}


//         const selectedGroup= row["Tu-Gp"];

//         if (analyzingCodGroupName !== selectedGroup) {
//             // eu fiz desse jeto pois se o grupo selecionado nao for mais o mesmo significa que o grupo anterior acabou e precisa salvar as informacoes no banco

//             // // criando parceiro
//             // const partner= await this.partnerRepository.getPartnerByname(analyzingProjectName.split(" - ")[0]);

//             // let partnerId: string= partner ? partner.partnerId : "";

//             // if (!partner) {
//             //     const newPartner= await this.partnerRepository.createPartner(new Partner(
//             //         crypto.randomUUID(),
//             //         analyzingProjectName.split(" - ")[0], 
//             //         toEnum("EDUCATION"))
//             //     );

//             //     partnerId= newPartner.partnerId;
//             // }

//             // criando projeto
//             const project= await this.projectRepository.getProjectByTitle(analyzingProjectName.split(" - ")[1]);

//             let projectId: string= project ? project.projectId : "";

//             if (!project) {
//                 const newProject= await this.projectRepository.createProject( new Project(
//                     crypto.randomUUID(),
//                     analyzingProjectName.split(" - ")[1],
//                     partnerId, undefined) //passei a extensionHours como undefined pois nao se tem na tabela
//                 );

//                 projectId= newProject.projectId;
//             }

//             // criando grupo
//             const yearSem= parseInt(analyzingDate.split("-")[0] + (parseInt(analyzingDate.split("-")[1]) <=6 ? "01" : "02"));

//             const course= await this.courseRepository.getCourseByName(analyzingCourse);

//             let courseId: string= course ? course.courseId : "";

//             if (!course) {
//                 const newCourse= await this.courseRepository.createCourse( new Course(
//                     crypto.randomUUID(),
//                     toEnumCourse(analyzingCourse)
//                 ),
//                 );

//                 courseId= newCourse.courseId;
//             }

//             const group= await this.groupRepository.createGroup(new Group(
//                 crypto.randomUUID(),
//                 analyzingCodSubject,
//                 analyzingUserIdList,
//                 yearSem,
//                 projectId,
//                 toEnumCourse(analyzingCourse),
//                 courseId
//             ))


//             // criando banca
//             const examinationBoard= await this.examinationBoardRepository.getExaminationBoardByProfessorsId(analyzingProfessorIdList);

//             let examinationBoardId: string= examinationBoard ? examinationBoard.examinationBoardId : "";

//             if (!examinationBoard) {
//                 const newExaminationBoard= await this.examinationBoardRepository.createExaminationBoard( new ExaminationBoard(
//                     crypto.randomUUID(),
//                     analyzingProfessorIdList)
//                 );

//                 examinationBoardId= newExaminationBoard.examinationBoardId;
//             }


//             // criando apresentação
//             const classroom= await this.classroomRepository.getClassroomByName(analyzingClassroom);

//             let classroomId= classroom ? classroom.classroomId : "";

//             if (!classroom) {
//                 const newClassroom= await this.classroomRepository.createClassroom( new Classroom(
//                     crypto.randomUUID(),
//                     analyzingClassroom,
//                     10) //passei a capacity como 10 pq nao tem na tabela e também nao é relevante
//                 );

//                 classroomId= newClassroom.classroomId;
//             }

//             const timestamp= new Date(`${analyzingDate}T${analyzingHour}:00`).getTime();

//             await this.presentationRepository.createPresentation(
//                 new Presentation(
//                     crypto.randomUUID(),
//                     timestamp,
//                     group.groupId,
//                     examinationBoardId,
//                     classroomId,
//                     PRESENTATION_STATUS.SCHEDULED
//                 ),
//                 analyzingProfessorIdList,
//                 analyzingUserIdList
//             )

//             analyzingCodGroupName= selectedGroup;
//             analyzingUserIdList= [];
//             analyzingUserIdList.push(existingUser.userId);
//             analyzingProjectName= row.Tema;
//             analyzingDate= row.Data.split("/").reverse().join("-");
//             analyzingHour= row.Hora.split("h").join(":");
//             analyzingClassroom= row.Sala;
//         }
//         else {
//             analyzingUserIdList.push(existingUser.userId);
            
//             if (professorId.length > 0)
//                 analyzingProfessorIdList.push(professorId);

//             index++;
//         }
//     }
// }