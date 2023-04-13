const express = require("express");
const cors = require("cors");
const Ravex = require("./Ravex.js");
const Demanda = require("./Demanda.js");
const DemandaApp = require("./Demandaap.js");
const NotaFiscal = require("./NotaFiscal.js");
const Conferencia = require("./Conferencia.js");
const Material = require("./Material.js");
const User = require("./User.js");

const routes = (app) => {
  app.route("/").get((req, res) => {
    res.status(200).send({ Titulo: "Carlos Roberto" });
  });

  app.use(
    express.json(),
    cors(),
    Ravex,
    Demanda,
    NotaFiscal,
    User,
    DemandaApp,
    Conferencia,
    Material,
    express.raw({ type: "application/pdf" })
  );
};

module.exports = routes;
