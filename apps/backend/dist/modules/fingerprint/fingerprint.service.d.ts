export declare const fingerprintService: {
    getByWorker: (worker_id: number) => Promise<{
        worker_id: number;
        created_at: Date;
        fingerprint_id: number;
        template: string;
        finger_index: number;
        updated_at: Date;
    } | null>;
    upsert: (worker_id: number, template: string, finger_index: number) => Promise<{
        worker_id: number;
        created_at: Date;
        fingerprint_id: number;
        template: string;
        finger_index: number;
        updated_at: Date;
    }>;
    delete: (worker_id: number) => Promise<{
        worker_id: number;
        created_at: Date;
        fingerprint_id: number;
        template: string;
        finger_index: number;
        updated_at: Date;
    }>;
    /** Verify a template against stored one — comparison done by .NET service */
    getAll: () => Promise<({
        worker: {
            person: {
                person_id: number;
                first_name: string;
                last_name: string;
                email: string;
                password: string | null;
                type: import("@final/db").$Enums.PersonType;
                tag: string | null;
                is_deleted: boolean;
            };
        } & {
            person_id: number;
            specialty: import("@final/db").$Enums.WorkerSpecialty;
            worker_id: number;
        };
    } & {
        worker_id: number;
        created_at: Date;
        fingerprint_id: number;
        template: string;
        finger_index: number;
        updated_at: Date;
    })[]>;
    /** Workers without fingerprint registered */
    getWorkersWithoutFingerprint: () => Promise<({
        person: {
            person_id: number;
            first_name: string;
            last_name: string;
            email: string;
            password: string | null;
            type: import("@final/db").$Enums.PersonType;
            tag: string | null;
            is_deleted: boolean;
        };
    } & {
        person_id: number;
        specialty: import("@final/db").$Enums.WorkerSpecialty;
        worker_id: number;
    })[]>;
};
//# sourceMappingURL=fingerprint.service.d.ts.map