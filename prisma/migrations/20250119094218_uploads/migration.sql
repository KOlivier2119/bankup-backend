/*
  Warnings:

  - You are about to drop the column `idImageUrl` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `profileImageUrl` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[idImageId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[profileImageId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `idImageId` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profileImageId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UploadType" AS ENUM ('image', 'video');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "idImageUrl",
DROP COLUMN "profileImageUrl",
ADD COLUMN     "idImageId" INTEGER NOT NULL,
ADD COLUMN     "profileImageId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Uploads" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "type" "UploadType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Uploads_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_idImageId_key" ON "User"("idImageId");

-- CreateIndex
CREATE UNIQUE INDEX "User_profileImageId_key" ON "User"("profileImageId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_idImageId_fkey" FOREIGN KEY ("idImageId") REFERENCES "Uploads"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_profileImageId_fkey" FOREIGN KEY ("profileImageId") REFERENCES "Uploads"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
