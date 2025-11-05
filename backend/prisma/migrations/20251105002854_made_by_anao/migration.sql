/*
  Warnings:

  - You are about to drop the `ADMIN` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "SENHAS" ALTER COLUMN "setor_atual" SET DEFAULT 'Atendimento';

-- DropTable
DROP TABLE "public"."ADMIN";
