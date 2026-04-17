
// usado en el seeder y el servicio de createPerson
export type CreatePerson = 
| {
  first_name: string
  last_name: string
  email: string
  password: string
  type: "client" 
  medical_notes: string // SOLO client
} | {
  first_name: string
  last_name: string
  email: string
  password: string
  type: "worker" | "cashier"
  token: string
  specialty?: "realism" | "cartoon" | "other" // SOLO worker
  medical_notes?: string // SOLO client
}

export type GetPerson = {
    person_id?: number;
    email?: string;
    noPass?: boolean;
}
