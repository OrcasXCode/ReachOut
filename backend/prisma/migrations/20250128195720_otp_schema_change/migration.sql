/*
  Warnings:

  - A unique constraint covering the columns `[emailHash]` on the table `OTP` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[emailHash,otp]` on the table `OTP` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `emailHash` to the `OTP` table without a default value. This is not possible if the table is not empty.
  - Added the required column `emailIV` to the `OTP` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "OTP_email_otp_key";

-- AlterTable
ALTER TABLE "OTP" ADD COLUMN     "emailHash" TEXT NOT NULL,
ADD COLUMN     "emailIV" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "OTP_emailHash_key" ON "OTP"("emailHash");

-- CreateIndex
CREATE UNIQUE INDEX "OTP_emailHash_otp_key" ON "OTP"("emailHash", "otp");
