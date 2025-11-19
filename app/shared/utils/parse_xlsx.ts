import { ZodType } from "zod";
import * as XLSX from "xlsx";
import { BadRequestException } from "../helpers/exceptions";

export interface XlsxHeaderValidationError {
    missingColumns: string[];
    extraColumns: string[];
    message: string;
}

/**
 Valida apenas os cabeçalhos (colunas) de um arquivo Excel usando Zod schema
 Similar ao parseBody, mas para validação de estrutura de Excel
 @param buffer Buffer do arquivo Excel
 @param schema Schema Zod que define as colunas obrigatórias
 @param options Opções adicionais de parsing
 @returns Array com os dados do Excel (apenas colunas do schema)
 */
export function parseXlsx<T>(
    buffer: Buffer,
    schema: ZodType<T, any, any>,
    options: {
        sheetName?: string; // Nome da planilha (usa a primeira se não especificado)
        columnMapping?: Record<string, string>; // Mapeia nomes de colunas do Excel para campos do schema
        strictColumns?: boolean; // Se true, rejeita colunas extras não definidas no schema (padrão: false)
        validateAllSheets?: boolean; // Se true, valida todas as planilhas do Excel (padrão: false)
    } = {}
): T[] {
    const {
        sheetName,
        columnMapping = {},
        strictColumns = false,
        validateAllSheets = false,
    } = options;

    console.log("[parseXlsx] ========== INICIANDO ==========");
    console.log("[parseXlsx] Buffer size:", buffer.length, "bytes");

    // Lê o workbook do buffer
    const workbook = XLSX.read(buffer, { type: "buffer" });
    console.log("[parseXlsx] Workbook lido com sucesso");
    console.log("[parseXlsx] Planilhas disponíveis:", workbook.SheetNames);

    // Se validateAllSheets for true, processa todas as planilhas
    if (validateAllSheets) {
        console.log("[parseXlsx] Modo: validar TODAS as planilhas");
        const allData: (T & { _sheetName: string })[] = [];
        const sheetsWithErrors: string[] = [];

        for (const currentSheetName of workbook.SheetNames) {
            console.log(`[parseXlsx] Processando planilha: ${currentSheetName}`);

            try {
                const sheetData = validateAndParseSheet(
                    workbook.Sheets[currentSheetName],
                    currentSheetName,
                    schema,
                    columnMapping,
                    strictColumns
                );

                // Adiciona o nome da planilha a cada linha para referência
                const dataWithSheetName = sheetData.map(row => ({
                    ...row,
                    _sheetName: currentSheetName
                }));

                allData.push(...dataWithSheetName);
                console.log(`[parseXlsx] ✅ Planilha "${currentSheetName}" validada: ${sheetData.length} linhas`);
            } catch (error) {
                console.error(`[parseXlsx] ❌ Erro na planilha "${currentSheetName}"`);
                sheetsWithErrors.push(currentSheetName);
                throw new BadRequestException(
                    `Erro na planilha "${currentSheetName}": ${error instanceof Error ? error.message : 'Erro desconhecido'}`
                );
            }
        }

        console.log(`[parseXlsx] ✅ Total de linhas de todas as planilhas: ${allData.length}`);
        return allData;
    }

    // Modo single sheet (comportamento original)
    const sheet = workbook.Sheets[sheetName || workbook.SheetNames[0]];

    if (!sheet) {
        throw new BadRequestException(
            `Planilha "${sheetName || workbook.SheetNames[0]}" não encontrada`
        );
    }

    const sheetNameUsed = sheetName || workbook.SheetNames[0];
    console.log("[parseXlsx] Usando planilha:", sheetNameUsed);

    return validateAndParseSheet(sheet, sheetNameUsed, schema, columnMapping, strictColumns);
}

/**
 * Valida e parseia uma única planilha
 */
