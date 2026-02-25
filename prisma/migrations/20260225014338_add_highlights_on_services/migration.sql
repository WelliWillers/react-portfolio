-- AlterTable
ALTER TABLE "Service" ADD COLUMN     "highlights" TEXT[] DEFAULT ARRAY[]::TEXT[];
