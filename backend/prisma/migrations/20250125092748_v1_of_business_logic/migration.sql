/*
  Warnings:

  - You are about to drop the column `contactDetails` on the `Business` table. All the data in the column will be lost.
  - You are about to drop the column `subCategory` on the `Business` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[businessEmail]` on the table `Business` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phoneNumber]` on the table `Business` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,address]` on the table `Business` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `businessEmail` to the `Business` table without a default value. This is not possible if the table is not empty.
  - Added the required column `categoryId` to the `Business` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phoneNumber` to the `Business` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `category` on the `Business` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "AllCategory" AS ENUM ('BEAUTY', 'FOOD', 'HEALTH', 'EDUCATION', 'ENTERTAINMENT', 'AUTOMOBILE', 'HOME_SERVICES', 'FITNESS', 'TECHNOLOGY', 'FASHION', 'TRAVEL', 'EVENTS', 'ART', 'PETS', 'FINANCE', 'REAL_ESTATE', 'HOSPITALITY', 'RETAIL', 'WELLNESS', 'SPORTS', 'MEDIA', 'OTHER');

-- CreateEnum
CREATE TYPE "BeautySubCategory" AS ENUM ('HAIR_CARE', 'SKIN_CARE', 'MAKEUP', 'NAILS', 'SPA', 'MEHNDI', 'WEDDING_SERVICES', 'SALON');

-- CreateEnum
CREATE TYPE "FoodSubCategory" AS ENUM ('RESTAURANT', 'CAFE', 'BAKERY', 'FOOD_TRUCK', 'CATERING', 'ICE_CREAM', 'FAST_FOOD', 'VEGETARIAN', 'NON_VEGETARIAN', 'VEGAN', 'JUICE_BAR');

-- CreateEnum
CREATE TYPE "HealthSubCategory" AS ENUM ('PHARMACY', 'DOCTOR', 'DENTIST', 'AYURVEDA', 'HOMEOPATHY', 'NUTRITIONIST', 'WELLNESS_CENTER', 'ALTERNATIVE_MEDICINE', 'CLINIC');

-- CreateEnum
CREATE TYPE "EducationSubCategory" AS ENUM ('SCHOOL', 'TUITION', 'COACHING', 'LANGUAGE_CLASSES', 'MUSIC_CLASSES', 'DANCE_CLASSES', 'SPORTS_TRAINING', 'COMPUTER_TRAINING', 'ONLINE_COURSES');

-- CreateEnum
CREATE TYPE "EntertainmentSubCategory" AS ENUM ('CINEMA', 'THEATER', 'MUSIC_CONCERT', 'COMEDY_SHOW', 'NIGHT_CLUB', 'ART_GALLERY', 'STADIUM', 'PARK', 'KARAOKE');

-- CreateEnum
CREATE TYPE "AutomobileSubCategory" AS ENUM ('CAR_RENTAL', 'BIKE_RENTAL', 'CAR_SERVICE', 'CAR_WASH', 'CAR_ACCESSORIES', 'CAR_SALES');

-- CreateEnum
CREATE TYPE "HomeServicesSubCategory" AS ENUM ('PLUMBING', 'ELECTRICAL', 'CLEANING', 'PAINTING', 'CARPENTRY', 'MOVING', 'INTERIOR_DESIGN', 'LANDSCAPING');

-- CreateEnum
CREATE TYPE "FitnessSubCategory" AS ENUM ('GYM', 'YOGA', 'PILATES', 'DANCE_FITNESS', 'ZUMBA', 'PERSONAL_TRAINER');

-- CreateEnum
CREATE TYPE "TechnologySubCategory" AS ENUM ('SOFTWARE_DEVELOPMENT', 'WEB_DEVELOPMENT', 'MOBILE_APP_DEVELOPMENT', 'IT_SUPPORT', 'DIGITAL_MARKETING', 'CYBER_SECURITY', 'DATA_ANALYTICS');

-- CreateEnum
CREATE TYPE "FashionSubCategory" AS ENUM ('CLOTHING', 'FOOTWEAR', 'ACCESSORIES', 'JEWELRY', 'HAIR_ACCESSORIES');

-- CreateEnum
CREATE TYPE "TravelSubCategory" AS ENUM ('FLIGHT_BOOKING', 'HOTEL_BOOKING', 'TOUR_GUIDE', 'TRAVEL_AGENCY', 'CAR_RENTAL');

-- CreateEnum
CREATE TYPE "EventsSubCategory" AS ENUM ('WEDDING', 'BIRTHDAY_PARTY', 'CORPORATE_EVENTS', 'CONCERTS', 'EXHIBITIONS', 'CONFERENCES', 'SEMINARS');

-- CreateEnum
CREATE TYPE "ArtSubCategory" AS ENUM ('PAINTING', 'SCULPTURE', 'PHOTOGRAPHY', 'DIGITAL_ART', 'ART_GALLERY');

-- CreateEnum
CREATE TYPE "PetsSubCategory" AS ENUM ('PET_SHOP', 'VETERINARY_CLINIC', 'PET_SITTING', 'PET_TRAINING', 'PET_ACCESSORIES', 'PET_BOARDING');

-- CreateEnum
CREATE TYPE "FinanceSubCategory" AS ENUM ('ACCOUNTING', 'TAX_SERVICES', 'INSURANCE', 'LOANS', 'INVESTMENT_ADVISORY', 'WEALTH_MANAGEMENT', 'FINANCIAL_PLANNING');

-- CreateEnum
CREATE TYPE "RealEstateSubCategory" AS ENUM ('PROPERTY_SALE', 'PROPERTY_RENTAL', 'PROPERTY_MANAGEMENT', 'INTERIOR_DESIGN', 'CONSTRUCTION', 'ARCHITECTURE');

-- CreateEnum
CREATE TYPE "HospitalitySubCategory" AS ENUM ('HOTEL', 'RESORT', 'BED_AND_BREAKFAST', 'GUESTHOUSE', 'HOMESTAY');

-- CreateEnum
CREATE TYPE "RetailSubCategory" AS ENUM ('ELECTRONICS', 'CLOTHING', 'FURNITURE', 'HOME_DECOR', 'BOOKS', 'TOYS', 'GROCERY', 'STATIONERY');

-- CreateEnum
CREATE TYPE "WellnessSubCategory" AS ENUM ('MASSAGE', 'SPA', 'MEDIATION', 'ACUPUNCTURE', 'AROMATHERAPY');

-- CreateEnum
CREATE TYPE "SportsSubCategory" AS ENUM ('GYM', 'SPORTS_EQUIPMENT', 'COACHING', 'SWIMMING_POOL', 'TENNIS_COURT', 'CRICKET_PITCH');

-- CreateEnum
CREATE TYPE "MediaSubCategory" AS ENUM ('RADIO', 'TELEVISION', 'PRINT', 'SOCIAL_MEDIA', 'VIDEO_PRODUCTION');

-- CreateEnum
CREATE TYPE "OtherSubCategory" AS ENUM ('CUSTOM_SERVICE', 'EVENT_ORGANIZATION', 'OTHERS');

-- AlterTable
ALTER TABLE "Business" DROP COLUMN "contactDetails",
DROP COLUMN "subCategory",
ADD COLUMN     "businessEmail" TEXT NOT NULL,
ADD COLUMN     "categoryId" INTEGER NOT NULL,
ADD COLUMN     "phoneNumber" TEXT NOT NULL,
DROP COLUMN "category",
ADD COLUMN     "category" "AllCategory" NOT NULL;

-- CreateTable
CREATE TABLE "SubCategory" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "category" "AllCategory" NOT NULL,

    CONSTRAINT "SubCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_BusinessToSubCategory" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_BusinessToSubCategory_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_BusinessToSubCategory_B_index" ON "_BusinessToSubCategory"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Business_businessEmail_key" ON "Business"("businessEmail");

-- CreateIndex
CREATE UNIQUE INDEX "Business_phoneNumber_key" ON "Business"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Business_name_address_key" ON "Business"("name", "address");

-- AddForeignKey
ALTER TABLE "_BusinessToSubCategory" ADD CONSTRAINT "_BusinessToSubCategory_A_fkey" FOREIGN KEY ("A") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BusinessToSubCategory" ADD CONSTRAINT "_BusinessToSubCategory_B_fkey" FOREIGN KEY ("B") REFERENCES "SubCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
