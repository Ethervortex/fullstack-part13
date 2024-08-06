const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.addColumn('blogs', 'year', {
      type: DataTypes.INTEGER,
      validate: {
        min: {
          args: 1991,
          msg: "The year must be at least 1991",
        },
        max: {
          args: new Date().getFullYear(),
          msg: `The year cannot be greater than ${new Date().getFullYear()}`,
        }
      }
    })
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn('blogs', 'year')
  },
}
