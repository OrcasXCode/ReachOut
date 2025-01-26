-- DropIndex
DROP INDEX "Category_name_key";

-- AlterTable
ALTER TABLE "Business" ADD COLUMN     "dislikes" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "likes" INTEGER NOT NULL DEFAULT 0;
