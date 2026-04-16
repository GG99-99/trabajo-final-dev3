/*********
|   DATA  |
 *********/
import { persons } from "./data/persons.js";
/************
|   SEEDERS  |
 ************/
import { PersonForCreates } from "./seeders/seedPersons.js";
export async function mainSeeder() {
    await PersonForCreates(persons);
}
//# sourceMappingURL=seeder.js.map