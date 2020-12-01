const helpers = require('../_helpers')

const restController = require('../controllers/restController')
const adminController = require('../controllers/adminController')
const userController = require('../controllers/userController')
const categoryController = require('../controllers/categoryController.js')
const commentController = require('../controllers/commentController.js')

const multer = require('multer')
const upload = multer({ dest: 'temp/' })

module.exports = (app, passport) => {
  const authenticated = (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {
      return next()
    }
    res.redirect('/signin')
  }
  const authenticatedAdmin = (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {
      if (helpers.getUser(req).isAdmin) { return next() }
      return res.redirect('/')
    }
    res.redirect('/signin')
  }

  // AdminRestaurants
  app.get('/admin', authenticatedAdmin, (req, res) => res.redirect('/admin/restaurants'))
  app.get('/admin/restaurants', authenticatedAdmin, adminController.getRestaurants)
  app.get('/admin/restaurants/create', authenticatedAdmin, adminController.createOrEditRestaurant)
  app.post('/admin/restaurants', authenticatedAdmin, upload.single('image'), adminController.postRestaurant)
  app.get('/admin/restaurants/:id', authenticatedAdmin, adminController.getRestaurant)
  app.get('/admin/restaurants/:id/edit', authenticatedAdmin, adminController.createOrEditRestaurant)
  app.put('/admin/restaurants/:id', authenticatedAdmin, upload.single('image'), adminController.updateRestaurant)
  app.delete('/admin/restaurants/:id', authenticatedAdmin, adminController.deleteRestaurant)

  // Restaurant
  app.get('/', authenticated, (req, res) => res.redirect('restaurants'))
  app.get('/restaurants', authenticated, restController.getRestaurants)
  app.get('/restaurants/:id', authenticated, restController.getRestaurant)

  // Categories
  app.get('/admin/categories', authenticatedAdmin, categoryController.getCategories)
  app.post('/admin/categories', authenticatedAdmin, categoryController.postCategory)
  app.get('/admin/categories/:id', authenticatedAdmin, categoryController.getCategories)
  app.put('/admin/categories/:id', authenticatedAdmin, categoryController.updateCategory)
  app.delete('/admin/categories/:id', authenticatedAdmin, categoryController.deleteCategory)

  // Comments
  app.post('/comments', authenticated, commentController.postComment)

  // Role
  app.get('/admin/users', authenticatedAdmin, userController.getUsers)
  app.put('/admin/users/:id/toggleAdmin', authenticatedAdmin, userController.updateUser)

  // User
  app.get('/user/:id', userController.getUser)
  app.get('/signup', userController.signUpPage)
  app.post('/signup', userController.signUp)
  app.get('/signin', userController.signInPage)
  app.post('/signin', passport.authenticate('local', {
    failureRedirect: '/signin',
    failureFlash: true
  }),
  userController.signIn)

  app.get('/logout', userController.logout)
}
