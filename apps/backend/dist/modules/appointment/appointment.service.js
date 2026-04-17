import prisma from "@final/db";
import { appointmentModel } from "./appointment.model.js";
/**********
|   UTILS  |
 **********/
import { diffTime } from "#backend/utils";
import { workerService } from "../worker/worker.service.js";
import { scheduleService } from "../schedule/schedule.service.js";
export const appointmentService = {
    /***********
    |   CREATE  |
     ***********/
    create: async (data) => {
        const blocks = await appointmentService.getBlocks({
            date: data.date,
            worker_id: data.worker_id
        });
        // console.log(blocks)
        let isOpen = false;
        for (const block of blocks) {
            if (block.start <= data.start && data.end <= block.end) {
                isOpen = true;
                break;
            }
        }
        if (isOpen)
            return await appointmentModel.create(data);
        return null;
    },
    /*********
    |   READ  |
     *********/
    getMany: async (filters) => {
        return await appointmentModel.getMany(filters);
    },
    /***********
    |   UPDATE  |
     ***********/
    updateStatus: async (appointment_id, status, tx) => {
        return await appointmentModel.updateStatus(appointment_id, status, tx);
    },
    updateStatusDirect: async (appointment_id, status) => {
        return await prisma.$transaction(async (tx) => {
            return await appointmentModel.updateStatus(appointment_id, status, tx);
        });
    },
    /****************
    |   PROGRAMMING  |
     ****************/
    getBlocks: async ({ date, worker_id }) => {
        const errorObj = { statusCode: 400, message: "BadRequest", name: "RequestError" };
        const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
        const day = days[new Date(date).getUTCDay()];
        /*************************************
        |   SERACH WORKER DAY  FROM SCHEDULE  |
         *************************************/
        const worker = await workerService.get(worker_id);
        if (!worker) {
            throw (errorObj); // have to be an error
        }
        const schedule = await scheduleService.getActive(worker_id);
        if (!schedule) {
            return [];
        }
        const daySchedule = schedule[day];
        console.log(daySchedule);
        /***************************
        |   DEFINE LIMITS OF BLOCK  |
         ***************************/
        const blocks = [];
        const DAY_START = daySchedule.start;
        const DAY_END = daySchedule.end;
        const createBlock = (arr, start, end) => arr.push({ start, end, duration: diffTime(start, end) });
        /************************
        |   SEARCH APPOINTMENTS  |
         ************************/
        const appoints = await appointmentModel.getMany({ date, worker_id });
        if (appoints.length === 0) {
            createBlock(blocks, DAY_START, DAY_END);
            const updateBlocks = appointmentService.applyRestrictions(blocks, daySchedule);
            return updateBlocks;
        }
        /******************
        |   CREATE BLOCKS  |
         ******************/
        // Bloque antes del primer appointment
        if (DAY_START < appoints[0].start)
            createBlock(blocks, DAY_START, appoints[0].start);
        // Bloques entre appointments
        for (let i = 0; i < appoints.length - 1; i++) {
            const endA = appoints[i].end;
            // si por alguna razon la appointment actual sale del horario, concluimos
            if (endA > DAY_END)
                return blocks;
            const startB = appoints[i + 1].start;
            if (endA < startB)
                createBlock(blocks, endA, startB);
        }
        // Bloque después del último appointment
        const lastEnd = appoints[appoints.length - 1].end;
        if (lastEnd < DAY_END)
            createBlock(blocks, lastEnd, DAY_END);
        /**********************
        |   APPLY RESTRICTION  |
         **********************/
        const updateBlocks = appointmentService.applyRestrictions(blocks, daySchedule);
        /****************
        |   RETURN DATA  |
         ****************/
        return updateBlocks;
    },
    applyRestrictions: (blocks, daySchedule) => {
        if (blocks.length === 0)
            return blocks;
        const createBlock = (arr, start, end) => arr.push({ start, end, duration: diffTime(start, end) });
        let updateBlocks = [...blocks];
        for (const restriction of daySchedule.breaks) {
            const current = [...updateBlocks]; // itera sobre estado actual
            for (const block of current) {
                if (block.start < restriction.start && block.end > restriction.end) {
                    // El bloque envuelve la restricción completa → partir en dos
                    updateBlocks = updateBlocks.filter(e => e !== block);
                    createBlock(updateBlocks, block.start, restriction.start);
                    createBlock(updateBlocks, restriction.end, block.end);
                }
                else if (block.start >= restriction.start && block.end <= restriction.end) {
                    // El bloque está completamente dentro → eliminar
                    updateBlocks = updateBlocks.filter(e => e !== block);
                }
                else if (block.start < restriction.start && block.end > restriction.start) {
                    // Solapa el inicio → recortar el final
                    updateBlocks = updateBlocks.filter(e => e !== block);
                    createBlock(updateBlocks, block.start, restriction.start);
                }
                else if (block.start < restriction.end && block.end > restriction.end) {
                    // Solapa el final → recortar el inicio
                    updateBlocks = updateBlocks.filter(e => e !== block);
                    createBlock(updateBlocks, restriction.end, block.end);
                }
            }
        }
        /****************
        |   RETURN DATA  |
         ****************/
        return updateBlocks;
    }
};
//# sourceMappingURL=appointment.service.js.map