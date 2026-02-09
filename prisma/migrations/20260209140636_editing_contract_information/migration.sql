/*
  Warnings:

  - You are about to alter the column `bookingStatus` on the `daily_bookings` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(10))` to `Enum(EnumId(3))`.

*/
-- AlterTable
ALTER TABLE `daily_bookings` MODIFY `bookingStatus` ENUM('PENDING', 'STAYED', 'CANCELLED', 'CHECKED_OUT') NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE `monthly_contracts` MODIFY `contractStatus` ENUM('PENDING', 'ACTIVE', 'NOTICE', 'CLOSED') NOT NULL DEFAULT 'PENDING';
