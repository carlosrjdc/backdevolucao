const express = require("express");
const DemandaController = require("../../controllers/DemandaController.js");

const router = express.Router();

//READ
router.post(
  "/cadastrardemanda/:viagem",
  DemandaController.cadastrarDemandaDevolucao
);
router.post(
  "/cadastrardemandaemmassa/:viagem",
  DemandaController.cadastrarDemandaEmMassa
);
router.post(
  "/cadastrarprodutos/:viagem/:nf",
  DemandaController.CadatrarProdutosNaDemanda
);

router.get("/buscarinfocarro/:viagem", DemandaController.buscarInfoViagem);

router.get(
  "/buscardemandaporviagem/:viagem",
  DemandaController.VerificarDemanda
);

router.post(
  "/cadastrarProdutos/:viagem/:nf",
  DemandaController.CadatrarProdutosNaDemanda
);

router.get("/listardemandas", DemandaController.ListarDemandas);

router.get(
  "/informacoesviagem/:datainicial/:datafinal/:nf",
  DemandaController.infoViagem
);

module.exports = router;
