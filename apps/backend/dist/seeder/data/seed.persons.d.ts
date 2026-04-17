import { PersonType } from "@final/db";
type PersonSeed = {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    type: PersonType;
    medical_notes?: string;
    specialty?: string;
};
export declare const persons_seed: PersonSeed[];
export declare function seedPerson(): Promise<void>;
export {};
//# sourceMappingURL=seed.persons.d.ts.map