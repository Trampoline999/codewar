/*
  Warnings:

  - You are about to drop the column `submmissionId` on the `TestCasesResult` table. All the data in the column will be lost.
  - Added the required column `submissionId` to the `TestCasesResult` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "TestCasesResult" DROP CONSTRAINT "TestCasesResult_submmissionId_fkey";

-- DropIndex
DROP INDEX "TestCasesResult_submmissionId_idx";

-- AlterTable
ALTER TABLE "TestCasesResult" DROP COLUMN "submmissionId",
ADD COLUMN     "submissionId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "TestCasesResult_submissionId_idx" ON "TestCasesResult"("submissionId");

-- AddForeignKey
ALTER TABLE "TestCasesResult" ADD CONSTRAINT "TestCasesResult_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "Submission"("id") ON DELETE CASCADE ON UPDATE CASCADE;
