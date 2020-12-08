const db = require('../../models')
const Restaurant = db.Restaurant
const Category = db.Category

const adminService = require('../../services/adminServices')

const categoryController = {
  getCategories: (req, res) => {
    adminService.getCategories(req, res, (data) => {
      return res.json(data)
    })
  },
  postCategory: (req, res) => {
    adminService.postCategory(req, res, (data) => {
      return res.json(data)
    })
  },
  updateCategory: (req, res) => {
    adminService.updateCategory(req, res, (data) => {
      return res.json(data)
    })
  }
}
module.exports = categoryController
