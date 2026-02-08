/*
  Warnings:

  - You are about to drop the `booking` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `invoice` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `room` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tenant` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `booking` DROP FOREIGN KEY `Booking_roomId_fkey`;

-- DropForeignKey
ALTER TABLE `booking` DROP FOREIGN KEY `Booking_tenantId_fkey`;

-- DropForeignKey
ALTER TABLE `invoice` DROP FOREIGN KEY `Invoice_bookingId_fkey`;

-- DropTable
DROP TABLE `booking`;

-- DropTable
DROP TABLE `invoice`;

-- DropTable
DROP TABLE `room`;

-- DropTable
DROP TABLE `tenant`;

-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `fullName` VARCHAR(191) NOT NULL,
    `role` ENUM('ADMIN', 'MANAGER', 'STAFF', 'RECEPTIONIST') NOT NULL DEFAULT 'STAFF',
    `phone` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `room_types` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `typeName` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `baseMonthlyRate` INTEGER NOT NULL,
    `baseDailyRate` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `room_types_typeName_key`(`typeName`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `rooms` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `roomNumber` VARCHAR(191) NOT NULL,
    `floor` DECIMAL(10, 2) NOT NULL,
    `typeId` INTEGER NOT NULL,
    `allowedType` ENUM('MONTHLY', 'DAILY', 'FLEXIBLE') NOT NULL DEFAULT 'FLEXIBLE',
    `currentStatus` ENUM('AVAILABLE', 'OCCUPIED_M', 'OCCUPIED_D', 'RESERVED', 'MAINTENANCE') NOT NULL DEFAULT 'AVAILABLE',
    `latestMeterElectric` INTEGER NULL,
    `latestMeterWater` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `rooms_roomNumber_key`(`roomNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `customers` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fullName` VARCHAR(191) NOT NULL,
    `citizenId` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NOT NULL,
    `carLicense` VARCHAR(191) NULL,
    `customerImage` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `customers_citizenId_key`(`citizenId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `daily_bookings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `customerId` INTEGER NOT NULL,
    `roomId` INTEGER NOT NULL,
    `checkInDate` DATE NOT NULL,
    `checkOutDate` DATE NOT NULL,
    `numGuests` INTEGER NULL,
    `extraBedCount` INTEGER NULL,
    `totalAmount` DECIMAL(10, 2) NOT NULL,
    `bookingStatus` ENUM('CONFIRMED', 'STAYED', 'CANCELLED', 'CHECKED_OUT') NOT NULL DEFAULT 'CONFIRMED',
    `paymentStatus` ENUM('PENDING', 'PAID', 'OVERDUE') NOT NULL DEFAULT 'PENDING',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `monthly_contracts` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `customerId` INTEGER NOT NULL,
    `roomId` INTEGER NOT NULL,
    `startDate` DATE NOT NULL,
    `endDate` DATE NULL,
    `depositAmount` INTEGER NOT NULL,
    `advancePayment` INTEGER NOT NULL,
    `monthlyRentRate` INTEGER NOT NULL,
    `contractStatus` ENUM('ACTIVE', 'NOTICE', 'CLOSED') NOT NULL DEFAULT 'ACTIVE',
    `contractFile` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `room_availability` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `roomId` INTEGER NOT NULL,
    `checkDate` DATE NOT NULL,
    `referenceId` INTEGER NULL,
    `refType` VARCHAR(191) NULL,
    `status` ENUM('AVAILABLE', 'BOOKED', 'OCCUPIED') NOT NULL DEFAULT 'AVAILABLE',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `room_availability_roomId_checkDate_key`(`roomId`, `checkDate`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `room_checks` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `referenceId` INTEGER NOT NULL,
    `refType` VARCHAR(191) NOT NULL,
    `checkType` ENUM('CHECK_IN', 'CHECK_OUT') NOT NULL,
    `conditionBed` ENUM('NORMAL', 'DAMAGED', 'DIRTY', 'MISSING') NULL,
    `conditionAir` ENUM('NORMAL', 'DAMAGED', 'DIRTY', 'MISSING') NULL,
    `conditionBathroom` ENUM('NORMAL', 'DAMAGED', 'DIRTY', 'MISSING') NULL,
    `conditionLights` ENUM('NORMAL', 'DAMAGED', 'DIRTY', 'MISSING') NULL,
    `notes` TEXT NULL,
    `evidencePhotos` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `meter_readings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `roomId` INTEGER NOT NULL,
    `month` INTEGER NOT NULL,
    `year` INTEGER NOT NULL,
    `previousElectric` DECIMAL(10, 2) NOT NULL,
    `currentElectric` DECIMAL(10, 2) NOT NULL,
    `previousWater` DECIMAL(10, 2) NOT NULL,
    `currentWater` DECIMAL(10, 2) NOT NULL,
    `readingDate` DATE NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `meter_readings_roomId_month_year_key`(`roomId`, `month`, `year`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `invoices` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `referenceId` INTEGER NOT NULL,
    `refType` VARCHAR(191) NOT NULL,
    `invoiceDate` DATE NOT NULL,
    `dueDate` DATE NOT NULL,
    `rentAmount` DECIMAL(10, 2) NOT NULL,
    `electricFee` DECIMAL(10, 2) NULL,
    `waterFee` DECIMAL(10, 2) NULL,
    `serviceFee` DECIMAL(10, 2) NULL,
    `discount` DECIMAL(10, 2) NULL,
    `grandTotal` DECIMAL(10, 2) NOT NULL,
    `paymentStatus` ENUM('PENDING', 'PAID', 'OVERDUE') NOT NULL DEFAULT 'PENDING',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payments` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `invoiceId` INTEGER NOT NULL,
    `paymentDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `paymentMethod` ENUM('CASH', 'TRANSFER', 'CREDIT_CARD') NOT NULL,
    `amountPaid` DECIMAL(10, 2) NOT NULL,
    `slipImage` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `move_out_settlements` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `contractId` INTEGER NOT NULL,
    `moveOutDate` DATE NOT NULL,
    `totalDeposit` DECIMAL(10, 2) NOT NULL,
    `damageDeduction` DECIMAL(10, 2) NULL,
    `cleaningFee` DECIMAL(10, 2) NULL,
    `outstandingBalance` DECIMAL(10, 2) NULL,
    `netRefund` DECIMAL(10, 2) NOT NULL,
    `refundStatus` ENUM('PENDING', 'REFUNDED') NOT NULL DEFAULT 'PENDING',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `move_out_settlements_contractId_key`(`contractId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `rooms` ADD CONSTRAINT `rooms_typeId_fkey` FOREIGN KEY (`typeId`) REFERENCES `room_types`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `daily_bookings` ADD CONSTRAINT `daily_bookings_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `customers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `daily_bookings` ADD CONSTRAINT `daily_bookings_roomId_fkey` FOREIGN KEY (`roomId`) REFERENCES `rooms`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `monthly_contracts` ADD CONSTRAINT `monthly_contracts_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `customers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `monthly_contracts` ADD CONSTRAINT `monthly_contracts_roomId_fkey` FOREIGN KEY (`roomId`) REFERENCES `rooms`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `room_availability` ADD CONSTRAINT `room_availability_roomId_fkey` FOREIGN KEY (`roomId`) REFERENCES `rooms`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `room_checks` ADD CONSTRAINT `fk_daily_booking_check` FOREIGN KEY (`referenceId`) REFERENCES `daily_bookings`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `room_checks` ADD CONSTRAINT `fk_monthly_contract_check` FOREIGN KEY (`referenceId`) REFERENCES `monthly_contracts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `meter_readings` ADD CONSTRAINT `meter_readings_roomId_fkey` FOREIGN KEY (`roomId`) REFERENCES `rooms`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `invoices` ADD CONSTRAINT `fk_daily_booking_invoice` FOREIGN KEY (`referenceId`) REFERENCES `daily_bookings`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `invoices` ADD CONSTRAINT `fk_monthly_contract_invoice` FOREIGN KEY (`referenceId`) REFERENCES `monthly_contracts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payments` ADD CONSTRAINT `payments_invoiceId_fkey` FOREIGN KEY (`invoiceId`) REFERENCES `invoices`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `move_out_settlements` ADD CONSTRAINT `move_out_settlements_contractId_fkey` FOREIGN KEY (`contractId`) REFERENCES `monthly_contracts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
