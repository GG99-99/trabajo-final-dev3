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
    updateStatus: async (appointment_id, status) => {
        return await appointmentModel.updateStatus(appointment_id, status);
    },
    /****************
    |   PROGRAMMING  |
     ****************/
    getBlocks: async (date, worker_id) => {
        const errorObj = { statusCode: 400, message: "BadRequest", name: "RequestError" };
        /****************
        |   DAY OF WEEK  |
         ****************/
        const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
        const day = days[new Date(date).getDay()];
        /*************************************
        |   SERACH WORKER DAY  FROM SCHEDULE  |
         *************************************/
        const worker = await workerService.get(worker_id);
        if (!worker) {
            throw (errorObj); // have to be an error
        }
        const schedule = await scheduleService.getActive(worker_id);
        if (!schedule) {
            throw (errorObj); // have to be an error
        }
        const daySchedule = schedule?.[day];
        /***************************
        |   DEFINE LIMITS OF BLOCK  |
         ***************************/
        const blocks = [];
        const DAY_START = daySchedule.start;
        const DAY_END = daySchedule.end;
        const createBlock = (arr, start, end) => arr.push({ start, end, duration: diffTime(end, start) });
        /************************
        |   SEARCH APPOINTMENTS  |
         ************************/
        const appoints = await appointmentModel.getMany({ date, worker_id });
        if (appoints.length === 0) {
            throw (errorObj);
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
        if (blocks.length === 0)
            return blocks;
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
    },
};
//# sourceMappingURL=appointment.service.js.map