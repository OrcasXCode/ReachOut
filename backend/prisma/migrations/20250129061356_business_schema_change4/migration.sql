/*
  Warnings:

  - A unique constraint covering the columns `[businessEmailHash]` on the table `Business` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phoneNumberHash]` on the table `Business` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `businessEmailHash` to the `Business` table without a default value. This is not possible if the table is not empty.
  - Added the required column `businessEmailIV` to the `Business` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ownerIdIV` to the `Business` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phoneNumberHash` to the `Business` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phoneNumberIV` to the `Business` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Business" ADD COLUMN     "businessEmailHash" TEXT NOT NULL,
ADD COLUMN     "businessEmailIV" TEXT NOT NULL,
ADD COLUMN     "ownerIdIV" TEXT NOT NULL,
ADD COLUMN     "phoneNumberHash" TEXT NOT NULL,
ADD COLUMN     "phoneNumberIV" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Business_businessEmailHash_key" ON "Business"("businessEmailHash");

-- CreateIndex
CREATE UNIQUE INDEX "Business_phoneNumberHash_key" ON "Business"("phoneNumberHash");
