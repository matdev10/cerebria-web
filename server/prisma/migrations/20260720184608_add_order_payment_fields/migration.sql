/*
  Warnings:

  - The `paymentProvider` column on the `Order` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[paymentPreferenceId]` on the table `Order` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[paymentId]` on the table `Order` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `Customer` table without a default value. This is not possible if the table is not empty.
  - Made the column `shippingAddress` on table `Order` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `productName` to the `OrderItem` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PaymentProvider" AS ENUM ('MERCADO_PAGO');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "OrderStatus" ADD VALUE 'PAYMENT_REJECTED';
ALTER TYPE "OrderStatus" ADD VALUE 'REFUNDED';

-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_orderId_fkey";

-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "confirmationSent" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'CLP',
ADD COLUMN     "paidAt" TIMESTAMP(3),
ADD COLUMN     "paymentLink" TEXT,
ADD COLUMN     "paymentPreferenceId" TEXT,
ADD COLUMN     "paymentStatus" TEXT,
ADD COLUMN     "paymentStatusDetail" TEXT,
ADD COLUMN     "shippingCommuneId" TEXT,
ADD COLUMN     "shippingNotes" TEXT,
ADD COLUMN     "shippingProvince" TEXT,
ADD COLUMN     "shippingProvinceId" TEXT,
ADD COLUMN     "shippingRegion" TEXT,
ADD COLUMN     "shippingRegionId" TEXT,
ADD COLUMN     "stockUpdated" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "shippingAddress" SET NOT NULL,
DROP COLUMN "paymentProvider",
ADD COLUMN     "paymentProvider" "PaymentProvider" NOT NULL DEFAULT 'MERCADO_PAGO';

-- AlterTable
ALTER TABLE "OrderItem" ADD COLUMN     "productImageUrl" TEXT,
ADD COLUMN     "productName" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Customer_email_idx" ON "Customer"("email");

-- CreateIndex
CREATE INDEX "Customer_phone_idx" ON "Customer"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Order_paymentPreferenceId_key" ON "Order"("paymentPreferenceId");

-- CreateIndex
CREATE UNIQUE INDEX "Order_paymentId_key" ON "Order"("paymentId");

-- CreateIndex
CREATE INDEX "Order_customerId_idx" ON "Order"("customerId");

-- CreateIndex
CREATE INDEX "Order_status_idx" ON "Order"("status");

-- CreateIndex
CREATE INDEX "Order_createdAt_idx" ON "Order"("createdAt");

-- CreateIndex
CREATE INDEX "OrderItem_orderId_idx" ON "OrderItem"("orderId");

-- CreateIndex
CREATE INDEX "OrderItem_productId_idx" ON "OrderItem"("productId");

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
