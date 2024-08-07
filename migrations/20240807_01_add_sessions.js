const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable('sessions', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
          token: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
          },
          expired: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
          }
    })
  },
  
  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('sessions')
  }
}