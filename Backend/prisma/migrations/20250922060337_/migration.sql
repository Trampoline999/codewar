/*
  Warnings:

  - You are about to drop the column `Description` on the `Playlist` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Playlist" DROP COLUMN "Description",
ADD COLUMN     "description" TEXT;
