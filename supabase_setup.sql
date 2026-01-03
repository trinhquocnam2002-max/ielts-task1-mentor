-- Copy and paste this into Supabase SQL Editor to create your tables

-- Create IELTS_Scores table
CREATE TABLE IF NOT EXISTS "IELTS_Scores" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "essay_content" TEXT NOT NULL,
    "band_score" TEXT NOT NULL,
    "feedback_json" TEXT NOT NULL,

    CONSTRAINT "IELTS_Scores_pkey" PRIMARY KEY ("id")
);

-- Create EssayHistory table
CREATE TABLE IF NOT EXISTS "EssayHistory" (
    "id" TEXT NOT NULL,
    "essayText" TEXT NOT NULL,
    "bandScore" TEXT NOT NULL,
    "feedback" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EssayHistory_pkey" PRIMARY KEY ("id")
);
