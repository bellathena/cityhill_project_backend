/*
  Warnings:

  - You are about to drop the column `refType` on the `invoices` table. All the data in the column will be lost.
  - You are about to drop the column `referenceId` on the `invoices` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `invoices` DROP FOREIGN KEY `fk_daily_booking_invoice`;

-- DropForeignKey
ALTER TABLE `invoices` DROP FOREIGN KEY `fk_monthly_contract_invoice`;

-- AlterTable
ALTER TABLE `invoices` DROP COLUMN `refType`,
    DROP COLUMN `referenceId`,
    ADD COLUMN `dailyBookingId` INTEGER NULL,
    ADD COLUMN `monthlyContractId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `invoices` ADD CONSTRAINT `fk_daily_booking_invoice` FOREIGN KEY (`dailyBookingId`) REFERENCES `daily_bookings`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `invoices` ADD CONSTRAINT `fk_monthly_contract_invoice` FOREIGN KEY (`monthlyContractId`) REFERENCES `monthly_contracts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
