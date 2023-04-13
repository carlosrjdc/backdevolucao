const express = require("express");
const RavexController = require("../../controllers/Ravex.js");

const router = express.Router();

//READ
router.get("/infoRavex/:data", RavexController.buscarContagemporDemandaExcel);

module.exports = router;
