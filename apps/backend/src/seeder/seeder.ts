/*********
|   DATA  |
 *********/
import { persons_seed } from "./data/persons.js";

/************
|   SEEDERS  |
 ************/
import { PersonForCreates } from "./seeders/seedPersons.js";


export async function mainSeeder() {
    await PersonForCreates(persons_seed)
    console.log("[ seeder ] personas creadas")
}