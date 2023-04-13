const excelToJson = require("convert-excel-to-json");
const db = require("../models/index.js");
const { Op } = require("sequelize");
require("dotenv").config();

const material = db.Material;

class MaterialController {
  static InputEmMassaSku = async (req, res) => {
    const result = excelToJson({
      source: req.file.buffer,
      columnToKey: {
        A: "id",
        B: "id_sku",
        C: "descricao",
        D: "codean",
        E: "coddum",
      },
      sheets: "SKU",
    });

    result.SKU.shift();
    try {
      const registro = await material.bulkCreate(result.SKU);
      res.status(200).json(registro);
    } catch (erro) {
      return res.status(500).json(erro.message);
    }
  };
  static buscarItem = async (req, res) => {
    try {
      const registro = await material.findOne({
        where: {
          [Op.or]: [
            {
              id: req.params.id,
            },
            {
              codean: req.params.id,
            },
            {
              coddum: req.params.id,
            },
          ],
        },
      });
      res.status(200).json(registro);
    } catch (erro) {
      return res.status(500).json(erro.message);
    }
  };
  static todosMateriais = async (req, res) => {
    try {
      const registro = await material.findAll();
      res.status(200).json(registro);
    } catch (erro) {
      return res.status(500).json(erro.message);
    }
  };

  static atualizarRegistros = async (req, res) => {
    dadosAtualizar.map((item) => console.log(item));
    try {
      const registro = await dadosAtualizar.map(async (item) => {
        const atualizar = await material.update(
          { EAN14CX: item.ean },
          {
            where: {
              id: parseInt(item.id),
            },
          }
        );
      });

      res.status(200).json("ok");
    } catch (erro) {
      return res.status(500).json(erro.message);
    }
  };
}

module.exports = MaterialController;
