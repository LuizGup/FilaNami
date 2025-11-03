-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('ADMIN', 'DEFAULT_USER');

-- CreateTable
CREATE TABLE "USUARIOS" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "userType" "UserType" DEFAULT 'DEFAULT_USER',

    CONSTRAINT "USUARIOS_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "USUARIOS_email_key" ON "USUARIOS"("email");
