import { Request, Response } from "express";
import { CreatePerson, GetPerson } from "@final/shared";
import { personService } from "./person.service.js";
import { parseBoolean, parseNumber, parseString } from "../common/controller.utils.js";

export const personController = {
  get: async (req: Request, res: Response) => {
    const filters: GetPerson = {
      person_id: parseNumber(req.query.person_id),
      email: parseString(req.query.email),
      noPass: parseBoolean(req.query.noPass),
    };
    const person = await personService.get(filters);
    return res.json({ ok: true, data: person, error: null });
  },

  getMany: async (req: Request, res: Response) => {
    const persons = await personService.getMany()
    return res.json({ ok: true, data: persons, error: null });
  },

  // create: async (req: Request, res: Response) => {
  //   const payload: CreatePerson = req.body;
  //   const person = await personService.create(payload);
  //   return res.json({ ok: true, data: person, error: null });
  // },
};
