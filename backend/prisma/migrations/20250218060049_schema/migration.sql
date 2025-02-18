/*
  Warnings:

  - Added the required column `businessType` to the `Business` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "BusinessType" AS ENUM ('ESTABLISHED_BUSINESS', 'STREET_VENDOR', 'HOME_BUSINESS', 'SERVICES');

-- AlterTable
ALTER TABLE "Business" ADD COLUMN     "businessType" "BusinessType" NOT NULL;
