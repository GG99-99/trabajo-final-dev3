# API Endpoints

Base URL: `/api`

All responses use a JSON envelope of the form:

```json
{
  "ok": true,
  "data": ...,
  "error": null
}
```

For `POST` endpoints, request payloads are sent in the body as JSON.
For `GET` endpoints, filters are sent as query parameters.

---

## Auth

### POST /api/login
- Request body: `LoginData`
  - `email`: string
  - `password`: string
- Response data: `UserCredentials`
  - `email`: string
  - `person_id`: number
  - `type`: `client` | `worker` | `cashier`

### POST /api/register
- Request body: `CreatePerson`
  - `first_name`: string
  - `last_name`: string
  - `email`: string
  - `password`: string
  - `type`: `client` | `worker` | `cashier`
  - `specialty`?: `realism` | `cartoon` | `other`
  - `medical_notes`?: string
- Response data: `boolean`

---

## Appointments

### GET /api/appointments
- Request type: `GetAppointmentFilters`
  - `appointment_id`?: number
  - `worker_id`?: number
  - `client_id`?: number
  - `tattoo_id`?: number
  - `start`?: string
  - `end`?: string
  - `date`?: Date
  - `status`?: `pending` | `completed` | `expired` | `cancelled`
- Response data: `Appointment[]`
  - `appointment_id`: number
  - `worker_id`: number
  - `client_id`: number
  - `tattoo_id`: number
  - `start`: string
  - `end`: string
  - `date`: Date
  - `create_at`: Date
  - `is_deleted`: boolean
  - `status`: `pending` | `completed` | `expired` | `cancelled`

### GET /api/appointments/blocks
- Request type: `GetBlocks`
  - `worker_id`: number
  - `date`: Date
- Response data: `AppointmentBlockTime[]`
  - `start`: string
  - `end`: string
  - `duration`: string

### POST /api/appointments
- Request body: `CreateAppointment`
  - `worker_id`: number
  - `client_id`: number
  - `tattoo_id`: number
  - `start`: string
  - `end`: string
  - `date`: Date
- Response data: `Appointment`
  - `appointment_id`: number
  - `worker_id`: number
  - `client_id`: number
  - `tattoo_id`: number
  - `start`: string
  - `end`: string
  - `date`: Date
  - `create_at`: Date
  - `is_deleted`: boolean
  - `status`: `pending` | `completed` | `expired` | `cancelled`

### PUT /api/appointments/status
- Request body or query:
  - `appointment_id`: number
  - `status`: string
- Response data: update result (`any`)

---

## Assists

### GET /api/assists
- Request type: `GetAssistFilters`
  - `worker_id`?: number
  - `attendance_id`?: number
  - `alert`?: boolean
  - `is_deleted`?: boolean
- Response data: `AssistWithRelations[]`
  - `worker_id`: number
  - `attendance_id`: number
  - `start`: string
  - `close`: string | null
  - `alert`: boolean
  - `alert_text`: string | null
  - `is_deleted`: boolean
  - `worker`: `Worker`
  - `attendance`: `Attendance`

### GET /api/assists/detail
- Request type: `GetAssistFilters`
  - `worker_id`?: number
  - `attendance_id`?: number
  - `alert`?: boolean
  - `is_deleted`?: boolean
- Response data: `AssistWithRelations`
  - `worker_id`: number
  - `attendance_id`: number
  - `start`: string
  - `close`: string | null
  - `alert`: boolean
  - `alert_text`: string | null
  - `is_deleted`: boolean
  - `worker`: `Worker`
  - `attendance`: `Attendance`

### POST /api/assists
- Request body: `CreateAssist`
  - `worker_id`: number
  - `attendance_id`: number
  - `start`: string
  - `close`?: string
  - `alert`?: boolean
  - `alert_text`?: string
  - `is_deleted`?: boolean
- Response data: `AssistWithRelations`
  - `worker_id`: number
  - `attendance_id`: number
  - `start`: string
  - `close`: string | null
  - `alert`: boolean
  - `alert_text`: string | null
  - `is_deleted`: boolean
  - `worker`: `Worker`
  - `attendance`: `Attendance`

---

## Attendances

