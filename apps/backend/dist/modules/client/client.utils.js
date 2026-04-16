export const clienUtils = {
    clientToPublic: (c) => {
        return {
            client_id: c.client_id,
            person_id: c.person_id,
            medical_notes: c.medical_notes,
            first_name: c.person.first_name,
            last_name: c.person.last_name,
            email: c.person.email,
            type: c.person.type
        };
    }
};
//# sourceMappingURL=client.utils.js.map