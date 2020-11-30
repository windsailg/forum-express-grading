const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User

const userController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },
  signUp: (req, res) => {
    // confirm password
    if (req.body.passwordCheck !== req.body.password) {
      req.flash('error_messages', '兩次密碼輸入不同！')
      return res.redirect('/signup')
    } else {
      // confirm unique user
      User.findOne({ where: { email: req.body.email } }).then(user => {
        if (user) {
          req.flash('error_messages', '信箱重複！')
          return res.redirect('/signup')
        } else {
          User.create({
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
          }).then(user => {
            req.flash('success_messages', '成功註冊帳號！')
            return res.redirect('/signin')
          })
        }
      })
    }
  },
  signInPage: (req, res) => {
    return res.render('signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/restaurants')
  },
  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/signin')
  },
  getUsers: (req, res) => {
    return User.findAll({
      raw: true,
      nest: true
      // where: { UserId: req.user.id }
    }).then(users => {
      return res.render('admin/users', {
        users: users
      })
    })
  },
  updateUser: (req, res) => {
    return User.findByPk(req.params.id)
      .then((user) => {
        user.update({
          isAdmin: !user.isAdmin
        }).then((user) => {
          req.flash('success_messages', `${user.name}'s role was successfully switched to ${user.isAdmin ? 'Admin' : 'user'}`)
          res.redirect('/admin/users')
        })
      })
  },
  getUser: (req, res) => {
    return User.findByPk(req.params.id)
      .then((user) => {
        res.render('user')
      })
  }
}

module.exports = userController
