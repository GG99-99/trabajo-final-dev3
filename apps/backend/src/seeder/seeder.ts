/*********
|   DATA  |
 *********/
import { persons } from "./data/persons.js";

/************
|   SEEDERS  |
 ************/
import { PersonForCreates } from "./seeders/PersonForCreates.js";


export async function mainSeeder() {
    await PersonForCreates(persons)
}