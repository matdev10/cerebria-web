-- CreateTable
CREATE TABLE "geo_countries" (
    "id" TEXT NOT NULL,
    "isoCode" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "geo_countries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "geo_regions" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "countryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "geo_regions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "geo_provinces" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "regionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "geo_provinces_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "geo_communes" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "regionId" TEXT NOT NULL,
    "provinceId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "geo_communes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "geo_countries_isoCode_key" ON "geo_countries"("isoCode");

-- CreateIndex
CREATE UNIQUE INDEX "geo_regions_countryId_code_key" ON "geo_regions"("countryId", "code");

-- CreateIndex
CREATE UNIQUE INDEX "geo_provinces_regionId_code_key" ON "geo_provinces"("regionId", "code");

-- CreateIndex
CREATE UNIQUE INDEX "geo_communes_provinceId_code_key" ON "geo_communes"("provinceId", "code");

-- AddForeignKey
ALTER TABLE "geo_regions" ADD CONSTRAINT "geo_regions_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "geo_countries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "geo_provinces" ADD CONSTRAINT "geo_provinces_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "geo_regions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "geo_communes" ADD CONSTRAINT "geo_communes_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "geo_regions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "geo_communes" ADD CONSTRAINT "geo_communes_provinceId_fkey" FOREIGN KEY ("provinceId") REFERENCES "geo_provinces"("id") ON DELETE CASCADE ON UPDATE CASCADE;
