import { Router } from "express";
import { seatController } from "./seat.controller.js";
export const seatRouter = Router();
seatRouter
    /*********
    |   READ  |
    *********/
    .get("/", seatController.getMany)
    .get("/detail", seatController.get)
    /***********
    |   CREATE  |
     ***********/
    .post('/', seatController.create);
//# sourceMappingURL=seat.router.js.map