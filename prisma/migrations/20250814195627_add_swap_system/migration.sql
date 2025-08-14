-- CreateEnum
CREATE TYPE "public"."SwapStatus" AS ENUM ('OPEN', 'ACCEPTED', 'CANCELLED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "public"."OfferStatus" AS ENUM ('PENDING', 'DECLINED', 'ACCEPTED', 'CANCELLED', 'TIMEOUT');

-- CreateTable
CREATE TABLE "public"."swap_requests" (
    "id" TEXT NOT NULL,
    "requester_id" TEXT NOT NULL,
    "assignment_id" TEXT NOT NULL,
    "equivalence_code" TEXT,
    "status" "public"."SwapStatus" NOT NULL DEFAULT 'OPEN',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "swap_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."swap_offers" (
    "id" TEXT NOT NULL,
    "swap_request_id" TEXT NOT NULL,
    "target_user_id" TEXT NOT NULL,
    "target_assignment_id" TEXT,
    "status" "public"."OfferStatus" NOT NULL DEFAULT 'PENDING',
    "sentAt" TIMESTAMP(3),
    "respondedAt" TIMESTAMP(3),
    "response" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "swap_offers_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."swap_requests" ADD CONSTRAINT "swap_requests_requester_id_fkey" FOREIGN KEY ("requester_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."swap_requests" ADD CONSTRAINT "swap_requests_assignment_id_fkey" FOREIGN KEY ("assignment_id") REFERENCES "public"."schedule_assignments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."swap_offers" ADD CONSTRAINT "swap_offers_swap_request_id_fkey" FOREIGN KEY ("swap_request_id") REFERENCES "public"."swap_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."swap_offers" ADD CONSTRAINT "swap_offers_target_user_id_fkey" FOREIGN KEY ("target_user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."swap_offers" ADD CONSTRAINT "swap_offers_target_assignment_id_fkey" FOREIGN KEY ("target_assignment_id") REFERENCES "public"."schedule_assignments"("id") ON DELETE SET NULL ON UPDATE CASCADE;
