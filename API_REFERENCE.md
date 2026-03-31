# CityHill Backend — API Reference

> Base URL: `http://localhost:5000/api`

---

## Table of Contents

1. [Authentication](#1-authentication)
2. [Users](#2-users)
3. [Room Types](#3-room-types)
4. [Rooms](#4-rooms)
5. [Customers](#5-customers)
6. [Daily Bookings](#6-daily-bookings)
7. [Monthly Contracts](#7-monthly-contracts)
8. [Invoices](#8-invoices)
9. [Payments](#9-payments)
10. [Move-Out Settlements](#10-move-out-settlements)
11. [Utilities (ค่าสาธารณูปโภค)](#11-utilities)
12. [Utility Usages (การใช้สาธารณูปโภค)](#12-utility-usages)
13. [Enums Reference](#13-enums-reference)

---

## 1. Authentication

### POST `/auth/login`

Login and receive JWT token.

**Request Body:**

| Field      | Type   | Required | Description |
|------------|--------|----------|-------------|
| `username` | string | Yes      | Username    |
| `password` | string | Yes      | Password    |

**Response (200):**

```json
{
  "message": "Login successful",
  "token": "eyJhbGciOi...",
  "user": {
    "id": 1,
    "username": "admin",
    "fullName": "Admin User",
    "role": "ADMIN"
  }
}
```

---

## 2. Users

### GET `/users`

Get all users (password excluded).

**Response (200):** `User[]`

### GET `/users/:id`

Get user by ID.

**Response (200):** `User`

### POST `/users`

Create a new user.

**Request Body:**

| Field      | Type   | Required | Description                  |
|------------|--------|----------|------------------------------|
| `username` | string | Yes      | Unique username              |
| `password` | string | Yes      | Min 6 characters             |
| `fullName` | string | Yes      | Full name                    |
| `role`     | string | No       | `ADMIN` or `STAFF` (default: `STAFF`) |
| `phone`    | string | No       | Phone number                 |
| `email`    | string | No       | Email address                |

**Response (201):** `User`

### PUT `/users/:id`

Update user.

**Request Body:** Any fields from create (all optional). `password` will be re-hashed if provided.

**Response (200):** `User`

### DELETE `/users/:id`

Delete user.

**Response (200):** `{ "message": "User deleted successfully" }`

---

## 3. Room Types

### GET `/room-types`

Get all room types with rooms.

**Response (200):** `RoomType[]` (includes `rooms`)

### GET `/room-types/:id`

Get room type by ID.

**Response (200):** `RoomType` (includes `rooms`)

### POST `/room-types`

Create room type.

**Request Body:**

| Field             | Type   | Required | Description         |
|-------------------|--------|----------|---------------------|
| `typeName`        | string | Yes      | Unique type name    |
| `description`     | string | No       | Description         |
| `baseMonthlyRate` | number | Yes      | Base monthly rate   |
| `baseDailyRate`   | number | Yes      | Base daily rate     |

**Response (201):** `RoomType`

### PUT `/room-types/:id`

Update room type.

**Request Body:** Any fields from create (all optional).

**Response (200):** `RoomType`

### DELETE `/room-types/:id`

Delete room type.

**Response (200):** `{ "message": "Room type deleted successfully" }`

---

## 4. Rooms

> **Note:** Room uses `roomNumber` (Int) as primary key. The `:id` in URL refers to `roomNumber`.

### GET `/rooms`

Get all rooms with room type, bookings, contracts, and utility usages.

**Response (200):** `Room[]`

### GET `/rooms/:id`

Get room by room number.

**Response (200):** `Room` (includes `roomType`, `dailyBookings`, `monthlyContracts`, `utilityUsages`)

### POST `/rooms`

Create a new room.

**Request Body:**

| Field                 | Type   | Required | Description                                   |
|-----------------------|--------|----------|-----------------------------------------------|
| `roomNumber`          | number | Yes      | Room number (PK, unique)                      |
| `floor`               | number | Yes      | Floor number                                  |
| `typeId`              | number | Yes      | Room type ID (FK → RoomType)                  |
| `allowedType`         | string | No       | `MONTHLY`, `DAILY`, `FLEXIBLE` (default: `FLEXIBLE`) |
| `currentStatus`       | string | No       | Room status (default: `AVAILABLE`)            |

**Response (201):** `Room`

### PUT `/rooms/:id`

Update room.

**Request Body:**

| Field                 | Type   | Required | Description                  |
|-----------------------|--------|----------|------------------------------|
| `floor`               | number | No       | Floor number                 |
| `typeId`              | number | No       | Room type ID                 |
| `allowedType`         | string | No       | AllowedType enum             |
| `currentStatus`       | string | No       | RoomStatus enum              |
| `latestMeterElectric` | number | No       | Latest electric meter reading|
| `latestMeterWater`    | number | No       | Latest water meter reading   |

**Response (200):** `Room`

### DELETE `/rooms/:id`

Delete room (fails if active bookings/contracts exist).

**Response (200):** `{ "message": "Room deleted successfully" }`

---

## 5. Customers

### GET `/customers`

Get all customers with bookings and contracts.

**Response (200):** `Customer[]`

### GET `/customers/:id`

Get customer by ID.

**Response (200):** `Customer` (includes `dailyBookings`, `monthlyContracts`)

### POST `/customers`

Create customer.

**Request Body:**

| Field           | Type   | Required | Description          |
|-----------------|--------|----------|----------------------|
| `fullName`      | string | Yes      | Full name            |
| `citizenId`     | string | Yes      | Citizen ID (unique)  |
| `address`       | string | No       | Address              |
| `phone`         | string | Yes      | Phone number         |
| `carLicense`    | string | No       | Car license plate    |
| `customerImage` | string | No       | Image URL/path       |

**Response (201):** `Customer`

### PUT `/customers/:id`

Update customer.

**Request Body:** Any fields from create (all optional).

**Response (200):** `Customer`

### DELETE `/customers/:id`

Delete customer (cascades to bookings/contracts).

**Response (200):** `{ "message": "Customer deleted successfully" }`

---

## 6. Daily Bookings

### GET `/daily-bookings`

Get all daily bookings with customer and room.

**Response (200):** `DailyBooking[]`

### GET `/daily-bookings/:id`

Get daily booking by ID.

**Response (200):** `DailyBooking` (includes `customer`, `room`)

### POST `/daily-bookings`

Create daily booking. Room status auto-updates to `RESERVED`.

**Request Body:**

| Field           | Type   | Required | Description                             |
|-----------------|--------|----------|-----------------------------------------|
| `customerId`    | number | Yes      | Customer ID (FK)                        |
| `roomId`        | number | Yes      | Room number (FK → Room.roomNumber)      |
| `checkInDate`   | string | Yes      | Check-in date (ISO format: `YYYY-MM-DD`)|
| `checkOutDate`  | string | Yes      | Check-out date (ISO format)             |
| `numGuests`     | number | No       | Number of guests                        |
| `extraBedCount` | number | No       | Extra beds                              |
| `totalAmount`   | number | Yes      | Total amount                            |
| `bookingStatus` | string | No       | Default: `PENDING`                      |
| `paymentStatus` | string | No       | Default: `PENDING`                      |

**Response (201):** `DailyBooking`

### PUT `/daily-bookings/:id`

Update daily booking. Room status auto-updates on status change:
- `STAYED` → room becomes `OCCUPIED_D`
- `CHECKED_OUT` → room becomes `AVAILABLE`

**Request Body:** Any fields from create (all optional).

**Response (200):** `DailyBooking`

### DELETE `/daily-bookings/:id`

Delete daily booking. Room status returns to `AVAILABLE`.

**Response (200):** `{ "message": "Daily booking deleted successfully" }`

---

## 7. Monthly Contracts

### GET `   `

Get all monthly contracts.

**Response (200):** `MonthlyContract[]` (includes `customer`, `room`, `invoices`, `moveOutSettlement`)

### GET `/monthly-contracts/:id`

Get monthly contract by ID.

**Response (200):** `MonthlyContract`

### POST `/monthly-contracts`

Create monthly contract. Room status auto-updates to `RESERVED`.

**Request Body:**

| Field             | Type   | Required | Description                              |
|-------------------|--------|----------|------------------------------------------|
| `customerId`      | number | Yes      | Customer ID (FK)                         |
| `roomId`          | number | Yes      | Room number (FK → Room.roomNumber)       |
| `startDate`       | string | Yes      | Start date (ISO format)                  |
| `endDate`         | string | No       | End date (ISO format)                    |
| `depositAmount`   | number | Yes      | Deposit amount                           |
| `advancePayment`  | number | Yes      | Advance payment amount                   |
| `monthlyRentRate` | number | Yes      | Monthly rent rate                        |
| `contractStatus`  | string | No       | Default: `ACTIVE`                        |
| `contractFile`    | string | No       | Contract file URL/path                   |

**Response (201):** `MonthlyContract`

### PUT `/monthly-contracts/:id`

Update monthly contract. Room status auto-updates:
- `ACTIVE` → room becomes `OCCUPIED_M`
- `CLOSED` → room becomes `AVAILABLE`
- Room change → old room `AVAILABLE`, new room `OCCUPIED_M`

**Request Body:** Any fields from create (all optional).

**Response (200):** `MonthlyContract`

### DELETE `/monthly-contracts/:id`

Delete monthly contract. Room status returns to `AVAILABLE`.

**Response (200):** `{ "message": "Monthly contract deleted successfully" }`

---

## 8. Invoices

### GET `/invoices`

Get all invoices.

**Response (200):** `Invoice[]` (includes `monthlyContract` with `customer`/`room`, `payments`)

### GET `/invoices/:id`

Get invoice by ID.

**Response (200):** `Invoice`

### POST `/invoices`

Create invoice.

**Request Body:**

| Field               | Type   | Required | Description                          |
|---------------------|--------|----------|--------------------------------------|
| `monthlyContractId` | number | No       | Monthly contract ID (FK, nullable)   |
| `invoiceDate`       | string | Yes      | Invoice date (ISO format)            |
| `dueDate`           | string | Yes      | Due date (ISO format)                |
| `grandTotal`        | number | Yes      | Grand total amount                   |
| `paymentStatus`     | string | No       | Default: `PENDING`                   |

**Response (201):** `Invoice`

### PUT `/invoices/:id`

Update invoice.

**Request Body:**

| Field               | Type   | Required | Description           |
|---------------------|--------|----------|-----------------------|
| `monthlyContractId` | number | No       | Monthly contract ID   |
| `invoiceDate`       | string | No       | Invoice date          |
| `dueDate`           | string | No       | Due date              |
| `grandTotal`        | number | No       | Grand total           |
| `paymentStatus`     | string | No       | PaymentStatus enum    |

**Response (200):** `Invoice`

### DELETE `/invoices/:id`

Delete invoice (cascades payments).

**Response (200):** `{ "message": "Invoice deleted successfully" }`

---

## 9. Payments

### GET `/payments`

Get all payments with invoice.

**Response (200):** `Payment[]`

### GET `/payments/:id`

Get payment by ID.

**Response (200):** `Payment` (includes `invoice`)

### POST `/payments`

Create payment.

**Request Body:**

| Field           | Type   | Required | Description                              |
|-----------------|--------|----------|------------------------------------------|
| `invoiceId`     | number | Yes      | Invoice ID (FK)                          |
| `paymentDate`   | string | No       | Payment date (default: now)              |
| `paymentMethod` | string | Yes      | `CASH`, `TRANSFER`, or `CREDIT_CARD`    |
| `amountPaid`    | number | Yes      | Amount paid                              |
| `slipImage`     | string | No       | Payment slip image URL/path              |

**Response (201):** `Payment`

### PUT `/payments/:id`

Update payment.

**Request Body:** Any fields from create (all optional).

**Response (200):** `Payment`

### DELETE `/payments/:id`

Delete payment.

**Response (200):** `{ "message": "Payment deleted successfully" }`

---

## 10. Move-Out Settlements

### GET `/move-out-settlements`

Get all settlements.

**Response (200):** `MoveOutSettlement[]` (includes `contract` with `customer`/`room`)

### GET `/move-out-settlements/:id`

Get settlement by ID.

**Response (200):** `MoveOutSettlement`

### GET `/move-out-settlements/contract/:contractId`

Get settlement by monthly contract ID.

**Response (200):** `MoveOutSettlement`

### GET `http://localhost:5000/api/move-out-settlements/outstanding/:contractId`

Get outstanding balance summary for a monthly contract (calculated from invoices - payments).

**Response (200):**

```json
{
  "contractId": 12,
  "totalInvoiced": 15000,
  "totalPaid": 12000,
  "outstandingBalance": 3000
}
```

### POST `/move-out-settlements`

Create move-out settlement (one per contract).

**Request Body:**

| Field                | Type   | Required | Description                     |
|----------------------|--------|----------|---------------------------------|
| `contractId`         | number | Yes      | Monthly contract ID (FK, unique)|
| `moveOutDate`        | string | Yes      | Move-out date (ISO format)      |
| `totalDeposit`       | number | Yes      | Total deposit amount            |
| `damageDeduction`    | number | No       | Damage deduction amount         |
| `cleaningFee`        | number | No       | Cleaning fee                    |
| `outstandingBalance` | number | No       | Outstanding balance (auto-calc if omitted) |
| `netRefund`          | number | No       | Net refund amount (auto-calc if omitted)    |
| `refundStatus`       | string | No       | Default: `PENDING`              |

**Response (201):** `MoveOutSettlement`

### PUT `/move-out-settlements/:id`

Update settlement.

**Request Body:** Any fields from create (all optional, except `contractId`).

**Response (200):** `{ "success": true, "data": MoveOutSettlement }`

### DELETE `/move-out-settlements/:id`

Delete settlement.

**Response (200):** `{ "success": true, "message": "Settlement deleted successfully" }`

---

## 11. Utilities

> ตารางอัตราค่าสาธารณูปโภค (ไฟฟ้า, น้ำ, ฯลฯ)

### GET `/utilities`

Get all utility types with usages.

**Response (200):** `Utilities[]`

### GET `/utilities/:id`

Get utility type by ID.

**Response (200):** `Utilities` (includes `usages`)

### POST `/utilities`

Create utility type.

**Request Body:**

| Field         | Type   | Required | Description                          |
|---------------|--------|----------|--------------------------------------|
| `uType`       | string | Yes      | Utility type name (e.g., "Electric", "Water") |
| `ratePerUnit` | number | Yes      | Rate per unit (Decimal)              |

**Response (201):** `Utilities`

### PUT `/utilities/:id`

Update utility type.

**Request Body:**

| Field         | Type   | Required | Description     |
|---------------|--------|----------|-----------------|
| `uType`       | string | No       | Type name       |
| `ratePerUnit` | number | No       | Rate per unit   |

**Response (200):** `Utilities`

### DELETE `/utilities/:id`

Delete utility type (cascades usages).

**Response (200):** `{ "message": "Utility deleted successfully" }`

---

## 12. Utility Usages

> บันทึกการใช้สาธารณูปโภคของแต่ละห้อง

### GET `/utility-usages`

Get all utility usages.

**Response (200):** `UtilityUsage[]` (includes `room`, `utilityType`)

### GET `/utility-usages/:id`

Get utility usage by ID.

**Response (200):** `UtilityUsage`

### GET `/utility-usages/room/:roomId`

Get all utility usages for a specific room (sorted by `recordDate` desc).

**Response (200):** `UtilityUsage[]`

### POST `/utility-usages`

Create utility usage record.

**Request Body:**

| Field        | Type   | Required | Description                          |
|--------------|--------|----------|--------------------------------------|
| `roomId`     | number | Yes      | Room number (FK → Room.roomNumber)   |
| `month`      | number | Yes      | Month (1-12)                         |
| `year`       | number | Yes      | Year (e.g. 2026)                     |
| `recordDate` | string | Yes      | Record date (ISO format)             |
| `utilityUnit`| number | Yes      | Units consumed (Decimal)             |
| `uTypeId`    | number | Yes      | Utility type ID (FK → Utilities)     |

> **Unique constraint:** Each room + utility type + month + year can only have **1 record**. Creating a duplicate will return `400`.

**Response (201):** `UtilityUsage`

### PUT `/utility-usages/:id`

Update utility usage.

**Request Body:**

| Field        | Type   | Required | Description     |
|--------------|--------|----------|-----------------|
| `roomId`     | number | No       | Room number     |
| `month`      | number | No       | Month (1-12)    |
| `year`       | number | No       | Year            |
| `recordDate` | string | No       | Record date     |
| `utilityUnit`| number | No       | Units consumed  |
| `uTypeId`    | number | No       | Utility type ID |

**Response (200):** `UtilityUsage`

### DELETE `/utility-usages/:id`

Delete utility usage.

**Response (200):** `{ "message": "Utility usage deleted successfully" }`

---

## 13. Enums Reference

### UserRole

| Value   | Description |
|---------|-------------|
| `ADMIN` | Administrator |
| `STAFF` | Staff member  |

### AllowedType

| Value      | Description     |
|------------|-----------------|
| `MONTHLY`  | Monthly only    |
| `DAILY`    | Daily only      |
| `FLEXIBLE` | Both types      |

### RoomStatus

| Value         | Description          |
|---------------|----------------------|
| `AVAILABLE`   | Room is available    |
| `OCCUPIED_M`  | Occupied (Monthly)   |
| `OCCUPIED_D`  | Occupied (Daily)     |
| `RESERVED`    | Reserved             |
| `MAINTENANCE` | Under maintenance    |

### BookingStatus

| Value         | Description        |
|---------------|--------------------|
| `PENDING`     | Pending            |
| `STAYED`      | Currently staying  |
| `CANCELLED`   | Cancelled          |
| `CHECKED_OUT` | Checked out        |

### PaymentStatus

| Value     | Description |
|-----------|-------------|
| `PENDING` | Pending     |
| `PAID`    | Paid        |
| `OVERDUE` | Overdue     |

### ContractStatus

| Value     | Description      |
|-----------|------------------|
| `PENDING` | Pending approval |
| `ACTIVE`  | Active contract  |
| `NOTICE`  | Notice given     |
| `CLOSED`  | Contract closed  |

### PaymentMethod

| Value         | Description |
|---------------|-------------|
| `CASH`        | Cash        |
| `TRANSFER`    | Transfer    |
| `CREDIT_CARD` | Credit card |

### RefundStatus

| Value      | Description |
|------------|-------------|
| `PENDING`  | Pending     |
| `REFUNDED` | Refunded    |

---

## Error Responses

All errors follow this format:

```json
{
  "error": "Error message description"
}
```

| Status | Description                    |
|--------|--------------------------------|
| 400    | Bad request / Validation error |
| 401    | Unauthorized                   |
| 403    | Forbidden                      |
| 404    | Not found                      |
| 500    | Internal server error          |

---

## Notes

- All dates should be sent in ISO format: `YYYY-MM-DD` or `YYYY-MM-DDTHH:mm:ssZ`
- JWT token must be sent in the `Authorization` header as `Bearer <token>` for protected routes
- Decimal fields (`totalAmount`, `grandTotal`, `amountPaid`, etc.) are stored as `Decimal(10,2)`
- Room's `roomNumber` (Int) is the primary key — use it as `:id` in room-related URLs
- Cascade deletes: Deleting a Customer cascades to DailyBookings and MonthlyContracts
- Cascade deletes: Deleting a MonthlyContract cascades to Invoices and MoveOutSettlement
