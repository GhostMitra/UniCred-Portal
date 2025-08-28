-- AlterTable
ALTER TABLE "Credential" ADD COLUMN     "recruiterApproved" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "studentAccepted" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "Block" (
    "id" TEXT NOT NULL,
    "height" INTEGER NOT NULL,
    "previousHash" TEXT NOT NULL,
    "payloadHash" TEXT NOT NULL,
    "nonce" INTEGER NOT NULL,
    "hash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Block_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Block_height_key" ON "Block"("height");

-- CreateIndex
CREATE UNIQUE INDEX "Block_hash_key" ON "Block"("hash");
