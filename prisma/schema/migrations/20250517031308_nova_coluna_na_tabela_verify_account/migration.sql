/*
  Warnings:

  - Added the required column `expired` to the `VerifyAccountToken` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "VerifyAccountToken" ADD COLUMN     "expired" BOOLEAN NOT NULL;
