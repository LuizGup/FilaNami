// ./src/services/senha.service.js

const prisma = require('../prisma'); 
const { Prioridade, StatusSenha } = require('@prisma/client');

class SenhaService {

  /**
   * REQUISITO 1: Criar nova senha
   */
  async create(data) {
    // -> [MUDANÇA] 'setor_destino' agora é 'setorDestino'
    const { setorDestino, prioridade } = data;

    let prefixo;
    switch (prioridade) {
      case Prioridade.PRIORIDADE: prefixo = 'P'; break;
      case Prioridade.PLUSEIGHTY: prefixo = 'E'; break;
      case Prioridade.COMUM:
      default: prefixo = 'C'; break;
    }

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const ultimaSenhaDoDia = await prisma.senha.findFirst({
      where: {
        prioridade: prioridade,
        // -> [MUDANÇA] 'data_emissao' agora é 'dataEmissao'
        dataEmissao: { gte: hoje },
      },
      // -> [MUDANÇA] 'data_emissao' agora é 'dataEmissao'
      orderBy: { dataEmissao: 'desc' },
    });

    let novoNumero = 1;
    if (ultimaSenhaDoDia) {
      const numeroAnterior = parseInt(ultimaSenhaDoDia.senha.substring(1));
      novoNumero = numeroAnterior + 1;
    }

    const numeroFormatado = novoNumero.toString().padStart(3, '0');
    const novaSenhaStr = `${prefixo}${numeroFormatado}`;

    return prisma.senha.create({
      data: {
        // -> [MUDANÇA] 'setor_destino' agora é 'setorDestino'
        setorDestino: setorDestino,
        prioridade: prioridade,
        senha: novaSenhaStr,
        status: StatusSenha.AGUARDANDO,
        // -> [MUDANÇA] 'setor_atual' agora é 'setorAtual'
        // O schema já tem um default, mas setar aqui garante a regra de negócio
        setorAtual: setorDestino, 
      },
    });
  }

  /**
   * REQUISITO 2: Chamar próxima senha
   */
  // -> [MUDANÇA] 'id_guiche' agora é 'idGuiche'
  async callNext(idGuiche, setor) {
    
    return prisma.$transaction(async (tx) => {
      
      const proximaSenha = await tx.senha.findFirst({
        where: {
          status: StatusSenha.AGUARDANDO,
          // -> [MUDANÇA] 'setor_atual' agora é 'setorAtual'
          setorAtual: setor,
        },
        orderBy: [
          { prioridade: 'desc' }, 
          // -> [MUDANÇA] 'data_emissao' agora é 'dataEmissao'
          { dataEmissao: 'asc' },
        ],
      });

      if (!proximaSenha) {
        throw new Error('Nenhuma senha aguardando neste setor.');
      }

      const senhaChamada = await tx.senha.update({
        // -> [MUDANÇA] 'id_senha' agora é 'idSenha'
        where: { idSenha: proximaSenha.idSenha },
        data: {
          status: StatusSenha.EM_ATENDIMENTO,
          // -> [MUDANÇA] 'id_guiche' agora é 'idGuicheAtendente'
          idGuicheAtendente: idGuiche,
        },
        // -> [MUDANÇA] 'guiche' (relação) agora é 'guicheAtendente'
        include: { guicheAtendente: true },
      });

      await tx.historico.create({
        data: {
          // -> [MUDANÇA] 'id_guiche' agora é 'idGuiche'
          idGuiche: idGuiche,
          // -> [MUDANÇA] 'id_senha' agora é 'idSenha'
          idSenha: proximaSenha.idSenha, 
        }
      });

      return senhaChamada;
    });
  }

  /**
   * Concluir um atendimento
   */
  async complete(id_senha) {
    return prisma.senha.update({
      // -> [MUDANÇA] 'id_senha' agora é 'idSenha'
      where: { idSenha: Number(id_senha) },
      data: {
        status: StatusSenha.CONCLUIDO,
        // -> [MUDANÇA] 'data_conclusao' agora é 'dataConclusao'
        dataConclusao: new Date(),
      },
    });
  }

  /**
   * Buscar por ID
   */
  async getById(id_senha) {
    return prisma.senha.findUnique({
      // -> [MUDANÇA] 'id_senha' agora é 'idSenha'
      where: { idSenha: Number(id_senha) },
      // -> [MUDANÇA] 'guiche' (relação) agora é 'guicheAtendente'
      include: { guicheAtendente: true },
    });
  }

  /**
   * Listar todos com filtros
   */
  async getAll(status, setor) {
    const where = {};
    if (status) where.status = status;
    // -> [MUDANÇA] 'setor_atual' agora é 'setorAtual'
    if (setor) where.setorAtual = setor;

    return prisma.senha.findMany({
      where: where,
      // -> [MUDANÇA] 'data_emissao' agora é 'dataEmissao'
      orderBy: { dataEmissao: 'desc' },
    });
  }
}

module.exports = new SenhaService();