'use strict'
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Comment', [{
      text: faker.lorem.text(),
      UserId: 1,
      RestaurantId: 61,
      createdAt: new Date(),
      upDateAt: new Date()
    }, {
      text: faker.lorem.text(),
      UserId: 2,
      RestaurantId: 11,
      createdAt: new Date(),
      upDateAt: new Date()
    }, {
      text: faker.lorem.text(),
      UserId: 2,
      RestaurantId: 121,
      createdAt: new Date(),
      upDateAt: new Date()
    }, {
      text: faker.lorem.text(),
      UserId: 3,
      RestaurantId: 41,
      createdAt: new Date(),
      upDateAt: new Date()
    }], {})
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Comment', null, {})
  }
}
