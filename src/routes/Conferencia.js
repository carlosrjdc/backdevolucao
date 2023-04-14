const express = require("express");
const ConferenciaController = require("../../controllers/Conferencia.js");

const router = express.Router();

//READ
router.get(
  "/conferencia/buscaritens/:id",
  ConferenciaController.buscarItensDeDemanda
);
router.get(
  "/conferencia/buscaritensfisicos/:id",
  ConferenciaController.buscarItensDeDemandaFisico
);

router.get(
  "/conferencia/buscarlistadetodositensfisicos/:id",
  ConferenciaController.buscarlistaTodosItensDeDemandaFisico
);

router.get(
  "/conferencia/resultadoconferencia/:id",
  ConferenciaController.diferencaoContagem
);

router.get(
  "/conferencia/retornoreentrega/:id",
  ConferenciaController.itensContagemDividoRetornoeReentrega
);

router.post(
  "/conferencia/addproduto/:id",
  ConferenciaController.addConferencia
);

router.delete(
  "/excluirconferencia/:id",
  ConferenciaController.excluirConferencia
);

router.put("/editarconferencia/:id", ConferenciaController.editarConferencia);

module.exports = router;
