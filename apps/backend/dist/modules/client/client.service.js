import { clientModel } from "./client.model.js";
import { personService } from "../person/person.service.js";
import { clienUtils } from "./client.utils.js";
export const clientService = {
    get: async (client_id) => {
        return await clientModel.get(client_id);
    },
    getByEmail: async (email) => {
        const client = await clientModel.getByEmail(email);
        if (!client)
            return null;
        return clienUtils.clientToPublic(client);
    },
    getMany: async () => {
        /******************************
        |   BUSCAR TODOS LOS CLIENTES  |
         ******************************/
        const clients = await clientModel.getMany();
        const publicClients = [];
        /***************************************************
        |   QUITAR PASSWORD Y RETORNAR COMO UN SOLO OBJETO  |
         ***************************************************/
        if (clients.length === 0)
            return [];
        for (const c of clients)
            publicClients.push(clienUtils.clientToPublic(c));
        return publicClients;
    },
    create: async (data) => {
        data.password = "";
        /********************************************
        |   VALIDAR QUE NO EXISTA OTRO CON EL EMAIL  |
         ********************************************/
        const existing = await personService.get({ email: data.email, noPass: true });
        if (existing) {
            throw { statusCode: 409, name: "EmailExists", message: "Email already exists" };
        }
        return personService.create(data);
    }
};
//# sourceMappingURL=client.service.js.map