function validateAndParseSheet<T>(
    sheet: XLSX.WorkSheet,
    sheetName: string,
    schema: ZodType<T, any, any>,
    columnMapping: Record<string, string>,
    strictColumns: boolean
): T[] {
    // Converte para JSON
    const jsonData: any[] = XLSX.utils.sheet_to_json(sheet, {
        defval: null,
        raw: false, // Converte valores para string para melhor controle
    });

    if (jsonData.length === 0) {
        throw new BadRequestException(
            `Planilha "${sheetName}" vazia ou sem dados para processar`
        );
    }

    // Obtém os cabeçalhos do arquivo
    const fileHeaders = Object.keys(jsonData[0]);
    console.log(`[parseXlsx] Planilha "${sheetName}" - Cabeçalhos encontrados:`, fileHeaders);

    // Valida os cabeçalhos usando o schema
    // Cria um objeto mock com os headers para validar estrutura
    const headerObject: any = {};
    fileHeaders.forEach((header) => {
        const mappedHeader = columnMapping[header] || header;
        headerObject[mappedHeader] = "mock_value"; // Valor temporário para validação
    });

    // Usa safeParse para validar estrutura
    const result = schema.safeParse(headerObject);

    if (!result.success) {
        console.error(`[parseXlsx] ❌ Validação dos cabeçalhos falhou na planilha "${sheetName}"`);
        console.error("[parseXlsx] Erros do Zod:", JSON.stringify(result.error.errors, null, 2));

        // Extrai as colunas obrigatórias do erro
        const missingColumns = result.error.errors
            .filter((err) => err.code === "invalid_type" && err.received === "undefined")
            .map((err) => {
                const field = err.path.join(".");
                // Tenta encontrar o nome original da coluna no mapeamento
                return getOriginalColumnName(field, columnMapping);
            });

        // Se strictColumns estiver ativo, verifica colunas extras
        const extraColumns: string[] = [];
        if (strictColumns) {
            // Extrai campos do schema
            const schemaShape = (schema as any)._def?.shape?.() || (schema as any).shape || {};
            const requiredFields = Object.keys(schemaShape);
            fileHeaders.forEach((header) => {
                const mappedHeader = columnMapping[header] || header;
                if (!requiredFields.includes(mappedHeader)) {
                    extraColumns.push(header);
                }
            });
        }

        let errorMessage = "";
        if (missingColumns.length > 0) {
            errorMessage = `Colunas obrigatórias não encontradas: ${missingColumns.join(", ")}`;
        }
        if (extraColumns.length > 0) {
            if (errorMessage) errorMessage += ". ";
            errorMessage += `Colunas extras não permitidas: ${extraColumns.join(", ")}`;
        }

        console.error("[parseXlsx] Mensagem de erro:", errorMessage);

        const validationError: XlsxHeaderValidationError = {
            missingColumns,
            extraColumns,
            message: errorMessage,
        };

        throw new BadRequestException(errorMessage, validationError);
    }

    console.log(`[parseXlsx] ✅ Validação dos cabeçalhos OK na planilha "${sheetName}"`);
    console.log(`[parseXlsx] Total de linhas de dados: ${jsonData.length}`);

    // Extrai apenas os campos definidos no schema
    const schemaShape = (schema as any)._def?.shape?.() || (schema as any).shape || {};
    const requiredFields = Object.keys(schemaShape);
    console.log(`[parseXlsx] Campos obrigatórios do schema:`, requiredFields);

    // Aplica mapeamento de colunas e filtra apenas os campos do schema
    const mappedData = jsonData.map((row): T => {
        const mappedRow: any = {};

        // Primeiro, mapeia todas as colunas
        const fullMappedRow: any = {};
        Object.keys(row).forEach((key) => {
            const mappedKey = columnMapping[key] || key;
            fullMappedRow[mappedKey] = row[key];
        });

        // Depois, filtra apenas os campos que estão no schema
        requiredFields.forEach((field) => {
            if (field in fullMappedRow) {
                mappedRow[field] = fullMappedRow[field];
            }
        });

        return mappedRow as T;
    });

    console.log(`[parseXlsx] Exemplo de linha filtrada (primeira linha):`, mappedData[0]);
    return mappedData;
}

/**
 * Obtém o nome original da coluna (antes do mapeamento)
 */
function getOriginalColumnName(
    field: string,
    columnMapping: Record<string, string>
): string {
    // Procura pela chave original no mapeamento
    for (const [originalName, mappedName] of Object.entries(columnMapping)) {
        if (mappedName === field) {
            return originalName;
        }
    }
    return field;
}
