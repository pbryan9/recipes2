/*
  Warnings:

  - The `tagGroup` column on the `Tag` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Tag" DROP COLUMN "tagGroup",
ADD COLUMN     "tagGroup" TEXT;

-- DropEnum
DROP TYPE "TagGroup";
