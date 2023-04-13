const express = require("express");
const DemandaNotaFiscal = require("../../controllers/NotaFiscalController.js");

const router = express.Router();

router.post(
  "/cadastrarProdutos/:id/:viagem/:nf",
  DemandaNotaFiscal.CadatrarProdutosNaDemanda
);

router.get("/infoviagem/:viagem", DemandaNotaFiscal.InformacoesNF);

router.get(
  "/listarnotaspordemanda/:id",
  DemandaNotaFiscal.relacaoNotasFiscaisporDemanda
);

module.exports = router;
