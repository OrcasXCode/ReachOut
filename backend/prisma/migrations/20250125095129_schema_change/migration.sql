/*
  Warnings:

  - You are about to drop the column `category` on the `Business` table. All the data in the column will be lost.
  - You are about to drop the column `category` on the `SubCategory` table. All the data in the column will be lost.
  - You are about to drop the `_BusinessToSubCategory` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `categoryId` to the `SubCategory` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_BusinessToSubCategory" DROP CONSTRAINT "_BusinessToSubCategory_A_fkey";

-- DropForeignKey
ALTER TABLE "_BusinessToSubCategory" DROP CONSTRAINT "_BusinessToSubCategory_B_fkey";

-- AlterTable
ALTER TABLE "Business" DROP COLUMN "category";

-- AlterTable
ALTER TABLE "SubCategory" DROP COLUMN "category",
ADD COLUMN     "categoryId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "_BusinessToSubCategory";

-- DropEnum
DROP TYPE "AllCategory";

-- DropEnum
DROP TYPE "ArtSubCategory";

-- DropEnum
DROP TYPE "AutomobileSubCategory";

-- DropEnum
DROP TYPE "BeautySubCategory";

-- DropEnum
DROP TYPE "EducationSubCategory";

-- DropEnum
DROP TYPE "EntertainmentSubCategory";

-- DropEnum
DROP TYPE "EventsSubCategory";

-- DropEnum
DROP TYPE "FashionSubCategory";

-- DropEnum
DROP TYPE "FinanceSubCategory";

-- DropEnum
DROP TYPE "FitnessSubCategory";

-- DropEnum
DROP TYPE "FoodSubCategory";

-- DropEnum
DROP TYPE "HealthSubCategory";

-- DropEnum
DROP TYPE "HomeServicesSubCategory";

-- DropEnum
DROP TYPE "HospitalitySubCategory";

-- DropEnum
DROP TYPE "MediaSubCategory";

-- DropEnum
DROP TYPE "OtherSubCategory";

-- DropEnum
DROP TYPE "PetsSubCategory";

-- DropEnum
DROP TYPE "RealEstateSubCategory";

-- DropEnum
DROP TYPE "RetailSubCategory";

-- DropEnum
DROP TYPE "SportsSubCategory";

-- DropEnum
DROP TYPE "TechnologySubCategory";

-- DropEnum
DROP TYPE "TravelSubCategory";

-- DropEnum
DROP TYPE "WellnessSubCategory";

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BusinessSubCategory" (
    "businessId" INTEGER NOT NULL,
    "subCategoryId" INTEGER NOT NULL,

    CONSTRAINT "BusinessSubCategory_pkey" PRIMARY KEY ("businessId","subCategoryId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- AddForeignKey
ALTER TABLE "Business" ADD CONSTRAINT "Business_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubCategory" ADD CONSTRAINT "SubCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusinessSubCategory" ADD CONSTRAINT "BusinessSubCategory_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusinessSubCategory" ADD CONSTRAINT "BusinessSubCategory_subCategoryId_fkey" FOREIGN KEY ("subCategoryId") REFERENCES "SubCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
