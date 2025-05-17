/*
  Warnings:

  - You are about to drop the column `verifyToken` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "verifyToken";

-- CreateTable
CREATE TABLE "VerifyAccountToken" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "VerifyAccountToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "VerifyAccountToken_token_key" ON "VerifyAccountToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerifyAccountToken_userId_key" ON "VerifyAccountToken"("userId");

-- AddForeignKey
ALTER TABLE "VerifyAccountToken" ADD CONSTRAINT "VerifyAccountToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