### GET /api/attendances
- Request type: `GetAttendanceFilters`
  - `attendance_id`?: number
  - `work_date`?: Date
  - `status`?: boolean
  - `day`?: string
  - `is_deleted`?: boolean
- Response data: `AttendanceWithRelations[]`
  - `attendance_id`: number
  - `status`: boolean
  - `day`: string
  - `work_date`: Date
  - `is_deleted`: boolean
  - `assists`: `Assist[]`
  - `noAssists`: `NoAssist[]`

### GET /api/attendances/detail
- Request type: `GetAttendanceFilters`
  - `attendance_id`?: number
  - `work_date`?: Date
  - `status`?: boolean
  - `day`?: string
  - `is_deleted`?: boolean
- Response data: `AttendanceWithRelations`
  - `attendance_id`: number
  - `status`: boolean
  - `day`: string
  - `work_date`: Date
  - `is_deleted`: boolean
  - `assists`: `Assist[]`
  - `noAssists`: `NoAssist[]`

### POST /api/attendances
- Request body: `CreateAttendance`
  - `day`: string
  - `work_date`: Date
  - `status`?: boolean
- Response data: `AttendanceWithRelations`
  - `attendance_id`: number
  - `status`: boolean
  - `day`: string
  - `work_date`: Date
  - `is_deleted`: boolean
  - `assists`: `Assist[]`
  - `noAssists`: `NoAssist[]`

---

## Bills

### GET /api/bills
- Request type: `GetManyBill`
  - `date`?: Date
  - `status`?: `BillStatus`
  - `client_id`?: number
  - `cashier_id`?: number
  - `relations`?: boolean
- Response data: `BillWithRelations[]`
  - `bill_id`: number
  - `client_id`: number
  - `worker_id`: number
  - `cashier_id`: number
  - `create_at`: Date
  - `status`: `pending` | `paid` | `cancelled`
  - `details`: `BillDetail[]`
  - `tattoos`: `BillTattoo[]`
  - `payments`: `Payment[]`
  - `aggregates`: `BillAggregate[]`
  - `discounts`: `BillDiscount[]`

### GET /api/bills/detail
- Request type: `GetBill`
  - `bill_id`: number
  - `relations`?: boolean
- Response data: `BillWithRelations`
  - `bill_id`: number
  - `client_id`: number
  - `worker_id`: number
  - `cashier_id`: number
  - `create_at`: Date
  - `status`: `pending` | `paid` | `cancelled`
  - `details`: `BillDetail[]`
  - `tattoos`: `BillTattoo[]`
  - `payments`: `Payment[]`
  - `aggregates`: `BillAggregate[]`
  - `discounts`: `BillDiscount[]`

### GET /api/bills/total
- Query parameters:
  - `bill_id`: number
- Response data: `number`

### GET /api/bills/stock-movements
- Query parameters:
  - `bill_id`: number
- Response data: `BillProductItem[]`
  - `product_name`: string
  - `presentation`: string
  - `price`: number
  - `stock_movement_quantity`: number
  - `inventory_item_id`: number

### GET /api/bills/tattoos
- Query parameters:
  - `bill_id`: number
- Response data: `BillTattooItem[]`
  - `tattoo_id`: number
  - `price`: number

### POST /api/bills
- Request body: `CreateFullBill`
  - `client_id`: number
  - `worker_id`: number
  - `cashier_id`: number
  - `create_at`: Date
  - `tatto_ids`: number[]
  - `items`:
    - `product_variant_id`: number
    - `quantity`: number
  - `extra`:
    - `aggregates`:
      - `amount`: number
      - `reason`: string
    - `discounts`:
      - `amount`: number
      - `reason`: string
- Response data: `BillWithRelations`
  - `bill_id`: number
  - `client_id`: number
  - `worker_id`: number
  - `cashier_id`: number
  - `create_at`: Date
  - `status`: `pending` | `paid` | `cancelled`
  - `details`: `BillDetail[]`
  - `tattoos`: `BillTattoo[]`
  - `payments`: `Payment[]`
  - `aggregates`: `BillAggregate[]`
  - `discounts`: `BillDiscount[]`

---

## Cashiers

### GET /api/cashiers
- Request type: none
- Response data: `CashierWithPerson[]`
  - `cashier_id`: number
  - `person_id`: number
  - `person`:
    - `person_id`: number
    - `first_name`: string
    - `last_name`: string
    - `email`: string
    - `password`: string | null
    - `type`: string

