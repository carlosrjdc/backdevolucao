const db = require("../models/index.js");
const { v4: uuidv4 } = require("uuid");
const { Op } = require("sequelize");
require("dotenv").config();

const conferencia = db.Conferencia;

class ConferenciaController {
  static buscarItensDeDemanda = async (req, res) => {
    const info = await conferencia.findAll({
      where: {
        idDemanda: req.params.id,
      },
      include: [
        {
          model: db.Material,
          as: "materiais",
        },
      ],
    });

    const dadosModel2Associados2 = await info.map((dado) => {
      if (dado !== null) {
        return {
          produto: dado.produto,
          descricao: dado.materiais?.descricao,
          tipo: dado.tipo,
          quantidade: dado.quantidade,
        };
      }
    });

    function somarValores(array, chave, item, tipo) {
      return array.reduce((soma, obj) => {
        if (obj.produto === item && obj.tipo === tipo) {
          return soma + obj[chave];
        } else {
          return soma;
        }
      }, 0);
    }

    function removerDuplicatas(array, chave1, chave2) {
      return array.filter((obj, index, self) => {
        const indiceEncontrado = self.findIndex(
          (o) => o[chave1] === obj[chave1] && o[chave2] === obj[chave2]
        );
        return indiceEncontrado === index;
      });
    }

    const arraySemDuplicatas = removerDuplicatas(
      dadosModel2Associados2,
      "produto",
      "tipo"
    );

    const arrFinal = await arraySemDuplicatas.map((dado) => {
      return {
        produto: dado.produto,
        descricao: dado.descricao,
        tipo: dado.tipo,
        quantidade: somarValores(
          dadosModel2Associados2,
          "quantidade",
          dado.produto,
          dado.tipo
        ),
      };
    });

    try {
      console.log(dadosModel2Associados2);
      res.status(200).json(arrFinal);
    } catch (erro) {
      return res.status(500).json(erro.message);
    }
  };

  static excluirConferencia = async (req, res) => {
    const info = await conferencia.destroy({
      where: {
        id: req.params.id,
      },
    });

    try {
      res.status(200).json(info);
    } catch (erro) {
      return res.status(500).json(erro.message);
    }
  };

