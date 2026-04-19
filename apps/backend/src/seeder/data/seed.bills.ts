import prisma from "@final/db"

export async function seedBills() {
    // Skip if bills already exist
    const existing = await prisma.bill.count()
    if (existing > 0) return

    // Get required relations
    const worker  = await prisma.worker.findFirst()
    const cashier = await prisma.cashier.findFirst()
    const client  = await prisma.client.findFirst()
    const tattoo  = await prisma.tattoo.findFirst()
    const inventoryItem = await prisma.inventoryItem.findFirst()

    if (!worker || !cashier || !client) {
        console.log("[ seeder ] bills: skipped — missing worker/cashier/client")
        return
    }

    await prisma.$transaction(async (tx) => {
        // ── Bill 1: paid ──────────────────────────────────────────────────
        const bill1 = await tx.bill.create({
            data: {
                worker_id:  worker.worker_id,
                cashier_id: cashier.cashier_id,
                client_id:  client.client_id,
                status:     "paid",
                create_at:  new Date(),
            }
        })

        // Link tattoo to bill1
        if (tattoo) {
            await tx.billTattoo.create({
                data: { bill_id: bill1.bill_id, tattoo_id: tattoo.tattoo_id }
            })
        }

        // Add a stock movement + bill detail if inventory exists
        if (inventoryItem) {
            const sm = await tx.stockMovement.create({
                data: {
                    inventory_item_id: inventoryItem.inventory_item_id,
                    type:     "exit",
                    quantity: 1,
                    reason:   `factura ${bill1.bill_id}`,
                }
            })
            await tx.billDetail.create({
                data: { bill_id: bill1.bill_id, stock_movement_id: sm.stock_movement_id }
            })
        }

        // Payment for bill1
        await tx.payment.create({
            data: {
                bill_id:         bill1.bill_id,
                cashier_id:      cashier.cashier_id,
                amount:          tattoo ? tattoo.cost : 100,
                method:          "cash",
                transaction_ref: `TXN-${bill1.bill_id}-001`,
            }
        })

        // ── Bill 2: pending (partial payment) ────────────────────────────
        const bill2 = await tx.bill.create({
            data: {
                worker_id:  worker.worker_id,
                cashier_id: cashier.cashier_id,
                client_id:  client.client_id,
                status:     "pending",
                create_at:  new Date(),
            }
        })

        if (tattoo) {
            await tx.billTattoo.create({
                data: { bill_id: bill2.bill_id, tattoo_id: tattoo.tattoo_id }
            })
        }

        // Partial payment
        await tx.payment.create({
            data: {
                bill_id:         bill2.bill_id,
                cashier_id:      cashier.cashier_id,
                amount:          50,
                method:          "credit_card",
                transaction_ref: `TXN-${bill2.bill_id}-001`,
            }
        })

        // Discount on bill2
        await tx.billDiscount.create({
            data: {
                bill_id: bill2.bill_id,
                amount:  10,
                reason:  "Loyalty discount",
            }
        })

        // ── Bill 3: cancelled ─────────────────────────────────────────────
        await tx.bill.create({
            data: {
                worker_id:  worker.worker_id,
                cashier_id: cashier.cashier_id,
                client_id:  client.client_id,
                status:     "cancelled",
                create_at:  new Date(),
            }
        })
    })
}
