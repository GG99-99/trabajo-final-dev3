import { NoAssistCreateData, GetNoAssistFilters, NoAssistWithRelations } from "@final/shared";
export declare const noAssistModel: {
    create: (data: NoAssistCreateData) => Promise<NoAssistWithRelations>;
    get: (filters: GetNoAssistFilters) => Promise<NoAssistWithRelations | null>;
    getMany: (filters: GetNoAssistFilters) => Promise<NoAssistWithRelations[]>;
};
//# sourceMappingURL=noAssist.model.d.ts.map