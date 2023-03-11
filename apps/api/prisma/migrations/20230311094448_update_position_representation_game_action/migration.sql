/*
  Warnings:

  - You are about to alter the column `fromPosition` on the `GameAction` table. The data in that column could be lost. The data in that column will be cast from `VarChar(14)` to `VarChar(2)`.
  - You are about to alter the column `toPosition` on the `GameAction` table. The data in that column could be lost. The data in that column will be cast from `VarChar(14)` to `VarChar(2)`.

*/
-- AlterTable
ALTER TABLE "GameAction" ALTER COLUMN "fromPosition" SET DATA TYPE VARCHAR(2),
ALTER COLUMN "toPosition" SET DATA TYPE VARCHAR(2);