  static editarConferencia = async (req, res) => {
    const { sif, fabricacao, quantidade } = req.body;

    const info = await conferencia.update(
      {
        sif: sif,
        lote: fabricacao,
        quantidade: quantidade,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );

    try {
      res.status(200).json(info);
    } catch (erro) {
      return res.status(500).json(erro.message);
    }
  };

  static buscarlistaTodosItensDeDemandaFisico = async (req, res) => {
    const info = await conferencia.findAll({
      where: {
        [Op.and]: {
          idDemanda: req.params.id,
          tipo: "fisico",
        },
      },
      include: [
        {
          model: db.Material,
          as: "materiais",
        },
      ],
    });

    try {
      res.status(200).json(info);
    } catch (erro) {
      return res.status(500).json(erro.message);
    }
  };

  static buscarItensDeDemandaFisico = async (req, res) => {
    const info = await conferencia.findAll({
      where: {
        [Op.and]: {
          idDemanda: req.params.id,
          tipo: "fisico",
        },
      },
      include: [
        {
          model: db.Material,
          as: "materiais",
        },
      ],
    });

    const dadosModel2Associados2 = await info.map((dado) => {
      if (dado !== null) {
        return {
          produto: dado.produto,
          descricao: dado.materiais?.descricao,
          tipo: dado.tipo,
          quantidade: dado.quantidade,
        };
      }
    });

    function somarValores(array, chave, item, tipo) {
      return array.reduce((soma, obj) => {
        if (obj.produto === item && obj.tipo === tipo) {
          return soma + obj[chave];
        } else {
          return soma;
        }
      }, 0);
    }

    function removerDuplicatas(array, chave1, chave2) {
      return array.filter((obj, index, self) => {
        const indiceEncontrado = self.findIndex(
          (o) => o[chave1] === obj[chave1] && o[chave2] === obj[chave2]
        );
        return indiceEncontrado === index;
      });
    }

    const arraySemDuplicatas = removerDuplicatas(
      dadosModel2Associados2,
      "produto",
      "tipo"
    );

    const arrFinal = await arraySemDuplicatas.map((dado) => {
      return {
        produto: dado.produto,
        descricao: dado.descricao,
        tipo: dado.tipo,
        quantidade: somarValores(
          dadosModel2Associados2,
          "quantidade",
          dado.produto,
          dado.tipo
        ),
      };
    });

    try {
      console.log(dadosModel2Associados2);
      res.status(200).json(arrFinal);
    } catch (erro) {
      return res.status(500).json(erro.message);
    }
  };

  static diferencaoContagem = async (req, res) => {
    const info = await conferencia.findAll({
      where: {
        idDemanda: req.params.id,
      },
      include: [
        {
          model: db.Material,
          as: "materiais",
        },
      ],
    });

    const dadosModel2Associados2 = await info.map((dado) => {
      if (dado !== null) {
        return {
          produto: dado.produto,
          descricao: dado.materiais?.descricao,
          tipo: dado.tipo,
          quantidade: dado.quantidade,
          quantidadeAvaria: dado.quantidadeAvaria,
        };
      }
    });

    const final = await diferencaQuantidadePorProduto(dadosModel2Associados2);

    function diferencaQuantidadePorProduto(arr) {
      const contagem = {};

      arr.forEach((obj) => {
        const produto = obj.produto;
        const descricao = obj.descricao;
        const tipo = obj.tipo;
        const quantidade = obj.quantidade;
        const quantidadeAvaria =
          obj.quantidadeAvaria == null ? 0 : obj.quantidadeAvaria;

        if (!contagem.hasOwnProperty(produto)) {
          contagem[produto] = {
            tipo1: 0,
            tipo2: 0,
            descricao: descricao,
            verqtd: 0,
          };
        }

        if (tipo === "fisico") {
          contagem[produto].tipo1 += quantidade;
          contagem[produto].verqtd += quantidadeAvaria;
        } else if (tipo === "contabil") {
          contagem[produto].tipo2 += quantidade;
          contagem[produto].verqtd += quantidadeAvaria;
        }
      });

      const resultado = [];

      for (const produto in contagem) {
        const difTipo1Tipo2 = contagem[produto].tipo1 - contagem[produto].tipo2;
        resultado.push({
          produto: produto,
          descricao: contagem[produto].descricao,
          diferenca: difTipo1Tipo2,
          fisico: contagem[produto].tipo1,
          contabil: contagem[produto].tipo2,
          avaria: contagem[produto].verqtd,
        });
      }

      return resultado;
    }

    try {
      res.status(200).json(final);
    } catch (erro) {
      return res.status(500).json(erro.message);
    }
  };

  static itensContagemDividoRetornoeReentrega = async (req, res) => {
    const info = await conferencia.findAll({
      where: {
        idDemanda: req.params.id,
      },
      include: [
        {
          model: db.Material,
          as: "materiais",
        },
      ],
    });

    function somarComBaseEmCriterios(dados, criterio1, criterio2) {
      let soma = 0;
      for (const item of dados) {
        if (item.produto === criterio1 && item.motivo === criterio2) {
          soma += item.quantidade;
        }
      }
      return soma;
    }

    function somarComBaseEmCriteriosAvaria(dados, criterio1, criterio2) {
      let soma = 0;
      for (const item of dados) {
        if (item.produto === criterio1 && item.motivo === criterio2) {
          soma += item.quantidadeAvaria;
        }
      }
      return soma;
    }

    const resultadomap = info.map((dado) => {
      let verMotivo = "";
      if (dado.motivo === "1" || dado.motivo === "2") {
        verMotivo = "Devolução";
      } else if (dado.motivo === "3") {
        verMotivo = "Reentrega";
      } else {
        verMotivo = null;
      }
      return {
        produto: dado.produto,
        descricao: dado.materiais.descricao,
        motivo: verMotivo,
        quantidade: dado.quantidade,
        quantidadeAvaria: dado.quantidadeAvaria,
        nota_fiscal: dado.nota_fiscal,
      };
    });

    const validador = [];
    const resultadoFinal = [];

    const resultado = resultadomap.map((dado) => {
      const ver = dado.produto + dado.motivo;
      if (!validador.includes(ver) && dado.motivo !== "") {
        resultadoFinal.push({
          produto: dado.produto,
          descricao: dado.descricao,
          motivo: dado.motivo,
          quantidade: somarComBaseEmCriterios(
            resultadomap,
            dado.produto,
            dado.motivo
          ),
          quantidadeAvaria: somarComBaseEmCriteriosAvaria(
            resultadomap,
            dado.produto,
            dado.motivo
          ),
          id: uuidv4(),
        });
        validador.push(ver);
        return { dado };
      }
    });

    try {
      console.log(validador);
      res.status(200).json(resultadoFinal);
    } catch (erro) {
      return res.status(500).json(erro.message);
    }
  };

  static BuscarItensdaConferencia = async (req, res) => {
    const info = await conferencia.findAll({
      where: {
        idDemanda: req.params.id,
      },
      include: [
        {
          model: db.Material,
          as: "materiais",
        },
      ],
    });

    try {
      console.log();
      res.status(200).json(info);
    } catch (erro) {
      return res.status(500).json(erro.message);
    }
  };

  static addConferencia = async (req, res) => {
    const { produto, quantidade, sif, lote, quantidadeAvaria } = req.body;
    const info = await conferencia.create({
      produto,
      quantidade,
      quantidadeAvaria,
      sif,
      lote,
      tipo: "fisico",
      idDemanda: req.params.id,
    });

    try {
      res.status(200).json(info);
    } catch (erro) {
      return res.status(500).json(erro.message);
    }
  };
}

module.exports = ConferenciaController;
