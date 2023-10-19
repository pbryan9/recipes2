/*
  Warnings:

  - You are about to drop the `Favorites` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Favorites" DROP CONSTRAINT "Favorites_recipeId_fkey";

-- DropForeignKey
ALTER TABLE "Favorites" DROP CONSTRAINT "Favorites_userId_fkey";

-- DropTable
DROP TABLE "Favorites";

-- CreateTable
CREATE TABLE "_FavoritedRecipes" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_FavoritedRecipes_AB_unique" ON "_FavoritedRecipes"("A", "B");

-- CreateIndex
CREATE INDEX "_FavoritedRecipes_B_index" ON "_FavoritedRecipes"("B");

-- AddForeignKey
ALTER TABLE "_FavoritedRecipes" ADD CONSTRAINT "_FavoritedRecipes_A_fkey" FOREIGN KEY ("A") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FavoritedRecipes" ADD CONSTRAINT "_FavoritedRecipes_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
