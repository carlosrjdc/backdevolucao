const serviceRavex = require("./serviceRavex.js");
const db = require("../models/index.js");
const { Op } = require("sequelize");
require("dotenv").config();

const notaFiscal = db.NotaFiscal_retorno;

class EnderecoController {
  //CADASTRO DE USUARIO

  static CadatrarProdutosNaDemanda = async (req, res) => {
    const info = await serviceRavex.buscarItens(
      req.params.viagem,
      req.params.nf
    );

    const registro = await notaFiscal.create({
      idDemanda: req.params.id,
      nota_fiscal: info[0].notaFiscal,
      status_nf: info[0].status,
      transporte: info[0].identificador,
      id_viagem: info[0].viagemId,
    });

    try {
      console.log(info);
      res.status(200).json(registro);
    } catch (erro) {
      return res.status(500).json(erro.message);
    }
  };
  static InformacoesNF = async (req, res) => {
    const info = await serviceRavex.buscarItens(
      req.params.viagem,
      req.params.nf
    );

    try {
      res.status(200).json(info);
    } catch (erro) {
      return res.status(500).json(erro.message);
    }
  };
}

module.exports = EnderecoController;
