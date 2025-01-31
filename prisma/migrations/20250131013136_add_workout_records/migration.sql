/*
  Warnings:

  - You are about to drop the column `createdAt` on the `WorkoutRecord` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `WorkoutRecord` table. All the data in the column will be lost.
  - Added the required column `category` to the `WorkoutRecord` table without a default value. This is not possible if the table is not empty.
  - Added the required column `memo` to the `WorkoutRecord` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "WorkoutRecord" DROP COLUMN "createdAt",
DROP COLUMN "userId",
ADD COLUMN     "category" TEXT NOT NULL,
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "memo" TEXT NOT NULL;
