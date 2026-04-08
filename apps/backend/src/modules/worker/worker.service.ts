import { workerModel } from "./worker.model.js"
import { workerUtils } from "./worker.utils.js"
import { ApiErr, WorkerWithPerson, WorkerPublic } from "@final/shared"
import { log } from "#looger"

export const workerService = {
    get: async (worker_id: number) => {
        const w: WorkerWithPerson = await workerModel.get(worker_id)
        if(!w) {
            log.error("Se busco un worker que no existe")
            throw({statusCode: 400, name: "NotWorkerFound", message: "no se encontro el trabajador"} as ApiErr)
        } 

        return w
    },
    
    getAll: async (): Promise<WorkerPublic[]> => {
        const ws: WorkerWithPerson[] = await workerModel.getAll()
        if(ws.length === 0 ) return []

        const workersPublics: WorkerPublic[] = []

        for(const w of ws){
            workersPublics.push(workerUtils.workerToPublic(w))
        }

        return workersPublics


    }
}