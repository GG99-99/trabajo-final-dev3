/*********
|   DATA  |
 *********/
import { seedCategories } from "./data/seed.categorys.js";
import { seedPerson } from "./data/seed.persons.js";
import { seedProducts } from "./data/seed.products.js";
import { seedProviders } from "./data/seed.providers.js";
import { seedSeats } from "./data/seed.seat.js";
import { seedSchedule } from "./data/seed.schedule.js";
import { seedTattoos } from "./data/seed.tattoo.js";
/************
|   SEEDERS  |
 ************/
export async function mainSeeder() {
    console.log('\n');
    await seedPerson();
    console.log("[ seeder ] persons");
    await seedProviders();
    console.log("[ seeder ] providers");
    await seedCategories();
    console.log("[ seeder ] categories");
    await seedProducts();
    console.log("[ seeder ] products");
    await seedSeats();
    console.log("[ seeder ] seats");
    await seedSchedule();
    console.log("[ seeder ] schedules");
    await seedTattoos();
    console.log("[ seeder ] tattoos");
    console.log('\n');
}
//# sourceMappingURL=seeder.js.map