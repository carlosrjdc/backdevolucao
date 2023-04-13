const express = require("express");
const DemandaController = require("../../controllers/DemandaControllerApp.js");

const router = express.Router();

//READ
router.get("/app/buscardemanda/:id", DemandaController.buscarDemanda);
router.get(
  "/app/verificardemandaemaberto/:id",
  DemandaController.verificarDemandaAberto
);
router.put(
  "/app/inicioconferencia/:id",
  DemandaController.cadastrarInicioDemanda
);

router.put("/app/finalizardemanda/:id", DemandaController.finalizarDemanda);

module.exports = router;
