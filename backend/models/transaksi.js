'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class transaksi extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.user, {
        foreignKey: "id_user",
        as: "user"
      })
      this.belongsTo(models.meja, {
        foreignKey: "id_meja",
        as: "meja"
      })
      this.hasMany(models.detail_transaksi, {
        foreignKey: "id_transaksi",
        as: "detail_transaksi"
      })
    }
  }
  transaksi.init({
    id_transaksi: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    tgl_transaksi: DataTypes.DATE,
    id_user: {
      type: DataTypes.INTEGER,
      allowNull: false  
    },
    id_meja: {
      type: DataTypes.INTEGER,
      allowNull: false  
    },
    nama_pelanggan: DataTypes.STRING,
    status: DataTypes.ENUM('Belum bayar', 'Lunas'),
    total: DataTypes.DOUBLE
  }, {
    sequelize,
    modelName: 'transaksi',
    tableName: 'transaksi'
  });
  return transaksi;
};