-- CreateEnum
CREATE TYPE "Prioridade" AS ENUM ('COMUM', 'PRIORIDADE', 'PLUSEIGHTY');

-- CreateEnum
CREATE TYPE "StatusSenha" AS ENUM ('AGUARDANDO', 'EM_ATENDIMENTO', 'EM_SERVICO', 'CONCLUIDO');

-- CreateTable
CREATE TABLE "GUICHE" (
    "id_guiche" SERIAL NOT NULL,
    "numero_guiche" INTEGER NOT NULL,
    "senha" TEXT NOT NULL,
    "id_setor" INTEGER NOT NULL,

    CONSTRAINT "GUICHE_pkey" PRIMARY KEY ("id_guiche")
);

-- CreateTable
CREATE TABLE "SETORES" (
    "id_setor" SERIAL NOT NULL,
    "setor" TEXT NOT NULL,

    CONSTRAINT "SETORES_pkey" PRIMARY KEY ("id_setor")
);

-- CreateTable
CREATE TABLE "SENHAS" (
    "id_senha" SERIAL NOT NULL,
    "id_guiche" INTEGER,
    "setor_destino" TEXT NOT NULL,
    "setor_atual" TEXT NOT NULL DEFAULT 'Atendimento',
    "senha" TEXT NOT NULL,
    "prioridade" "Prioridade" NOT NULL,
    "data_emissao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_conclusao" TIMESTAMP(3),
    "status" "StatusSenha" NOT NULL,

    CONSTRAINT "SENHAS_pkey" PRIMARY KEY ("id_senha")
);

-- CreateTable
CREATE TABLE "HISTORICO" (
    "id_historico" SERIAL NOT NULL,
    "id_guiche" INTEGER NOT NULL,
    "id_senhas" INTEGER NOT NULL,

    CONSTRAINT "HISTORICO_pkey" PRIMARY KEY ("id_historico")
);

-- AddForeignKey
ALTER TABLE "GUICHE" ADD CONSTRAINT "GUICHE_id_setor_fkey" FOREIGN KEY ("id_setor") REFERENCES "SETORES"("id_setor") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SENHAS" ADD CONSTRAINT "SENHAS_id_guiche_fkey" FOREIGN KEY ("id_guiche") REFERENCES "GUICHE"("id_guiche") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HISTORICO" ADD CONSTRAINT "HISTORICO_id_guiche_fkey" FOREIGN KEY ("id_guiche") REFERENCES "GUICHE"("id_guiche") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HISTORICO" ADD CONSTRAINT "HISTORICO_id_senhas_fkey" FOREIGN KEY ("id_senhas") REFERENCES "SENHAS"("id_senha") ON DELETE RESTRICT ON UPDATE CASCADE;
