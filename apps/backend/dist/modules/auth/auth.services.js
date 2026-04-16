import 'dotenv/config';
import bcrypt from 'bcrypt';
// import { authModel } from "./auth.model.js"
import { personService } from '../person/person.service.js';
import jwt from 'jsonwebtoken';
export const authService = {
    login: async (userData) => {
        // buscar usuarios
        const user = await personService.get({ email: userData.email, noPass: false });
        if (!user)
            throw { statusCode: 401, name: 'InvalidCredentials', message: 'credenciales invalidas' };
        // validar clave
        const validPassword = await bcrypt.compare(userData.password, user.password);
        if (!validPassword)
            throw { statusCode: 401, name: 'InvalidCredentials', message: 'credenciales invalidas' };
        return {
            email: user.email,
            person_id: user.person_id,
            type: user.type
        };
    },
    register: async (personData) => {
        const newPerson = await personService.create(personData);
        return newPerson;
    },
    createToken: (data) => (jwt.sign(data, process.env.SECRET_JWT_KEY, { expiresIn: "1h" }))
};
//# sourceMappingURL=auth.services.js.map