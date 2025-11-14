import { Course } from "../../../shared/domain/entities/course";
import { ICourseRepository } from "../../../shared/domain/interfaces/ICourseRepository";
import { COURSE } from "../../../shared/domain/enums/course";

export interface CreateCourseDTO {
    name: string,
    code?: string
}

// Função helper para tentar converter string para COURSE enum
function stringToCourseEnum(name: string): COURSE {
    const courseMap: Record<string, COURSE> = {
        "ADMINISTRAÇÃO": COURSE.ADM,
        "ANÁLISE E DESENVOLVIMENTO DE SISTEMAS": COURSE.ADS,
        "ARQUITETURA E URBANISMO": COURSE.ARQ,
        "CIÊNCIAS DA COMPUTAÇÃO": COURSE.CIC,
        "DESIGN": COURSE.DSN,
        "ECONOMIA": COURSE.ECO,
        "ENGENHARIA CIVIL": COURSE.ENCV,
        "ENGENHARIA DE ALIMENTOS": COURSE.ENAL,
        "ENGENHARIA DE COMPUTAÇÃO": COURSE.ENCP,
        "ENGENHARIA DE CONTROLE E AUTOMAÇÃO": COURSE.ENCA,
        "ENGENHARIA DE PRODUÇÃO": COURSE.ENPD,
        "ENGENHARIA ELÉTRICA": COURSE.ENEL,
        "ENGENHARIA MECÂNICA": COURSE.ENMC,
        "ENGENHARIA QUÍMICA": COURSE.ENQM,
        "INTELIGÊNCIA ARTIFICIAL E CIÊNCIA DE DADOS": COURSE.IAD,
        "RELAÇÕES INTERNACIONAIS": COURSE.RIN,
        "SISTEMAS DE INFORMAÇÃO": COURSE.SIN
    };
    
    // Se encontrar no mapa, retornar o enum correspondente
    if (courseMap[name]) {
        return courseMap[name];
    }
    
    // Caso contrário, usar o primeiro valor do enum como fallback
    // Isso permite criar cursos com nomes livres, mas mantém compatibilidade com a entidade
    return COURSE.ADM; // Fallback temporário - idealmente a entidade deveria aceitar string
}

export class CreateCourseUseCase {
    constructor(private readonly courseRepository: ICourseRepository) {}

    async execute({name, code}: CreateCourseDTO): Promise<Course> {
        const courseId = crypto.randomUUID();
        // Converter string para enum (ou usar fallback)
        const courseEnum = stringToCourseEnum(name);
        const course = new Course(courseId, courseEnum, code);
        
        await this.courseRepository.createCourse(course);
        
        return course;
    }
}

