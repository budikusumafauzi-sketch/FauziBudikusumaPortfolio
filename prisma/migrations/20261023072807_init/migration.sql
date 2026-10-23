-- CreateEnum
CREATE TYPE "KnowledgeCategory" AS ENUM ('PROFILE', 'EDUCATION', 'EXPERIENCE', 'SKILL', 'PROJECT', 'CERTIFICATION', 'GALLERY', 'CONTACT');

-- CreateTable
CREATE TABLE "KnowledgeRecord" (
    "id" TEXT NOT NULL,
    "category" "KnowledgeCategory" NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "keywords" TEXT[],
    "url" TEXT,
    "position" INTEGER NOT NULL DEFAULT 0,
    "source" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KnowledgeRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "KnowledgeRecord_category_position_idx" ON "KnowledgeRecord"("category", "position");

-- CreateIndex
CREATE INDEX "KnowledgeRecord_keywords_idx" ON "KnowledgeRecord" USING GIN ("keywords");
