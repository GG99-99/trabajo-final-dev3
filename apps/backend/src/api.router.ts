import { Router } from "express";
import { authRouter } from "./modules/auth/auth.router.js";
import { publicRouter } from "./modules/public/public.router.js";
import { appointmentRouter } from "./modules/appointment/appointment.router.js";
import { assistRouter } from "./modules/asists/assist.router.js";
import { attendanceRouter } from "./modules/attendance/attendance.router.js";
import { billRouter } from "./modules/bill/bill.router.js";
import { cashierRouter } from "./modules/cashier/cashier.router.js";
import { categoryRouter } from "./modules/category/category.router.js";
import { clientRouter } from "./modules/client/client.router.js";
import { imgRouter } from "./modules/img/img.router.js";
import { inventoryRouter } from "./modules/inventory/inventory.router.js";
import { noAssistRouter } from "./modules/noAssist/noAssist.router.js";
import { paymentRouter } from "./modules/payment/payment.router.js";
import { personRouter } from "./modules/person/person.router.js";
import { productRouter } from "./modules/product/product.router.js";
import { productVariantRouter } from "./modules/productVariant/productVariant.router.js";
import { providerRouter } from "./modules/provider/provider.router.js";
import { scheduleRouter } from "./modules/schedule/schedule.router.js";
import { seatRouter } from "./modules/seat/seat.router.js";
import { stockMovementRouter } from "./modules/stockMovement/stockMovement.router.js";
import { tattooRouter } from "./modules/tattoo/tattoo.router.js";
import { workerRouter } from "./modules/worker/worker.router.js";

export const router: Router = Router()

router.use("/auth", authRouter)
router.use("/public", publicRouter)
router.use("/appointments", appointmentRouter)
router.use("/assists", assistRouter)
router.use("/attendances", attendanceRouter)
router.use("/bills", billRouter)
router.use("/cashiers", cashierRouter)
router.use("/categories", categoryRouter)
router.use("/clients", clientRouter)
router.use("/imgs", imgRouter)
router.use("/inventory", inventoryRouter)
router.use("/no-assists", noAssistRouter)
router.use("/payments", paymentRouter)
router.use("/persons", personRouter)
router.use("/products", productRouter)
router.use("/product-variants", productVariantRouter)
router.use("/providers", providerRouter)
router.use("/schedules", scheduleRouter)
router.use("/seats", seatRouter)
router.use("/stock-movements", stockMovementRouter)
router.use("/tattoos", tattooRouter)
router.use("/workers", workerRouter)