### GET /api/cashiers/detail
- Request type: none
- Query parameters:
  - `cashier_id`: number
- Response data: `CashierWithPerson`
  - `cashier_id`: number
  - `person_id`: number
  - `person`:
    - `person_id`: number
    - `first_name`: string
    - `last_name`: string
    - `email`: string
    - `password`: string | null
    - `type`: string

### POST /api/cashiers
- Request body: `CashierCreate`
  - `first_name`: string
  - `last_name`: string
  - `email`: string
  - `password`: string
  - `type`: `cashier`
  - `specialty`?: `realism` | `cartoon` | `other`
  - `medical_notes`?: string
- Response data: `CashierWithPerson`
  - `cashier_id`: number
  - `person_id`: number
  - `person`:
    - `person_id`: number
    - `first_name`: string
    - `last_name`: string
    - `email`: string
    - `password`: string | null
    - `type`: string

---

## Clients

### GET /api/clients
- Request type: none
- Response data: `ClientWithRelations[]`
  - `client_id`: number
  - `person_id`: number
  - `medical_notes`: string | null
  - `person`:
    - `person_id`: number
    - `first_name`: string
    - `last_name`: string
    - `email`: string
    - `password`: string | null
    - `type`: string

### GET /api/clients/detail
- Request type: none
- Query parameters:
  - `client_id`: number
- Response data: `ClientWithRelations`
  - `client_id`: number
  - `person_id`: number
  - `medical_notes`: string | null
  - `person`:
    - `person_id`: number
    - `first_name`: string
    - `last_name`: string
    - `email`: string
    - `password`: string | null
    - `type`: string

### POST /api/clients
- Request body: `ClientCreate`
  - `first_name`: string
  - `last_name`: string
  - `email`: string
  - `password`: string
  - `type`: `client`
  - `specialty`?: `realism` | `cartoon` | `other`
  - `medical_notes`?: string
- Response data: `ClientWithRelations`
  - `client_id`: number
  - `person_id`: number
  - `medical_notes`: string | null
  - `person`:
    - `person_id`: number
    - `first_name`: string
    - `last_name`: string
    - `email`: string
    - `password`: string | null
    - `type`: string

---

## Images

### GET /api/imgs
- Request type: `GetManyImg`
  - `date`?: Date
  - `active`?: boolean
- Response data: `ImgWithRelations[]`
  - `img_id`: number
  - `source`: Uint8Array | Buffer
  - `description`: string | null
  - `create_at`: Date
  - `active`: boolean
  - `tattoos`: `Tattoo[]`

### GET /api/imgs/detail
- Request type: `GetImg`
  - `img_id`: number
  - `description`?: string
- Response data: `ImgWithRelations`
  - `img_id`: number
  - `source`: Uint8Array | Buffer
  - `description`: string | null
  - `create_at`: Date
  - `active`: boolean
  - `tattoos`: `Tattoo[]`

### POST /api/imgs
- Request body: `CreateImg`
  - `source`: Uint8Array | Buffer
  - `description`?: string
- Response data: `ImgWithRelations`
  - `img_id`: number
  - `source`: Uint8Array | Buffer
  - `description`: string | null
  - `create_at`: Date
  - `active`: boolean
  - `tattoos`: `Tattoo[]`

---

## Inventory

### GET /api/inventory
- Request type: `GetInventoryFilters`
  - `inventory_item_id`: number
  - `gte`?: number
- Response data: `InventoryItem`
  - `inventory_item_id`: number
  - `product_variant_id`: number
  - `batch_number`: string
  - `current_quantity`: number
  - `expiry_date`: Date | null

### GET /api/inventory/total-quantity
- Request type: `GetQuantityInventoryFilters`
  - `product_variant_id`: number
- Response data: `number`

### GET /api/inventory/not-expired
- Request type: `GetNotExpired`
  - `product_variant_id`: number
  - `gte`?: number
- Response data: `InventoryItem[]`
  - `inventory_item_id`: number
  - `product_variant_id`: number
  - `batch_number`: string
  - `current_quantity`: number
  - `expiry_date`: Date | null

