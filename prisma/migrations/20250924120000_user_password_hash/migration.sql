-- AlterTable
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "passwordHash" TEXT;

-- Align with Prisma schema (OAuth users may have no email yet)
ALTER TABLE "User" ALTER COLUMN "email" DROP NOT NULL;
