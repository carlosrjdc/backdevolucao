"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Conferencia extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Conferencia.belongsTo(models.Demanda_retorno, {
        as: "conferenciademanda",
        foreignKey: "idDemanda",
      });

      Conferencia.belongsTo(models.Material, {
        as: "materiais",
        foreignKey: "produto",
      });
    }
  }
  Conferencia.init(
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
        type: DataTypes.STRING,
      },
      motivo: {
        type: DataTypes.STRING,
      },
      produto: {
        type: DataTypes.INTEGER,
        references: { model: "Materials", key: "id" },
      },
      quantidade: {
        type: DataTypes.INTEGER,
      },
      tipo: {
        type: DataTypes.STRING,
      },
      sif: {
        type: DataTypes.STRING,
      },
      lote: {
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
      modelName: "Conferencia",
    }
  );
  return Conferencia;
};
