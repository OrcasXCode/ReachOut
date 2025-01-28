/*
  Warnings:

  - Added the required column `emailIV` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phoneNumberIV` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "emailIV" TEXT NOT NULL,
ADD COLUMN     "phoneNumberIV" TEXT NOT NULL;