### GET /api/inventory/not-expired-list
- Request type: `GetNotExpired`
  - `product_variant_id`: number
  - `gte`?: number
- Response data: `InventoryItem[]`
  - `inventory_item_id`: number
  - `product_variant_id`: number
  - `batch_number`: string
  - `current_quantity`: number
  - `expiry_date`: Date | null

### POST /api/inventory
- Request body: `CreateInventoryItem`
  - `product_variant_id`: number
  - `batch_number`: string
  - `current_quantity`: number
  - `expiry_date`?: Date
- Response data: `InventoryItem`
  - `inventory_item_id`: number
  - `product_variant_id`: number
  - `batch_number`: string
  - `current_quantity`: number
  - `expiry_date`: Date | null

---

## No-Assists

### GET /api/no-assists
- Request type: `GetNoAssistFilters`
  - `no_assist_id`?: number
  - `attendance_id`?: number
  - `worker_id`?: number
  - `is_deleted`?: boolean
- Response data: `NoAssistWithRelations[]`
  - `no_assist_id`: number
  - `attendance_id`: number
  - `worker_id`: number
  - `create_at`: Date
  - `is_deleted`: boolean
  - `attendance`: `Attendance`
  - `worker`: `Worker`

### GET /api/no-assists/detail
- Request type: `GetNoAssistFilters`
  - `no_assist_id`?: number
  - `attendance_id`?: number
  - `worker_id`?: number
  - `is_deleted`?: boolean
- Response data: `NoAssistWithRelations`
  - `no_assist_id`: number
  - `attendance_id`: number
  - `worker_id`: number
  - `create_at`: Date
  - `is_deleted`: boolean
  - `attendance`: `Attendance`
  - `worker`: `Worker`

### POST /api/no-assists
- Request body: `NoAssistCreateData`
  - `attendance_id`: number
  - `worker_id`: number
  - `create_at`?: Date
  - `is_deleted`?: boolean
- Response data: `NoAssistWithRelations`
  - `no_assist_id`: number
  - `attendance_id`: number
  - `worker_id`: number
  - `create_at`: Date
  - `is_deleted`: boolean
  - `attendance`: `Attendance`
  - `worker`: `Worker`

---

## Payments

### GET /api/payments
- Request type: `GetManyPayment`
  - `bill_id`?: number
  - `date`?: Date
  - `relations`?: boolean
- Response data: `Payment[]`
  - `payment_id`: number
  - `bill_id`: number
  - `create_at`: Date
  - `amount`: number
  - `method`: `cash` | `credit_card` | `transfer`
  - `transaction_ref`: string

### GET /api/payments/detail
- Request type: `GetPayment`
  - `payment_id`: number
  - `bill_id`?: number
  - `date`?: Date
  - `relations`?: boolean
- Response data: `Payment`
  - `payment_id`: number
  - `bill_id`: number
  - `create_at`: Date
  - `amount`: number
  - `method`: `cash` | `credit_card` | `transfer`
  - `transaction_ref`: string

### GET /api/payments/by-month
- Request type: `GetManyPaymentByMonth`
  - `year`: number
  - `month`: number
- Response data: `Payment[]`
  - `payment_id`: number
  - `bill_id`: number
  - `create_at`: Date
  - `amount`: number
  - `method`: `cash` | `credit_card` | `transfer`
  - `transaction_ref`: string

### POST /api/payments
- Request body: `CreatePayment`
  - `bill_id`: number
  - `amount`: number | string
  - `method`: `cash` | `credit_card` | `transfer`
  - `transaction_ref`: string
- Response data: `PaymentWithRelations`
  - `payment_id`: number
  - `bill_id`: number
  - `create_at`: Date
  - `amount`: number
  - `method`: `cash` | `credit_card` | `transfer`
  - `transaction_ref`: string
  - `bill`: `Bill`

---

## Persons

### GET /api/persons/detail
- Request type: `GetPerson`
  - `person_id`?: number
  - `email`?: string
  - `noPass`: boolean
- Response data: `Person`
  - `person_id`: number
  - `first_name`: string
  - `last_name`: string
  - `email`: string
  - `password`: string | null
  - `type`: `client` | `worker` | `cashier`

