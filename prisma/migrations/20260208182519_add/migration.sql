/*
  Warnings:

  - You are about to drop the column `refType` on the `room_checks` table. All the data in the column will be lost.
  - You are about to drop the column `referenceId` on the `room_checks` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `room_checks` DROP FOREIGN KEY `fk_daily_booking_check`;

-- DropForeignKey
ALTER TABLE `room_checks` DROP FOREIGN KEY `fk_monthly_contract_check`;

-- AlterTable
ALTER TABLE `room_checks` DROP COLUMN `refType`,
    DROP COLUMN `referenceId`,
    ADD COLUMN `dailyBookingId` INTEGER NULL,
    ADD COLUMN `monthlyContractId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `room_checks` ADD CONSTRAINT `fk_daily_booking_check` FOREIGN KEY (`dailyBookingId`) REFERENCES `daily_bookings`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `room_checks` ADD CONSTRAINT `fk_monthly_contract_check` FOREIGN KEY (`monthlyContractId`) REFERENCES `monthly_contracts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
