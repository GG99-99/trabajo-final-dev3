
export type SeedPerson = {
  first_name: string
  last_name: string
  email: string
  password: string
  type: "client" | "worker" | "cashier"
  specialty?: "realism" | "cartoon" | "other" // SOLO worker
  medical_notes?: string // SOLO client
}

export const persons: SeedPerson[] = [
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