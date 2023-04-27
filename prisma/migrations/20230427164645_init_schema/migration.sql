-- CreateTable
CREATE TABLE `AnimalType` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type_name` ENUM('DOG', 'CAT', 'RABBIT', 'HORSE') NOT NULL,

    UNIQUE INDEX `AnimalType_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `WeightCategory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `category_name` ENUM('A_FINE_BOI', 'HE_CHOMNK', 'A_HECKING_CHONKER', 'HEFTY_CHONK', 'MEGA_CHONKER', 'OH_LAWD_HE_COMIN') NOT NULL,

    UNIQUE INDEX `WeightCategory_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Animal` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `weight` DOUBLE NOT NULL,
    `fk_user` INTEGER NOT NULL,
    `weightCategoryId` INTEGER NOT NULL,
    `animalTypeId` INTEGER NOT NULL,

    UNIQUE INDEX `Animal_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Fighter` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `odds` DOUBLE NOT NULL,
    `animalId` INTEGER NOT NULL,

    UNIQUE INDEX `Fighter_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MatchWaitingList` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `status` ENUM('ACCEPTED', 'REJECTED', 'PENDING') NOT NULL DEFAULT 'PENDING',
    `matchId` INTEGER NOT NULL,
    `fighterId` INTEGER NOT NULL,

    UNIQUE INDEX `MatchWaitingList_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Match` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `matchStartDate` DATETIME(3) NOT NULL,
    `matchEndDate` DATETIME(3) NULL,
    `fighter1` INTEGER NOT NULL,
    `fighter2` INTEGER NULL,
    `arenaId` INTEGER NOT NULL,

    UNIQUE INDEX `Match_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Arena` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `address2` VARCHAR(191) NULL,
    `city` VARCHAR(191) NOT NULL,
    `zipcode` VARCHAR(191) NOT NULL,
    `country` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Arena_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `firstname` VARCHAR(191) NOT NULL,
    `lastname` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` ENUM('ADMIN', 'USER', 'ANIMAL_OWNER') NOT NULL DEFAULT 'USER',
    `email_token` VARCHAR(191) NULL,

    UNIQUE INDEX `User_id_key`(`id`),
    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Wallet` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fk_user` INTEGER NOT NULL,
    `amount` DOUBLE NOT NULL,

    UNIQUE INDEX `Wallet_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Invoice` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `amount` DOUBLE NOT NULL,
    `fk_user` INTEGER NOT NULL,

    UNIQUE INDEX `Invoice_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Transaction` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` ENUM('IN', 'OUT') NOT NULL,
    `tag` ENUM('WITHDRAW', 'BUY_CREDIT', 'FEE', 'BET') NOT NULL,
    `amount` DOUBLE NOT NULL,
    `walletId` INTEGER NOT NULL,
    `invoiceId` INTEGER NOT NULL,

    UNIQUE INDEX `Transaction_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Animal` ADD CONSTRAINT `Animal_weightCategoryId_fkey` FOREIGN KEY (`weightCategoryId`) REFERENCES `WeightCategory`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Animal` ADD CONSTRAINT `Animal_animalTypeId_fkey` FOREIGN KEY (`animalTypeId`) REFERENCES `AnimalType`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Fighter` ADD CONSTRAINT `Fighter_animalId_fkey` FOREIGN KEY (`animalId`) REFERENCES `Animal`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MatchWaitingList` ADD CONSTRAINT `MatchWaitingList_matchId_fkey` FOREIGN KEY (`matchId`) REFERENCES `Match`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MatchWaitingList` ADD CONSTRAINT `MatchWaitingList_fighterId_fkey` FOREIGN KEY (`fighterId`) REFERENCES `Fighter`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Match` ADD CONSTRAINT `Match_fighter1_fkey` FOREIGN KEY (`fighter1`) REFERENCES `Fighter`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Match` ADD CONSTRAINT `Match_fighter2_fkey` FOREIGN KEY (`fighter2`) REFERENCES `Fighter`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Match` ADD CONSTRAINT `Match_arenaId_fkey` FOREIGN KEY (`arenaId`) REFERENCES `Arena`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Invoice` ADD CONSTRAINT `Invoice_fk_user_fkey` FOREIGN KEY (`fk_user`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transaction` ADD CONSTRAINT `Transaction_walletId_fkey` FOREIGN KEY (`walletId`) REFERENCES `Wallet`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transaction` ADD CONSTRAINT `Transaction_invoiceId_fkey` FOREIGN KEY (`invoiceId`) REFERENCES `Invoice`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
