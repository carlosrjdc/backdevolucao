"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class NotaFiscal_retorno extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      NotaFiscal_retorno.belongsTo(models.Demanda_retorno, {
        as: "demandas",
        foreignKey: "idDemanda",
      });
    }
  }
  NotaFiscal_retorno.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      idDemanda: {
        type: DataTypes.INTEGER,
        references: { model: "Demanda_retornos", key: "id" },
      },
      nota_fiscal: {
        unique: true,
        type: DataTypes.STRING,
      },
      status_nf: {
        type: DataTypes.STRING,
      },
      transporte: {
        type: DataTypes.STRING,
      },
      id_viagem: {
        type: DataTypes.STRING,
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
      modelName: "NotaFiscal_retorno",
    }
  );
  return NotaFiscal_retorno;
};