### POST /api/persons
- Request body: `CreatePerson`
  - `first_name`: string
  - `last_name`: string
  - `email`: string
  - `password`: string
  - `type`: `client` | `worker` | `cashier`
  - `specialty`?: `realism` | `cartoon` | `other`
  - `medical_notes`?: string
- Response data: `Person`
  - `person_id`: number
  - `first_name`: string
  - `last_name`: string
  - `email`: string
  - `password`: string | null
  - `type`: `client` | `worker` | `cashier`

---

## Providers

### GET /api/providers
- Request type: none
- Response data: `ProviderWithRelations[]`
  - `provider_id`: number
  - `name`: string
  - `code`: string
  - `phone_number`: string
  - `address`: string
  - `products`: `Product[]`

### GET /api/providers/detail
- Request type: `GetProvider`
  - `provider_id`: number
- Response data: `ProviderWithRelations`
  - `provider_id`: number
  - `name`: string
  - `code`: string
  - `phone_number`: string
  - `address`: string
  - `products`: `Product[]`

### POST /api/providers
- Request body: `CreateProvider`
  - `name`: string
  - `code`: string
  - `phone_number`: string
  - `address`: string
- Response data: `ProviderWithRelations`
  - `provider_id`: number
  - `name`: string
  - `code`: string
  - `phone_number`: string
  - `address`: string
  - `products`: `Product[]`

---

## Schedules

### GET /api/schedules
- Request type: `GetManySchedules`
  - `worker_id`?: number
  - `seat_id`?: number
  - `active`?: boolean
- Response data: `Schedule[]`
  - `schedule_id`: number
  - `worker_id`: number
  - `seat_id`: number
  - `created_at`: Date
  - `monday`: `ScheduleJsonDay`
  - `tuesday`: `ScheduleJsonDay`
  - `wednesday`: `ScheduleJsonDay`
  - `thursday`: `ScheduleJsonDay`
  - `friday`: `ScheduleJsonDay`
  - `saturday`: `ScheduleJsonDay`
  - `sunday`: `ScheduleJsonDay`
  - `valid_until`: Date | null
  - `active`: boolean

### GET /api/schedules/active
- Request type: none
- Query parameters:
  - `worker_id`: number
- Response data: `Schedule`
  - `schedule_id`: number
  - `worker_id`: number
  - `seat_id`: number
  - `created_at`: Date
  - `monday`: `ScheduleJsonDay`
  - `tuesday`: `ScheduleJsonDay`
  - `wednesday`: `ScheduleJsonDay`
  - `thursday`: `ScheduleJsonDay`
  - `friday`: `ScheduleJsonDay`
  - `saturday`: `ScheduleJsonDay`
  - `sunday`: `ScheduleJsonDay`
  - `valid_until`: Date | null
  - `active`: boolean

### GET /api/schedules/day
- Request type: none
- Query parameters:
  - `worker_id`: number
  - `day`: `monday` | `tuesday` | `wednesday` | `thursday` | `friday` | `saturday` | `sunday`
- Response data: `Schedule`
  - `schedule_id`: number
  - `worker_id`: number
  - `seat_id`: number
  - `created_at`: Date
  - `monday`: `ScheduleJsonDay`
  - `tuesday`: `ScheduleJsonDay`
  - `wednesday`: `ScheduleJsonDay`
  - `thursday`: `ScheduleJsonDay`
  - `friday`: `ScheduleJsonDay`
  - `saturday`: `ScheduleJsonDay`
  - `sunday`: `ScheduleJsonDay`
  - `valid_until`: Date | null
  - `active`: boolean

### POST /api/schedules
- Request body: `CreateSchedule`
  - `worker_id`: number
  - `seat_id`: number
  - `monday`: `ScheduleJsonDay`
  - `tuesday`: `ScheduleJsonDay`
  - `wednesday`: `ScheduleJsonDay`
  - `thursday`: `ScheduleJsonDay`
  - `friday`: `ScheduleJsonDay`
  - `saturday`: `ScheduleJsonDay`
  - `sunday`: `ScheduleJsonDay`
