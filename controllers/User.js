const db = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const user = db.User;

class UserController {
  static buscarUsuarios = async (req, res) => {
    try {
      const Usuario = await user.findAll({
        attributes: ["usuario", "nome", "email"],
      });
      res.status(200).json(Usuario);
    } catch (erro) {
      return res.status(500).json(erro.message);
    }
  };
  static editarUsuario = async (req, res) => {
    try {
      const Usuario = await user.update(req.body, {
        where: {
          usuario: req.params.id,
        },
      });
      res.status(200).json(Usuario);
    } catch (erro) {
      return res.status(500).json(erro.message);
    }
  };

  static criarUsuario = async (req, res) => {
    try {
      const { usuario, nome, funcao, senha } = req.body;
      const salt = await bcrypt.genSalt(12);
      const senhaHash = await bcrypt.hash(senha, salt);
      const Usuario = await user.create({
        usuario,
        nome,
        funcao,
        senha: senhaHash,
      });
      res.status(200).json(Usuario);
    } catch (erro) {
      return res.status(500).json(erro.message);
    }
  };
  static autenticarUsuario = async (req, res) => {
    try {
      const { usuario, senha } = req.body;

      const dadosUsuario = await user.findOne({
        where: {
          usuario: usuario,
        },
      });

      const checkSenha = await bcrypt.compare(senha, dadosUsuario.senha);
      if (!checkSenha) {
        res.status(200).json({ Erro: "Usuario ou Senha Invalidos" });
      } else {
        const secret = process.env.SECRET;
        const token = jwt.sign(
          {
            usuario: dadosUsuario.usuario,
          },
          secret
        );

        res.status(200).json({
          Autenticado: "Autenticado com Sucesso",
          iduser: dadosUsuario.id,
          token,
        });
      }
    } catch (erro) {
      return res.status(500).json(erro.message);
    }
  };
}

module.exports = UserController;
