/*
  Warnings:

  - You are about to drop the column `dailyBookingId` on the `invoices` table. All the data in the column will be lost.
  - You are about to drop the column `discount` on the `invoices` table. All the data in the column will be lost.
  - You are about to drop the column `electricFee` on the `invoices` table. All the data in the column will be lost.
  - You are about to drop the column `rentAmount` on the `invoices` table. All the data in the column will be lost.
  - You are about to drop the column `serviceFee` on the `invoices` table. All the data in the column will be lost.
  - You are about to drop the column `waterFee` on the `invoices` table. All the data in the column will be lost.
  - The primary key for the `rooms` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `rooms` table. All the data in the column will be lost.
  - You are about to alter the column `roomNumber` on the `rooms` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to drop the `meter_readings` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `room_availability` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `room_checks` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `utility_rates` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `daily_bookings` DROP FOREIGN KEY `daily_bookings_roomId_fkey`;

-- DropForeignKey
ALTER TABLE `invoices` DROP FOREIGN KEY `fk_daily_booking_invoice`;

-- DropForeignKey
ALTER TABLE `meter_readings` DROP FOREIGN KEY `meter_readings_roomId_fkey`;

-- DropForeignKey
ALTER TABLE `monthly_contracts` DROP FOREIGN KEY `monthly_contracts_roomId_fkey`;

-- DropForeignKey
ALTER TABLE `room_availability` DROP FOREIGN KEY `room_availability_roomId_fkey`;

-- DropForeignKey
ALTER TABLE `room_checks` DROP FOREIGN KEY `fk_daily_booking_check`;

-- DropForeignKey
ALTER TABLE `room_checks` DROP FOREIGN KEY `fk_monthly_contract_check`;

-- DropIndex
DROP INDEX `rooms_roomNumber_key` ON `rooms`;

-- AlterTable
ALTER TABLE `invoices` DROP COLUMN `dailyBookingId`,
    DROP COLUMN `discount`,
    DROP COLUMN `electricFee`,
    DROP COLUMN `rentAmount`,
    DROP COLUMN `serviceFee`,
    DROP COLUMN `waterFee`;

-- AlterTable
ALTER TABLE `rooms` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    MODIFY `roomNumber` INTEGER NOT NULL,
    ADD PRIMARY KEY (`roomNumber`);

-- DropTable
DROP TABLE `meter_readings`;

-- DropTable
DROP TABLE `room_availability`;

-- DropTable
DROP TABLE `room_checks`;

-- DropTable
DROP TABLE `utility_rates`;

-- CreateTable
CREATE TABLE `utilities` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `uType` VARCHAR(191) NOT NULL,
    `ratePerUnit` DECIMAL(10, 2) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `utility_usages` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `roomId` INTEGER NOT NULL,
    `recordDate` DATE NOT NULL,
    `utilityUnit` DECIMAL(10, 2) NOT NULL,
    `uTypeId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `daily_bookings` ADD CONSTRAINT `daily_bookings_roomId_fkey` FOREIGN KEY (`roomId`) REFERENCES `rooms`(`roomNumber`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `monthly_contracts` ADD CONSTRAINT `monthly_contracts_roomId_fkey` FOREIGN KEY (`roomId`) REFERENCES `rooms`(`roomNumber`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `utility_usages` ADD CONSTRAINT `utility_usages_roomId_fkey` FOREIGN KEY (`roomId`) REFERENCES `rooms`(`roomNumber`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `utility_usages` ADD CONSTRAINT `utility_usages_uTypeId_fkey` FOREIGN KEY (`uTypeId`) REFERENCES `utilities`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
