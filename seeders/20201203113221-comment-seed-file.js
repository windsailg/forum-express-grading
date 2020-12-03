'use strict'
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Comments', [{
      id: 1,
      text: faker.lorem.text(),
      UserId: 1,
      RestaurantId: 61,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 2,
      text: faker.lorem.text(),
      UserId: 2,
      RestaurantId: 11,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 3,
      text: faker.lorem.text(),
      UserId: 2,
      RestaurantId: 121,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 4,
      text: faker.lorem.text(),
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
