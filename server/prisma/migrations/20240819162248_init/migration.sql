-- CreateTable
CREATE TABLE "Message" (
    "id" BIGSERIAL NOT NULL,
    "chat_id" INTEGER NOT NULL,
    "nickname" TEXT NOT NULL,
    "message" BYTEA NOT NULL,
    "skey" BIGINT NOT NULL,
    "algo" INTEGER NOT NULL DEFAULT 0,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Message_chat_id_skey_idx" ON "Message"("chat_id", "skey");
