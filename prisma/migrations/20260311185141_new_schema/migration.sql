/*
  Warnings:

  - A unique constraint covering the columns `[roomId,uTypeId,month,year]` on the table `utility_usages` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `month` to the `utility_usages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `year` to the `utility_usages` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `utility_usages` ADD COLUMN `month` INTEGER NOT NULL,
    ADD COLUMN `year` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `utility_usages_roomId_uTypeId_month_year_key` ON `utility_usages`(`roomId`, `uTypeId`, `month`, `year`);
