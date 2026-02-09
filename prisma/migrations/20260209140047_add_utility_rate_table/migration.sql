-- CreateTable
CREATE TABLE `utility_rates` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `electricityRate` DECIMAL(10, 2) NOT NULL,
    `waterRate` DECIMAL(10, 2) NOT NULL,
    `effectiveDate` DATE NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
