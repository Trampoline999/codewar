/*
  Warnings:

  - Added the required column `codeSnippets` to the `Problem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `referenceSolutions` to the `Problem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `testcases` to the `Problem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Problem" ADD COLUMN     "codeSnippets" JSONB NOT NULL,
ADD COLUMN     "referenceSolutions" JSONB NOT NULL,
ADD COLUMN     "testcases" JSONB NOT NULL;
