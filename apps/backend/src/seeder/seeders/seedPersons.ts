import prisma from "#prisma"
import bcrypt from "bcrypt"
import { SeedPerson } from "../data/persons.js"
import { PersonType } from "@prisma/index.js"


const SALT_ROUNDS = 10

export async function seedPersons(data: SeedPerson[]) {
  for (const personData of data) {
    const { type, specialty, medical_notes, password, ...personInfo } = personData

    // Hash password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)

    await prisma.person.upsert({
        where: { email: personInfo.email },
        update: {},
        create: {
          ...personInfo,
          password: hashedPassword,
          type: type as PersonType,

          ...(type === "client" && {
            client: { create: { medical_notes: medical_notes ?? ""  } },
          }),

          ...(type === "worker" && {
            worker: { create: { specialty: specialty || "other" } },
          }),

          ...(type === "cashier" && {
            cashier: { create: {} },
          }),
        },
    })
  }
}