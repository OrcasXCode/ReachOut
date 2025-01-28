/*
  Warnings:

  - The primary key for the `Business` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `BusinessSubCategory` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `BusinessTimings` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Category` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Media` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `OTP` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Report` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Review` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `SubCategory` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[phoneNumber]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Business" DROP CONSTRAINT "Business_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "Business" DROP CONSTRAINT "Business_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "BusinessSubCategory" DROP CONSTRAINT "BusinessSubCategory_businessId_fkey";

-- DropForeignKey
ALTER TABLE "BusinessSubCategory" DROP CONSTRAINT "BusinessSubCategory_subCategoryId_fkey";

-- DropForeignKey
ALTER TABLE "BusinessTimings" DROP CONSTRAINT "BusinessTimings_businessId_fkey";

-- DropForeignKey
ALTER TABLE "Media" DROP CONSTRAINT "Media_businessMediaId_fkey";

-- DropForeignKey
ALTER TABLE "Media" DROP CONSTRAINT "Media_customerMediaId_fkey";

-- DropForeignKey
ALTER TABLE "Report" DROP CONSTRAINT "Report_businessId_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_businessId_fkey";

-- DropForeignKey
ALTER TABLE "SubCategory" DROP CONSTRAINT "SubCategory_categoryId_fkey";

-- AlterTable
ALTER TABLE "Business" DROP CONSTRAINT "Business_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "ownerId" SET DATA TYPE TEXT,
ALTER COLUMN "categoryId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Business_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Business_id_seq";

-- AlterTable
ALTER TABLE "BusinessSubCategory" DROP CONSTRAINT "BusinessSubCategory_pkey",
ALTER COLUMN "businessId" SET DATA TYPE TEXT,
ALTER COLUMN "subCategoryId" SET DATA TYPE TEXT,
ADD CONSTRAINT "BusinessSubCategory_pkey" PRIMARY KEY ("businessId", "subCategoryId");

-- AlterTable
ALTER TABLE "BusinessTimings" DROP CONSTRAINT "BusinessTimings_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "businessId" SET DATA TYPE TEXT,
ADD CONSTRAINT "BusinessTimings_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "BusinessTimings_id_seq";

-- AlterTable
ALTER TABLE "Category" DROP CONSTRAINT "Category_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Category_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Category_id_seq";

-- AlterTable
ALTER TABLE "Media" DROP CONSTRAINT "Media_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "customerMediaId" SET DATA TYPE TEXT,
ALTER COLUMN "businessMediaId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Media_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Media_id_seq";

-- AlterTable
ALTER TABLE "OTP" DROP CONSTRAINT "OTP_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "OTP_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "OTP_id_seq";

-- AlterTable
ALTER TABLE "Report" DROP CONSTRAINT "Report_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "businessId" SET DATA TYPE TEXT,
ALTER COLUMN "userId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Report_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Report_id_seq";

-- AlterTable
ALTER TABLE "Review" DROP CONSTRAINT "Review_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "businessId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Review_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Review_id_seq";

-- AlterTable
ALTER TABLE "SubCategory" DROP CONSTRAINT "SubCategory_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "categoryId" SET DATA TYPE TEXT,
ADD CONSTRAINT "SubCategory_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "SubCategory_id_seq";

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "User_id_seq";

-- CreateIndex
CREATE UNIQUE INDEX "User_phoneNumber_key" ON "User"("phoneNumber");

-- AddForeignKey
ALTER TABLE "Business" ADD CONSTRAINT "Business_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Business" ADD CONSTRAINT "Business_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubCategory" ADD CONSTRAINT "SubCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusinessSubCategory" ADD CONSTRAINT "BusinessSubCategory_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusinessSubCategory" ADD CONSTRAINT "BusinessSubCategory_subCategoryId_fkey" FOREIGN KEY ("subCategoryId") REFERENCES "SubCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_businessMediaId_fkey" FOREIGN KEY ("businessMediaId") REFERENCES "Business"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_customerMediaId_fkey" FOREIGN KEY ("customerMediaId") REFERENCES "Review"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusinessTimings" ADD CONSTRAINT "BusinessTimings_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;
