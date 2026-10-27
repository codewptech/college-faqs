-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "mba_mentor" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "idempotencyKey" UUID NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "mobile" VARCHAR(16) NOT NULL,
    "email" VARCHAR(254),
    "details" JSONB NOT NULL,

    CONSTRAINT "mba_mentor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mba_predictor" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "idempotencyKey" UUID NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "mobile" VARCHAR(16) NOT NULL,
    "email" VARCHAR(254),
    "details" JSONB NOT NULL,

    CONSTRAINT "mba_predictor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mba_application" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "idempotencyKey" UUID NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "mobile" VARCHAR(16) NOT NULL,
    "email" VARCHAR(254) NOT NULL,
    "details" JSONB NOT NULL,

    CONSTRAINT "mba_application_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mba_start" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "idempotencyKey" UUID NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "mobile" VARCHAR(16) NOT NULL,
    "email" VARCHAR(254),
    "details" JSONB NOT NULL,

    CONSTRAINT "mba_start_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mba_gdpi" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "idempotencyKey" UUID NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "mobile" VARCHAR(16) NOT NULL,
    "email" VARCHAR(254) NOT NULL,
    "details" JSONB NOT NULL,

    CONSTRAINT "mba_gdpi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "engineering_enquiry" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "idempotencyKey" UUID NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "mobile" VARCHAR(16) NOT NULL,
    "email" VARCHAR(254),
    "details" JSONB NOT NULL,

    CONSTRAINT "engineering_enquiry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "study_abroad_profile" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "idempotencyKey" UUID NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "mobile" VARCHAR(16) NOT NULL,
    "email" VARCHAR(254),
    "details" JSONB NOT NULL,

    CONSTRAINT "study_abroad_profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "study_abroad_mentor" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "idempotencyKey" UUID NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "mobile" VARCHAR(16) NOT NULL,
    "email" VARCHAR(254),
    "details" JSONB NOT NULL,

    CONSTRAINT "study_abroad_mentor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "mba_mentor_idempotencyKey_key" ON "mba_mentor"("idempotencyKey");

-- CreateIndex
CREATE UNIQUE INDEX "mba_predictor_idempotencyKey_key" ON "mba_predictor"("idempotencyKey");

-- CreateIndex
CREATE UNIQUE INDEX "mba_application_idempotencyKey_key" ON "mba_application"("idempotencyKey");

-- CreateIndex
CREATE UNIQUE INDEX "mba_start_idempotencyKey_key" ON "mba_start"("idempotencyKey");

-- CreateIndex
CREATE UNIQUE INDEX "mba_gdpi_idempotencyKey_key" ON "mba_gdpi"("idempotencyKey");

-- CreateIndex
CREATE UNIQUE INDEX "engineering_enquiry_idempotencyKey_key" ON "engineering_enquiry"("idempotencyKey");

-- CreateIndex
CREATE UNIQUE INDEX "study_abroad_profile_idempotencyKey_key" ON "study_abroad_profile"("idempotencyKey");

-- CreateIndex
CREATE UNIQUE INDEX "study_abroad_mentor_idempotencyKey_key" ON "study_abroad_mentor"("idempotencyKey");

