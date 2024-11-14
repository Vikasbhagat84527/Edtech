/*
  Warnings:

  - You are about to drop the column `location` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `phoneNumber` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `standard` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "location",
DROP COLUMN "phoneNumber",
DROP COLUMN "standard";
