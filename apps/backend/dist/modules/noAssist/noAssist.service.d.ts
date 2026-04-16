import { NoAssistCreateData, GetNoAssistFilters } from "@final/shared";
export declare const noAssistService: {
    create: (data: NoAssistCreateData) => Promise<NoAssistWithRelations>;
    get: (filters: GetNoAssistFilters) => Promise<any>;
    getMany: (filters: GetNoAssistFilters) => Promise<NoAssistWithRelations[]>;
};
//# sourceMappingURL=noAssist.service.d.ts.map