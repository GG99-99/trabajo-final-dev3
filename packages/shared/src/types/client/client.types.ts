import type { CreatePerson } from "../person/person.type.js"
import type { Override } from "../index.types.js"
import type { Prisma } from "@final/db";
import prisma from "@final/db";

export type ClientCreate = {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    type: "client";
    medical_notes: string;
} 




export type ClientPublic = {
    client_id: number,
    person_id: number,
    medical_notes: string | null,
    first_name: string,
    last_name: string,
    email: string,
    type: string
}

export type ClientWithRelations = Prisma.Result<
    typeof prisma.client,
    {
        include: {
            person: true;
        };
    },
    'findUnique'
>;
            