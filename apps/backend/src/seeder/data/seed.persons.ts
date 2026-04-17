import prisma from "@final/db"
import bcrypt from "bcrypt"
import { PersonType } from "@final/db"
import { CreatePerson } from "@final/shared"

export const persons_seed: CreatePerson[] = [
    {
      first_name: "Juan",
      last_name: "Perez",
      email: "juan@test.com",
      password: "123456",
      type: "client",
      medical_notes: "Piel sensible",
    },
    {
      first_name: "Ana",
      last_name: "Gomez",
      email: "ana@test.com",
      password: "123456",
      type: "worker",
      specialty: "realism",
    },
    {
      first_name: "Jeremy",
      last_name: "Garcia",
      email: "j@test.com",
      password: "123456",
      type: "worker",
      specialty: "realism",
    },
    {
      first_name: "Luis",
      last_name: "Martinez",
      email: "luis@test.com",
      password: "123456",
      type: "cashier",
    },
  ]




  const SALT_ROUNDS = 10
  
  export async function seedPerson() {
    for (const personData of persons_seed) {
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