import { CreateAssist, GetAssistFilters } from "@final/shared";
export declare const assistService: {
    create: (data: CreateAssist) => Promise<AssistWithRelations>;
    get: (filters: GetAssistFilters) => Promise<any>;
    getMany: (filters: GetAssistFilters) => Promise<AssistWithRelations[]>;
};
//# sourceMappingURL=assist.service.d.ts.map