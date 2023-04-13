"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Demanda_retorno extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      Demanda_retorno.hasMany(models.NotaFiscal_retorno, {
        as: "demandas",
        foreignKey: "idDemanda",
      });

      Demanda_retorno.hasMany(models.Conferencia, {
        as: "conferenciademanda",
        foreignKey: "idDemanda",
      });

      Demanda_retorno.belongsTo(models.User, {
        as: "conferente",
        foreignKey: "idConferente",
      });
    }
  }
  Demanda_retorno.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      placa: {
        type: DataTypes.STRING,
      },
      id_viagem: {
        unique: true,
        type: DataTypes.STRING,
      },
      transporte: {
        type: DataTypes.STRING,
      },
      data: {
        type: DataTypes.STRING,
      },
      transportadora: {
        type: DataTypes.STRING,
      },
      status: {
        type: DataTypes.STRING,
      },
      idConferente: {
        type: DataTypes.INTEGER,
        references: { model: "Users", key: "id" },
      },
      Doca: {
        type: DataTypes.STRING,
      },
      inicioConferencia: {
        type: DataTypes.DATE,
      },
      fimConferencia: {
        type: DataTypes.DATE,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: "Demanda_retorno",
    }
  );
  return Demanda_retorno;
};
