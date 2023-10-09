-- DropForeignKey
ALTER TABLE "Recipe" DROP CONSTRAINT "Recipe_favoritedById_fkey";

-- AlterTable
ALTER TABLE "Recipe" ALTER COLUMN "favoritedById" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Recipe" ADD CONSTRAINT "Recipe_favoritedById_fkey" FOREIGN KEY ("favoritedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