- Response data: `Schedule`
  - `schedule_id`: number
  - `worker_id`: number
  - `seat_id`: number
  - `created_at`: Date
  - `monday`: `ScheduleJsonDay`
  - `tuesday`: `ScheduleJsonDay`
  - `wednesday`: `ScheduleJsonDay`
  - `thursday`: `ScheduleJsonDay`
  - `friday`: `ScheduleJsonDay`
  - `saturday`: `ScheduleJsonDay`
  - `sunday`: `ScheduleJsonDay`
  - `valid_until`: Date | null
  - `active`: boolean

### PUT /api/schedules/inactive
- Request body or query:
  - `schedule_id`: number
- Response data: `Schedule`
  - `schedule_id`: number
  - `worker_id`: number
  - `seat_id`: number
  - `created_at`: Date
  - `monday`: `ScheduleJsonDay`
  - `tuesday`: `ScheduleJsonDay`
  - `wednesday`: `ScheduleJsonDay`
  - `thursday`: `ScheduleJsonDay`
  - `friday`: `ScheduleJsonDay`
  - `saturday`: `ScheduleJsonDay`
  - `sunday`: `ScheduleJsonDay`
  - `valid_until`: Date | null
  - `active`: boolean

---

## Seats

### GET /api/seats
- Request type: `GetSeatFilters`
  - `seat_id`?: number
  - `seat_code`?: string
  - `is_deleted`?: boolean
- Response data: `SeatWithRelations[]`
  - `seat_id`: number
  - `seat_code`: string
  - `created_at`: Date
  - `is_deleted`: boolean
  - `schedules`: `Schedule[]`

### GET /api/seats/detail
- Request type: `GetSeatFilters`
  - `seat_id`?: number
  - `seat_code`?: string
  - `is_deleted`?: boolean
- Response data: `SeatWithRelations`
  - `seat_id`: number
  - `seat_code`: string
  - `created_at`: Date
  - `is_deleted`: boolean
  - `schedules`: `Schedule[]`

---

## Stock Movements

### GET /api/stock-movements/detail
- Request type: `GetStockMovementFilters`
  - `stock_movement_id`?: number
  - `inventory_item_id`?: number
  - `type`?: `entry` | `exit` | `waste`
  - `create_at`?: Date
  - `quantity`?: number
- Response data: `StockMovement`
  - `stock_movement_id`: number
  - `inventory_item_id`: number
  - `type`: `entry` | `exit` | `waste`
  - `quantity`: number
  - `reason`: string | null
  - `create_at`: Date
  - `inventoryItem`: `InventoryItem`
  - `billDetails`: `BillDetail[]`

---

## Tattoos

### GET /api/tattoos/detail
- Request type: `GetTattoo`
  - `tattoo_id`: number
- Response data: `Tattoo`
  - `tattoo_id`: number
  - `img_id`: number
  - `cost`: number
  - `time`: Date
  - `name`: string

### GET /api/tattoos/materials
- Request type: `GetTattooMaterials`
  - `tattoo_id`: number
- Response data: `Material[]`
  - `product_variant_id`: number
  - `tattoo_id`: number
  - `quantity`: number

### POST /api/tattoos
- Request body: `CreateTattooRequest`
  - `name`: string
  - `cost`: number
  - `time`: Date
  - `img`:
    - `source`: Uint8Array | Buffer
    - `description`?: string
  - `materials`:
    - `product_variant_id`: number
    - `quantity`: number
- Response data: `Tattoo`
  - `tattoo_id`: number
  - `img_id`: number
  - `cost`: number
  - `time`: Date
  - `name`: string

---

## Workers

### GET /api/workers
- Request type: none
- Response data: `WorkerPublic[]`
  - `worker_id`: number
  - `person_id`: number
  - `first_name`: string
  - `last_name`: string
  - `email`: string
  - `type`: string
  - `specialty`: string

### GET /api/workers/detail
- Request type: none
- Query parameters:
  - `worker_id`: number
- Response data: `WorkerWithPerson`
  - `worker_id`: number
  - `person_id`: number
  - `specialty`: string
  - `person`:
    - `person_id`: number
    - `first_name`: string
    - `last_name`: string
    - `email`: string
    - `password`: string | null
    - `type`: string

---

## Notes

- Some endpoints accept query values that are converted to `number` or `boolean` internally.
- If a field is required by the service, the route still receives it via query or body.
- For exact DTO shapes, refer to the shared types in `packages/shared/src/types`.
