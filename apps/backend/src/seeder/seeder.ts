/*********
|   DATA  |
 *********/
import { persons } from "./data/persons.js";

/************
|   SEEDERS  |
 ************/
import { seedPersons } from "./seeders/seedPersons.js";


export async function mainSeeder() {
    await seedPersons(persons)
}