export const workerUtils = {
    workerToPublic: (w) => {
        return {
            worker_id: w.worker_id,
            person_id: w.person_id,
            first_name: w.person.first_name,
            last_name: w.person.last_name,
            email: w.person.email,
            type: w.person.type,
            specialty: w.specialty
        };
    }
};
//# sourceMappingURL=worker.utils.js.map