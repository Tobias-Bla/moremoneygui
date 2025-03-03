-- CreateTable
CREATE TABLE "UserStock" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "timestamp" TEXT NOT NULL,

    CONSTRAINT "UserStock_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserStock_email_symbol_key" ON "UserStock"("email", "symbol");
