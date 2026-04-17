/*********
|   DATA  |
 *********/
import { persons } from "./data/persons.js";
/************
|   SEEDERS  |
 ************/
import { seedPerson } from "./seeders/seedPersons.js";
export async function mainSeeder() {
    await seedPerson(persons);
}
//# sourceMappingURL=seeder.js.map