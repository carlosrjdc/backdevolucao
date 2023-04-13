const serviceRavex = require("./serviceRavex.js");
const moment = require("moment-timezone");
const db = require("../models/index.js");
const { Op } = require("sequelize");
require("dotenv").config();

const demandaRetorno = db.Demanda_retorno;
const notafiscal = db.NotaFiscal_retorno;
const conferencia = db.Conferencia;

class EnderecoController {
  //CADASTRO DE USUARIO

  static cadastrarDemandaEmMassa = async (req, res) => {
    const { placa, transporte, transportadora, dados } = req.body;

    const verificar = await demandaRetorno.count({
      where: {
        id_viagem: req.params.viagem,
      },
      attributes: { exclude: ["idMaterial"] },
    });

    const t = await db.sequelize.transaction();

    try {
      // Cria um registro no Model1
      if (verificar === 0) {
        const model1 = await demandaRetorno.create(
          {
            placa: placa,
            id_viagem: req.params.viagem,
            transporte: transporte,
            transportadora: transportadora,
            data: moment(new Date()).format("YYYY-MM-DD"),
            status: "A Conferir",
          },
          {
            transaction: t,
          }
        );

        // Obtém o ID gerado em model1
        const model1Id = model1.id;

        // Associa o ID de model1 a cada objeto em dadosModel2
        const dadosModel2Associados = await dados.map((dado) => {
          return { ...dado, idDemanda: model1Id, id_viagem: req.params.viagem };
        });

        //Teste
        //teste

        const novoArraySimples = dados.map((objeto) => objeto.nota_fiscal);

        const info = await serviceRavex.buscarItensDaNota(
          req.params.viagem,
          novoArraySimples
        );

        // Associa o ID de model1 a cada objeto em dadosModel2
        const dadosModel2Associados2 = await info.map((dado) => {
          if (dado !== null) {
            return { ...dado, idDemanda: model1Id, tipo: "contabil" };
          }
        });

        await conferencia.bulkCreate(
          dadosModel2Associados2.filter(
            (filtrar) =>
              filtrar.nota_fiscal !== null && filtrar.nota_fiscal !== undefined
          ),
          {
            transaction: t,
          }
        );

        //fim teste

        //Fim teste*/

        // Cria múltiplos registros no Model2 utilizando o método bulkCreate
        console.log(dadosModel2Associados);
        await notafiscal.bulkCreate(dadosModel2Associados, { transaction: t });

        // Confirma a transação
        await t.commit();

        console.log("Cadastro em massa concluído com sucesso!");
        res.status(200).json("Cadastro em massa concluído com sucesso!");
      } else {
        res.status(200).json("não localizado");
      }
    } catch (error) {
      // Caso ocorra algum erro, desfaz a transação
      await t.rollback();
      console.error("Erro ao realizar cadastro em massa:", error);
    }
  };

  static buscarInfoViagem = async (req, res) => {
    const info = await serviceRavex.periodoLongo(
      req.params.datainicial,
      req.params.datafinal,
      req.params.nf
    );

    console.log(info);

    const filtro = async () => {
      if (info !== "não localizado") {
        const listarNotas = await serviceRavex.buscainfonf(info[0].viagemId);

        const filtrado = await listarNotas?.filter(
          (filtrar) =>
            filtrar.status === "Devolução total" ||
            filtrar.status === "Devolução parcial" ||
            filtrar.status === "Reentrega"
        );

        return filtrado;
      } else {
        return "Fora do intervalo de data selecionado";
      }
    };

    const dadosFinal = await filtro();

    try {
      res.status(200).json(dadosFinal);
    } catch (erro) {
      return res.status(500).json(erro.message);
    }
  };

  static cadastrarDemandaDevolucao = async (req, res) => {
    const { placa, transporte, transportadora } = req.body;

    const verificar = await demandaRetorno.count({
      where: {
        id_viagem: req.params.viagem,
      },
    });
    try {
      if (verificar === 0) {
        const registro = await demandaRetorno.create({
          placa: placa,
          id_viagem: req.params.viagem,
          transporte: transporte,
          transportadora: transportadora,
          data: moment(new Date()).format("YYYY-MM-DD"),
          status: "A Conferir",
        });
        res.status(200).json(registro);
      } else {
        res.status(200).json("não localizado");
      }
    } catch (erro) {
      return res.status(500).json(erro.message);
    }
  };

  static infoViagem = async (req, res) => {
    const { dados } = req.body;
    const info = await serviceRavex.periodoLongo(
      req.params.data,
      req.params.nf
    );

    try {
      res.status(200).json(info);
    } catch (erro) {
      return res.status(500).json(erro.message);
    }
  };

  static CadatrarProdutosNaDemanda = async (req, res) => {
    const { dados } = req.body;
    const info = await serviceRavex.buscarItensDaNota(req.params.viagem, dados);

    //const teste = await info.filter((filtrar) => filtrar[0].motivo !== null);

    // Associa o ID de model1 a cada objeto em dadosModel2
    //const ver = info.filter((filtrar) => filtrar.motivo !== null);

    try {
      res.status(200).json(info);
    } catch (erro) {
      return res.status(500).json(erro.message);
    }
  };

  static ListarDemandas = async (req, res) => {
    const info = await demandaRetorno.findAll();

    try {
      res.status(200).json(info);
    } catch (erro) {
      return res.status(500).json(erro.message);
    }
  };

  static VerificarDemanda = async (req, res) => {
    const info = await demandaRetorno.findAll({
      where: {
        id_viagem: req.params.viagem,
      },
      attributes: { exclude: ["idConferente", "idMaterial"] },
    });

    try {
      res.status(200).json(info);
    } catch (erro) {
      return res.status(500).json(erro.message);
    }
  };
}

module.exports = EnderecoController;
