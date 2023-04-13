const express = require("express");
const UserController = require("../../controllers/User.js");
const autenticacao = require("../../controllers/Auth.js");

const router = express.Router();

router.get("/users", UserController.buscarUsuarios);
router.post("/user", UserController.criarUsuario);
router.post("/autenticar", UserController.autenticarUsuario);
router.put("/atualizar/:id", autenticacao, UserController.editarUsuario);
router.get("/todosusers", autenticacao, UserController.buscarUsuarios);

module.exports = router;
