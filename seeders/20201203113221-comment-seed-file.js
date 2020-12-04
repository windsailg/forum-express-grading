'use strict'
// const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Comments',
      Array.from({ length: 10 }).map((d, i) =>
        ({
          text: 'lorem',
          createdAt: new Date(),
          updatedAt: new Date(),
          // RestaurantId: Math.floor(Math.random() * 10) * 100 + 1,
          // UserId: Math.floor(Math.random() * 3) * 10 + 1
        })
      ), {})
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Comments', null, {})
  }
}
