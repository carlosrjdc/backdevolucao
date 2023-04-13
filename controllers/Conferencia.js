const serviceRavex = require("./serviceRavex.js");
const Sequelize = require("sequelize");
const db = require("../models/index.js");
const { Op } = require("sequelize");
const Material = require("../models/Material.js");
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

        if (!contagem.hasOwnProperty(produto)) {
          contagem[produto] = { tipo1: 0, tipo2: 0, descricao: descricao };
        }

        if (tipo === "fisico") {
          contagem[produto].tipo1 += quantidade;
        } else if (tipo === "contabil") {
          contagem[produto].tipo2 += quantidade;
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

  static addConferencia = async (req, res) => {
    const { produto, quantidade, sif, lote } = req.body;
    const info = await conferencia.create({
      produto,
      quantidade,
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