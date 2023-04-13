const db = require("../models");
const serviceRavex = require("./serviceRavex.js");
const { Op } = require("sequelize");
require("dotenv").config();
var excel = require("excel4node");
const wb = new excel.Workbook();
const ws = wb.addWorksheet("contagem");

class Geral_Ravex_controller {
  //READ
  static buscarRegistros = async (req, res) => {
    const dados = await serviceRavex.periodoLongo(req.params.data);

    try {
      console.log(dados);
      res.status(200).json("ok");
    } catch (erro) {
      return res.status(500).json(erro.message);
    }
  };

  static buscarContagemporDemandaExcel = async (req, res) => {
    const dados = await serviceRavex.periodoLongo(req.params.data);

    let inicial = 1;

    ws.cell(inicial, 1).string("unidade");
    ws.cell(inicial, 2).string("dataHoraFimViagem");
    ws.cell(inicial, 3).string("dataHoraPrevisaoFimViagem");
    ws.cell(inicial, 4).string("status");
    ws.cell(inicial, 5).string("transportadora");
    ws.cell(inicial, 6).string("identificador");
    ws.cell(inicial, 7).string("viagemId");
    ws.cell(inicial, 8).string("placa:");
    ws.cell(inicial, 9).string("notaFiscal:");
    ws.cell(inicial, 10).string("inicioEntrega:");
    ws.cell(inicial, 11).string("fimEntrega:");

    dados.forEach((item, i) => {
      ws.cell(i + 1 + inicial, 1).string(
        item.unidade === null || item.unidade === undefined ? "" : item.unidade
      ); //O primeiro parametro é a linha da planilha o segundo é a coluna

      ws.cell(i + 1 + inicial, 2).string(
        item.dataHoraFimViagem === null || item.dataHoraFimViagem === undefined
          ? ""
          : item.dataHoraFimViagem
      ); //O primeiro parametro é a linha da planilha o segundo é a coluna

      ws.cell(i + 1 + inicial, 3).string(
        item.dataHoraPrevisaoFimViagem === null ||
          item.dataHoraPrevisaoFimViagem === undefined
          ? ""
          : item.dataHoraPrevisaoFimViagem
      ); //O primeiro parametro é a linha da planilha o segundo é a coluna

      ws.cell(i + 1 + inicial, 4).string(
        item.status === null || item.status === undefined ? "" : item.status
      ); //O primeiro parametro é a linha da planilha o segundo é a coluna

      ws.cell(i + 1 + inicial, 5).string(
        item.transportadora === null || item.transportadora === undefined
          ? ""
          : item.transportadora
      ); //O primeiro parametro é a linha da planilha o segundo é a coluna

      ws.cell(i + 1 + inicial, 6).string(
        item.identificador === null || item.identificador === undefined
          ? ""
          : item.identificador
      ); //O primeiro parametro é a linha da planilha o segundo é a coluna

      ws.cell(i + 1 + inicial, 7).string(
        item.viagemId === null || item.viagemId === undefined
          ? ""
          : item.viagemId
      ); //O primeiro parametro é a linha da planilha o segundo é a coluna

      ws.cell(i + 1 + inicial, 8).string(
        item.placa === null || item.placa === undefined ? "" : item.placa
      ); //O primeiro parametro é a linha da planilha o segundo é a coluna

      ws.cell(i + 1 + inicial, 9).string(
        item.notaFiscal === null || item.notaFiscal === undefined
          ? ""
          : item.notaFiscal
      ); //O primeiro parametro é a linha da planilha o segundo é a coluna

      ws.cell(i + 1 + inicial, 10).string(
        item.inicioEntrega === null || item.inicioEntrega === undefined
          ? ""
          : item.inicioEntrega
      ); //O primeiro parametro é a linha da planilha o segundo é a coluna

      ws.cell(i + 1 + inicial, 11).string(
        item.fimEntrega === null || item.fimEntrega === undefined
          ? ""
          : item.fimEntrega
      ); //O primeiro parametro é a linha da planilha o segundo é a coluna
    });

    try {
      console.log(dados);
      //res.status(200).json(registro);
      wb.write("teste.xlsx", res);
    } catch (erro) {
      return res.status(500).json(erro.message);
    }
  };
}

module.exports = Geral_Ravex_controller;
