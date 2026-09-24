-- CreateEnum
CREATE TYPE "ProjectAddonType" AS ENUM ('TEXT', 'URL', 'IMAGE');

-- CreateTable
CREATE TABLE "ProjectAddon" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "type" "ProjectAddonType" NOT NULL,
    "sortOrder" INTEGER NOT NULL,
    "textContent" TEXT,
    "url" TEXT,
    "imageUrl" TEXT,
    "imagePathname" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectAddon_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ProjectAddon_projectId_sortOrder_idx" ON "ProjectAddon"("projectId", "sortOrder");

-- AddForeignKey
ALTER TABLE "ProjectAddon" ADD CONSTRAINT "ProjectAddon_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Backfill legacy Project.notes into TEXT add-ons
INSERT INTO "ProjectAddon" ("id", "projectId", "type", "sortOrder", "textContent", "createdAt", "updatedAt")
SELECT
    'c' || substr(md5(random()::text || "Project"."id" || clock_timestamp()::text), 1, 24),
    "Project"."id",
    'TEXT'::"ProjectAddonType",
    0,
    "Project"."notes",
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
FROM "Project"
WHERE "Project"."notes" IS NOT NULL AND length(trim("Project"."notes")) > 0;
