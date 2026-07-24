ALTER TABLE "Order"
ADD COLUMN "customerEmailSentAt" TIMESTAMP(3),
ADD COLUMN "adminEmailSentAt" TIMESTAMP(3),
ADD COLUMN "customerEmailId" TEXT,
ADD COLUMN "adminEmailId" TEXT,
ADD COLUMN "emailLastError" TEXT;