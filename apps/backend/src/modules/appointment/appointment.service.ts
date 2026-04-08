
import { AppointmentStatus } from "@prisma/index.js";
import { ApiErr, AppointmentCreate, AppointmentBlockTime, ScheduleJsonDay } from "@final/shared";
import { AppointmentFilters } from "./appointment.interfaces.js";
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
    create: async (data: AppointmentCreate) => {

    },


    /*********
    |   READ  |
     *********/
    getMany: async (filters: AppointmentFilters) => {
        return await appointmentModel.getMany(filters)
    },


    /***********
    |   UPDATE  |
     ***********/
    updateStatus: async (appointment_id: number, status: AppointmentStatus) => {
        return await appointmentModel.updateStatus(appointment_id, status)
    },
    

    /****************
    |   PROGRAMMING  |
     ****************/

    
    getBlocks: async (date: Date, worker_id: number): Promise<AppointmentBlockTime[]> => {
        const errorObj: ApiErr = {statusCode: 400, message: "BadRequest", name: "RequestError"}

        /****************
        |   DAY OF WEEK  |
         ****************/
        const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
        const day = days[new Date(date).getDay()]

        /*************************************
        |   SERACH WORKER DAY  FROM SCHEDULE  |
         *************************************/
        const worker = await workerService.get(worker_id)
        if(!worker) {
            throw(errorObj) // have to be an error
        }

        const schedule = await scheduleService.getMany({worker_id: worker_id})
        if(!schedule.length) {
            throw(errorObj) // have to be an error
        }

        const daySchedule  = schedule[0]?.[day as keyof typeof schedule[0]] as ScheduleJsonDay

        /***************************
        |   DEFINE LIMITS OF BLOCK  |
         ***************************/
        const blocks: AppointmentBlockTime[] = [];
        const DAY_START = daySchedule.start;
        const DAY_END = daySchedule.end;

        const createBlock = (arr: any,start: string, end: string) =>
            arr.push({ start, end, duration: diffTime(end, start) });

        /************************
        |   SEARCH APPOINTMENTS  |
         ************************/
        const appoints = await appointmentModel.getMany({ date, worker_id });
        if (appoints.length === 0) {
            throw(errorObj)
        }


        /******************
        |   CREATE BLOCKS  |
         ******************/

        // Bloque antes del primer appointment
        if (DAY_START < appoints[0]!.start)
            createBlock(blocks, DAY_START, appoints[0]!.start);

        // Bloques entre appointments
        for (let i = 0; i < appoints.length - 1; i++) {
            const endA = appoints[i]!.end;

            // si por alguna razon la appointment actual sale del horario, concluimos
            if(endA > DAY_END) return blocks 

            const startB = appoints[i + 1]!.start;
            if (endA < startB) createBlock(blocks, endA, startB);
        }

        
        // Bloque después del último appointment
        const lastEnd = appoints[appoints.length - 1]!.end;
        if (lastEnd < DAY_END) createBlock(blocks, lastEnd, DAY_END);



        /**********************
        |   APPLY RESTRICTION  |
         **********************/
        if(blocks.length === 0) return blocks

        let updateBlocks = [...blocks];
        
        for (const restriction of daySchedule.breaks) {
            const current = [...updateBlocks]; // itera sobre estado actual
            
            for (const block of current) {
                if (block.start < restriction.start && block.end > restriction.end) {
                    // El bloque envuelve la restricción completa → partir en dos
                    updateBlocks = updateBlocks.filter(e => e !== block);
                    createBlock(updateBlocks, block.start, restriction.start);
                    createBlock(updateBlocks, restriction.end, block.end);

                } else if (block.start >= restriction.start && block.end <= restriction.end) {
                    // El bloque está completamente dentro → eliminar
                    updateBlocks = updateBlocks.filter(e => e !== block);

                } else if (block.start < restriction.start && block.end > restriction.start) {
                    // Solapa el inicio → recortar el final
                    updateBlocks = updateBlocks.filter(e => e !== block);
                    createBlock(updateBlocks, block.start, restriction.start);

                } else if (block.start < restriction.end && block.end > restriction.end) {
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
}