/*
  Warnings:

  - Added the required column `city` to the `Business` table without a default value. This is not possible if the table is not empty.
  - Added the required column `landmark` to the `Business` table without a default value. This is not possible if the table is not empty.
  - Added the required column `postalcode` to the `Business` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `Business` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Business" ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "landmark" TEXT NOT NULL,
ADD COLUMN     "postalcode" TEXT NOT NULL,
ADD COLUMN     "state" TEXT NOT NULL;
