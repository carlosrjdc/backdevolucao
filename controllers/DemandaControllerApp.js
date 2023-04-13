const serviceRavex = require("./serviceRavex.js");
const moment = require("moment-timezone");
const db = require("../models/index.js");
const { Op } = require("sequelize");
require("dotenv").config();

const demandaRetorno = db.Demanda_retorno;
const notafiscal = db.NotaFiscal_retorno;
const conferencia = db.Conferencia;

class DemandaControllerApp {
  //CADASTRO DE USUARIO
  static buscarDemanda = async (req, res) => {
    const info = await demandaRetorno.findOne({
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
  static verificarDemandaAberto = async (req, res) => {
    const info = await demandaRetorno.findAll({
      where: {
        [Op.and]: [
          { idConferente: req.params.id },
          { inicioConferencia: { [Op.not]: null } },
          { fimConferencia: { [Op.is]: null } },
        ],
      },
    });

    try {
      res.status(200).json(info);
    } catch (erro) {
      return res.status(500).json(erro.message);
    }
  };

  static cadastrarInicioDemanda = async (req, res) => {
    const { doca, idconferente } = req.body;
    const info = await demandaRetorno.count({
      where: {
        [Op.and]: [
          { idConferente: idconferente },
          { inicioConferencia: { [Op.not]: null } },
          { fimConferencia: { [Op.is]: null } },
        ],
      },
    });

    try {
      const t = await db.sequelize.transaction();
      if (info === 0) {
        demandaRetorno.update(
          {
            idConferente: idconferente,
            Doca: doca,
            status: "em conferencia",
            inicioConferencia: new Date(),
          },
          {
            where: {
              id: req.params.id,
            },
          }
        );
      } else {
        return res.status(200).json("tem uma demanda em aberto");
      }
      // Confirma a transação
      await t.commit();
      res.status(200).json(info);
    } catch (erro) {
      return res.status(500).json(erro.message);
    }
  };

  static finalizarDemanda = async (req, res) => {
    const { idconferente } = req.body;
    const info = await demandaRetorno.count({
      where: {
        [Op.and]: [
          { id: req.params.id },
          { inicioConferencia: { [Op.not]: null } },
          { fimConferencia: { [Op.is]: null } },
        ],
      },
    });

    try {
      const t = await db.sequelize.transaction();
      if (info > 0) {
        demandaRetorno.update(
          {
            status: "concluido",
            fimConferencia: new Date(),
          },
          {
            where: {
              id: req.params.id,
            },
          }
        );
      } else {
        return res.status(200).json("tem uma demanda em aberto");
      }
      // Confirma a transação
      await t.commit();
      res.status(200).json(info);
    } catch (erro) {
      return res.status(500).json(erro.message);
    }
  };
}

module.exports = DemandaControllerApp;
