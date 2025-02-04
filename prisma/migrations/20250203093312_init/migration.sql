/*
  Warnings:

  - The primary key for the `WorkoutRecord` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "WorkoutRecord" DROP CONSTRAINT "WorkoutRecord_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "WorkoutRecord_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "WorkoutRecord_id_seq";
