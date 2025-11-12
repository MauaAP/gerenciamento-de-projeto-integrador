import { COURSE } from "../../../shared/domain/enums/course";
import { z } from "zod";

export const CreateCourseRequest = z.object({
    name: z.enum([
        "ADMINISTRAÇÃO",
        "ANÁLISE E DESENVOLVIMENTO DE SISTEMAS",
        "ARQUITETURA E URBANISMO",
        "CIÊNCIAS DA COMPUTAÇÃO",
        "DESIGN",
        "ECONOMIA",
        "ENGENHARIA CIVIL",
        "ENGENHARIA DE ALIMENTOS",
        "ENGENHARIA DE COMPUTAÇÃO",
        "ENGENHARIA DE CONTROLE E AUTOMAÇÃO",
        "ENGENHARIA DE PRODUÇÃO",
        "ENGENHARIA ELÉTRICA",
        "ENGENHARIA MECÂNICA",
        "ENGENHARIA QUÍMICA",
        "INTELIGÊNCIA ARTIFICIAL E CIÊNCIA DE DADOS",
        "RELAÇÕES INTERNACIONAIS",
        "SISTEMAS DE INFORMAÇÃO"
    ], { 
        errorMap: () => ({ message: "Course é obrigatório e deve ser um dos valores válidos" }) 
    }).transform((val) => {
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
        return courseMap[val];
    }),
    code: z.string().optional()
})

export type CreateCourseRequest = z.infer<typeof CreateCourseRequest>;

const CourseSchema = z.object({
    id: z.string(),
    name: z.string(),
    code: z.string().optional()
});

export const CreateCourseResponse = z.object({
    message: z.string(),
    course: CourseSchema
})

export type CreateCourseResponse = z.infer<typeof CreateCourseResponse>;

