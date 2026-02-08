/*
  Warnings:

  - The values [MANAGER,RECEPTIONIST] on the enum `users_role` will be removed. If these variants are still used in the database, this will fail.

*/
-- DropForeignKey
ALTER TABLE `daily_bookings` DROP FOREIGN KEY `daily_bookings_customerId_fkey`;

-- DropForeignKey
ALTER TABLE `daily_bookings` DROP FOREIGN KEY `daily_bookings_roomId_fkey`;

-- DropForeignKey
ALTER TABLE `monthly_contracts` DROP FOREIGN KEY `monthly_contracts_customerId_fkey`;

-- DropForeignKey
ALTER TABLE `monthly_contracts` DROP FOREIGN KEY `monthly_contracts_roomId_fkey`;

-- DropForeignKey
ALTER TABLE `room_availability` DROP FOREIGN KEY `room_availability_roomId_fkey`;

-- AlterTable
ALTER TABLE `users` MODIFY `role` ENUM('ADMIN', 'STAFF') NOT NULL DEFAULT 'STAFF';

-- AddForeignKey
ALTER TABLE `daily_bookings` ADD CONSTRAINT `daily_bookings_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `customers`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `daily_bookings` ADD CONSTRAINT `daily_bookings_roomId_fkey` FOREIGN KEY (`roomId`) REFERENCES `rooms`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `monthly_contracts` ADD CONSTRAINT `monthly_contracts_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `customers`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `monthly_contracts` ADD CONSTRAINT `monthly_contracts_roomId_fkey` FOREIGN KEY (`roomId`) REFERENCES `rooms`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `room_availability` ADD CONSTRAINT `room_availability_roomId_fkey` FOREIGN KEY (`roomId`) REFERENCES `rooms`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
