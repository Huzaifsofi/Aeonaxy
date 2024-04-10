/*
  Warnings:

  - Added the required column `like` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `categories` on the `Course` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `level` on the `Course` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Categories" AS ENUM ('Development', 'Design', 'Business');

-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "like" INTEGER NOT NULL,
DROP COLUMN "categories",
ADD COLUMN     "categories" "Categories" NOT NULL,
DROP COLUMN "level",
ADD COLUMN     "level" "Level" NOT NULL;
