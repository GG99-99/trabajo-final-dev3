import  prisma  from '@final/db';
import type { Prisma } from "@final/db";


/*******************
|   CREATE METHODS  |
 *******************/
export type CreateAssist = {
    worker_id: number;
    attendance_id: number;
    start: string;
    close?: string;
    alert?: boolean;
    alert_text?: string;
    is_deleted?: boolean;
}

/*****************
|   READ METHODS  |
 *****************/
export type GetAssistFilters = {
    worker_id?: number;
    attendance_id?: number;
    alert?: boolean;
    is_deleted?: boolean;
}


/*****************
|   OBJECT TYPES  |
 *****************/
export type AssistWithRelations = Prisma.Result<
    typeof prisma.assist,
    {
        include: {
            worker: true;
            attendance: true;
        };
    },
    'findUnique'
>;