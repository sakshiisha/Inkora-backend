require('dotenv').config()
const express = require('express')
const cors = require('cors')
const sequelize = require('./config/db')

const authRoutes = require('./routes/authRoutes')
const blogRoutes = require('./routes/blogRoutes')

const app = express()

const allowedOrigins = [
  'http://localhost:5173',
  'inkora-frontend.vercel.app',
]

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    },
    credentials: true,
  })
)

app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/blogs', blogRoutes)

app.get('/', (req, res) => {
  res.send('Inkwell API is running')
})

const PORT = process.env.PORT || 5000

sequelize
  .sync({ alter: true })
  .then(() => {
    console.log('MySQL connected & tables synced')
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
  })
  .catch((err) => {
    console.error('Failed to connect to MySQL:', err.message)
  })