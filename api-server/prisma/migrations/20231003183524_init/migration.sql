-- CreateEnum
CREATE TYPE "Unit" AS ENUM ('OZ', 'FLOZ', 'LB', 'G', 'C', 'TSP', 'TBSP', 'BUNCH', 'CAN', 'BAG', 'CONTAINER', 'OTHER');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Recipe" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "prepTime" INTEGER,
    "cookTime" INTEGER,
    "authorId" TEXT NOT NULL,
    "favoritedById" TEXT NOT NULL,

    CONSTRAINT "Recipe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Note" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "recipeId" TEXT,

    CONSTRAINT "Note_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProcedureGroup" (
    "id" TEXT NOT NULL,
    "groupTitle" TEXT NOT NULL DEFAULT '',
    "description" TEXT,
    "recipeId" TEXT NOT NULL,

    CONSTRAINT "ProcedureGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProcedureStep" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "timer" INTEGER NOT NULL,
    "procedureGroupId" TEXT NOT NULL,

    CONSTRAINT "ProcedureStep_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IngredientGroup" (
    "id" TEXT NOT NULL,
    "groupTitle" TEXT NOT NULL DEFAULT '',
    "description" TEXT,
    "recipeId" TEXT NOT NULL,

    CONSTRAINT "IngredientGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ingredient" (
    "id" TEXT NOT NULL,
    "qty" INTEGER,
    "description" TEXT NOT NULL,
    "uom" "Unit",
    "ingredientGroupId" TEXT NOT NULL,

    CONSTRAINT "Ingredient_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Recipe_authorId_title_key" ON "Recipe"("authorId", "title");

-- CreateIndex
CREATE UNIQUE INDEX "ProcedureGroup_groupTitle_recipeId_key" ON "ProcedureGroup"("groupTitle", "recipeId");

-- CreateIndex
CREATE UNIQUE INDEX "IngredientGroup_groupTitle_recipeId_key" ON "IngredientGroup"("groupTitle", "recipeId");

-- AddForeignKey
ALTER TABLE "Recipe" ADD CONSTRAINT "Recipe_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recipe" ADD CONSTRAINT "Recipe_favoritedById_fkey" FOREIGN KEY ("favoritedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProcedureGroup" ADD CONSTRAINT "ProcedureGroup_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProcedureStep" ADD CONSTRAINT "ProcedureStep_procedureGroupId_fkey" FOREIGN KEY ("procedureGroupId") REFERENCES "ProcedureGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IngredientGroup" ADD CONSTRAINT "IngredientGroup_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ingredient" ADD CONSTRAINT "Ingredient_ingredientGroupId_fkey" FOREIGN KEY ("ingredientGroupId") REFERENCES "IngredientGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
