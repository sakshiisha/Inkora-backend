const { DataTypes } = require('sequelize')
const sequelize = require('../config/db')
const User = require('./User')

const Blog = sequelize.define('Blog', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  excerpt: {
    type: DataTypes.STRING(300),
    allowNull: true,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Essay',
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  readTime: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('draft', 'published'),
    defaultValue: 'draft',
  },
}, {
  tableName: 'blogs',
  timestamps: true,
})

// Relationships — one user has many blogs
User.hasMany(Blog, { foreignKey: 'userId', onDelete: 'CASCADE' })
Blog.belongsTo(User, { foreignKey: 'userId' })

module.exports = Blog