
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
      first_name: "Luis",
      last_name: "Martinez",
      email: "luis@test.com",
      password: "123456",
      type: "cashier",
    },
  ]