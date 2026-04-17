import { CreateAssist, GetAssistFilters, AssistWithRelations } from "@final/shared";
export declare const assistModel: {
    create: (data: CreateAssist) => Promise<AssistWithRelations>;
    get: (filters: GetAssistFilters) => Promise<AssistWithRelations | null>;
    getMany: (filters: GetAssistFilters) => Promise<AssistWithRelations[]>;
};
//# sourceMappingURL=assist.model.d.ts.map