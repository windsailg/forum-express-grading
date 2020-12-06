const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User
const Restaurant = db.Restaurant
const Comment = db.Comment
const Favorite = db.Favorite
const Like = db.Like
const Followship = db.Followship
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const userController = {
  // SignIn Sign Up
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
  // Role
  getUsers: (req, res) => {
    return User.findAll({
      raw: true,
      nest: true
    }).then(users => {
      return res.render('admin/users', {
        users: users
      })
    })
  },
  updateRole: (req, res) => {
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
  // Profile
  getUser: (req, res) => {
    const UserId = req.user.id
    Comment.findAll({
      raw: true,
      nest: true,
      where: { UserId }
    }).then(comments => {
      const RestaurantId = Array.from(new Set(comments.map(comment => comment.RestaurantId)))
      Restaurant.findAll({
        raw: true,
        nest: true,
        where: { id: RestaurantId }
      }).then(restaurant => {
        User.findByPk(req.params.id, { raw: true, nest: true })
          .then(user => {
            return res.render('users/profile', {
              profile: user,
              comments: comments,
              restaurants: restaurant
            })
          })
      })
    })
  },
  editUser: (req, res) => {
    return User.findByPk(req.params.id, { raw: true, nest: true })
      .then((user) => {
        return res.render('users/edit_user', {
          user: user
        })
      })
  },
  updateUser: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', 'Name must exist')
      return res.redirect('back')
    }

    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      imgur.upload(file.path, (_err, img) => {
        return User.findByPk(req.user.id)
          .then(user => {
            user.update({
              name: req.body.name,
              image: file ? img.data.link : user.image
            }).then(user => {
              req.flash('success_messages', 'User Info was successfully update')
              return res.redirect(`/users/${req.user.id}`)
            })
          })
      })
    } else {
      return User.findByPk(req.user.id)
        .then(user => {
          user.update({
            name: req.body.name
          }).then(user => {
            req.flash('success_messages', 'User Info was successfully update')
            return res.redirect(`/users/${req.user.id}`)
          })
        })
    }
  },
  // Favorite
  addFavorite: (req, res) => {
    return Favorite.create({
      UserId: req.user.id,
      RestaurantId: req.params.restaurantId
    }).then((restaurant) => {
      console.log(restaurant)
      req.flash('success_messages', '成功加入收藏')
      return res.redirect('back')
    })
  },
  removeFavorite: (req, res) => {
    return Favorite.findOne({
      where: {
        UserId: req.user.id,
        RestaurantId: req.params.restaurantId
      }
    })
      .then((favorite) => {
        favorite.destroy()
          .then((restaurant) => {
            req.flash('success_messages', '成功移出收藏')
            return res.redirect('back')
          })
      })
  },
  // Like
  addLike: (req, res) => {
    return Like.create({
      UserId: req.user.id,
      RestaurantId: req.params.restaurantId
    })
      .then((restaurant) => {
        req.flash('success_messages', '你喜歡這間餐廳！')
        return res.redirect('back')
      })
  },
  removeLike: (req, res) => {
    return Like.findOne({
      where: {
        UserId: req.user.id,
        RestaurantId: req.params.restaurantId
      }
    })
      .then((like) => {
        like.destroy()
          .then((restaurant) => {
            req.flash('success_messages', '已取消喜歡該餐廳')
            return res.redirect('back')
          })
      })
  },
  // GetTop
  getTopUser: (req, res) => {
    return User.findAll({
      include: [
        { model: User, as: 'Followers' }
      ]
    }).then(users => {
      // 整理 users 資料
      users = users.map(user => ({
        ...user.dataValues,
        // 計算追蹤者人數
        FollowerCount: user.Followers.length,
        // 判斷目前登入使用者是否已追蹤該 User 物件
        isFollowed: req.user.Followings.map(d => d.id).includes(user.id)
      }))
      // 依追蹤者人數排序清單
      users = users.sort((a, b) => b.FollowerCount - a.FollowerCount)
      return res.render('topUser', { users: users })
    })
  },
  // Follow
  addFollowing: (req, res) => {
    return Followship.create({
      followerId: req.user.id,
      followingId: req.params.userId
    })
      .then((followship) => {
        return res.redirect('back')
      })
  },
  removeFollowing: (req, res) => {
    return Followship.findOne({where: {
      followerId: req.user.id,
      followingId: req.params.userId
    }})
      .then((followship) => {
        followship.destroy()
          .then((followship) => {
            return res.redirect('back')
          })
      })
  }
}

module.exports = userController
