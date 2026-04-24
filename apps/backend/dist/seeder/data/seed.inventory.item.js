import prisma from "@final/db";
const items = [
    // product_variant_id 1
    {
        inventory_item_id: 1,
        product_variant_id: 1,
        batch_number: "BATCH-001",
        current_quantity: 100,
        expiry_date: new Date("2026-12-31"),
    },
    {
        inventory_item_id: 2,
        product_variant_id: 1,
        batch_number: "BATCH-002",
        current_quantity: 50,
        expiry_date: new Date("2026-06-30"),
    },
    // product_variant_id 2
    {
        inventory_item_id: 3,
        product_variant_id: 2,
        batch_number: "BATCH-003",
        current_quantity: 75,
        expiry_date: new Date("2027-01-15"),
    },
    {
        inventory_item_id: 4,
        product_variant_id: 2,
        batch_number: "BATCH-004",
        current_quantity: 30,
        expiry_date: null,
    },
    // product_variant_id 3
    {
        inventory_item_id: 5,
        product_variant_id: 3,
        batch_number: "BATCH-005",
        current_quantity: 200,
        expiry_date: new Date("2026-09-01"),
    },
    // product_variant_id 4
    {
        inventory_item_id: 6,
        product_variant_id: 4,
        batch_number: "BATCH-006",
        current_quantity: 60,
        expiry_date: new Date("2026-11-30"),
    },
    // product_variant_id 5
    {
        inventory_item_id: 7,
        product_variant_id: 5,
        batch_number: "BATCH-007",
        current_quantity: 45,
        expiry_date: null,
    },
    {
        inventory_item_id: 8,
        product_variant_id: 5,
        batch_number: "BATCH-008",
        current_quantity: 90,
        expiry_date: new Date("2027-03-20"),
    },
    // product_variant_id 6
    {
        inventory_item_id: 9,
        product_variant_id: 6,
        batch_number: "BATCH-009",
        current_quantity: 120,
        expiry_date: new Date("2026-08-15"),
    },
    // product_variant_id 7
    {
        inventory_item_id: 10,
        product_variant_id: 7,
        batch_number: "BATCH-010",
        current_quantity: 35,
        expiry_date: null,
    },
    // product_variant_id 8
    {
        inventory_item_id: 11,
        product_variant_id: 8,
        batch_number: "BATCH-011",
        current_quantity: 80,
        expiry_date: new Date("2026-10-10"),
    },
    {
        inventory_item_id: 12,
        product_variant_id: 8,
        batch_number: "BATCH-012",
        current_quantity: 25,
        expiry_date: new Date("2026-07-01"),
    },
    // product_variant_id 9
    {
        inventory_item_id: 13,
        product_variant_id: 9,
        batch_number: "BATCH-013",
        current_quantity: 150,
        expiry_date: new Date("2027-02-28"),
    },
    // product_variant_id 10
    {
        inventory_item_id: 14,
        product_variant_id: 10,
        batch_number: "BATCH-014",
        current_quantity: 40,
        expiry_date: null,
    },
    // product_variant_id 11
    {
        inventory_item_id: 15,
        product_variant_id: 11,
        batch_number: "BATCH-015",
        current_quantity: 55,
        expiry_date: new Date("2026-12-01"),
    },
    // product_variant_id 12
    {
        inventory_item_id: 16,
        product_variant_id: 12,
        batch_number: "BATCH-016",
        current_quantity: 70,
        expiry_date: new Date("2027-04-15"),
    },
    // product_variant_id 13
    {
        inventory_item_id: 17,
        product_variant_id: 13,
        batch_number: "BATCH-017",
        current_quantity: 110,
        expiry_date: null,
    },
    {
        inventory_item_id: 18,
        product_variant_id: 13,
        batch_number: "BATCH-018",
        current_quantity: 20,
        expiry_date: new Date("2026-05-31"),
    },
    // product_variant_id 14
    {
        inventory_item_id: 19,
        product_variant_id: 14,
        batch_number: "BATCH-019",
        current_quantity: 95,
        expiry_date: new Date("2027-01-01"),
    },
    // product_variant_id 15
    {
        inventory_item_id: 20,
        product_variant_id: 15,
        batch_number: "BATCH-020",
        current_quantity: 65,
        expiry_date: null,
    },
    // product_variant_id 16
    {
        inventory_item_id: 21,
        product_variant_id: 16,
        batch_number: "BATCH-021",
        current_quantity: 130,
        expiry_date: new Date("2026-11-11"),
    },
    // product_variant_id 17
    {
        inventory_item_id: 22,
        product_variant_id: 17,
        batch_number: "BATCH-022",
        current_quantity: 48,
        expiry_date: new Date("2027-05-20"),
    },
    // product_variant_id 18
    {
        inventory_item_id: 23,
        product_variant_id: 18,
        batch_number: "BATCH-023",
        current_quantity: 85,
        expiry_date: null,
    },
    // product_variant_id 19
    {
        inventory_item_id: 24,
        product_variant_id: 19,
        batch_number: "BATCH-024",
        current_quantity: 33,
        expiry_date: new Date("2026-09-30"),
    },
    // product_variant_id 20
    {
        inventory_item_id: 25,
        product_variant_id: 20,
        batch_number: "BATCH-025",
        current_quantity: 170,
        expiry_date: new Date("2027-06-01"),
    },
    // product_variant_id 21
    {
        inventory_item_id: 26,
        product_variant_id: 21,
        batch_number: "BATCH-026",
        current_quantity: 58,
        expiry_date: null,
    },
    // product_variant_id 22
    {
        inventory_item_id: 27,
        product_variant_id: 22,
        batch_number: "BATCH-027",
        current_quantity: 42,
        expiry_date: new Date("2026-08-20"),
    },
    // product_variant_id 23
    {
        inventory_item_id: 28,
        product_variant_id: 23,
        batch_number: "BATCH-028",
        current_quantity: 88,
        expiry_date: new Date("2027-03-10"),
    },
    // product_variant_id 24
    {
        inventory_item_id: 29,
        product_variant_id: 24,
        batch_number: "BATCH-029",
        current_quantity: 22,
        expiry_date: null,
    },
    // product_variant_id 25
    {
        inventory_item_id: 30,
        product_variant_id: 25,
        batch_number: "BATCH-030",
        current_quantity: 140,
        expiry_date: new Date("2027-07-31"),
    },
];
export async function seedInventoryItems() {
    for (const item of items) {
        const { inventory_item_id, ...data } = item;
        await prisma.inventoryItem.upsert({
            where: { inventory_item_id },
            update: data,
            create: { inventory_item_id, ...data },
        });
        // console.log(`  ✔ InventoryItem #${inventory_item_id} upserted (variant ${data.product_variant_id})`);
    }
    //   console.log(`✅ Done — ${items.length} inventory items seeded.`);
}
//# sourceMappingURL=seed.inventory.item.js.map