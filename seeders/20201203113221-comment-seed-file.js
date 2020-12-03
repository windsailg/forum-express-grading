'use strict'
// const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Comments', [{
      text: 'lorem',
      UserId: 1,
      RestaurantId: 61,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      text: 'lorem',
      UserId: 2,
      RestaurantId: 11,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      text: 'lorem',
      UserId: 2,
      RestaurantId: 121,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      text: 'lorem',
      UserId: 3,
      RestaurantId: 41,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {})
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Comments', null, {})
  }
}
