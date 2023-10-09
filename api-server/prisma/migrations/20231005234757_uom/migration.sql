/*
  Warnings:

  - You are about to drop the `Unit` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Ingredient" DROP CONSTRAINT "Ingredient_unitId_fkey";

-- AlterTable
ALTER TABLE "Ingredient" ADD COLUMN     "uom" TEXT;

-- DropTable
DROP TABLE "Unit";
