require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./utils/dbConnect');
const rateLimit = require('express-rate-limit')
// const logger = require('./middlewares/Logger/logger');
// const auth0Middleware = require('./middlewares/Authentication/auth0');
// const { requiresAuth } = require('express-openid-connect');
const port = process.env.PORT || 4000;
const authRouter = require('./routes/auth');
const usersRouter = require('./routes/users')
const sessionsRouter = require('./routes/sessions')
const adminsRouter = require('./routes/admins')
require('./middlewares/authentication/auth')


const app = express();

// Connect to database
connectDB();

// Middleware to handle authentication
// app.use(auth0Middleware);

const limiter = rateLimit({
  windowMs: 0.2 * 60 * 1000, // 15 minutes
  max: 4, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false
})

// Middleware to allow cross-origin requests
app.use(cors());

//  apply to all requests
app.use(limiter)

// Middleware to parse request body
app.use(bodyParser.json());

//Middleware for authentication
app.use('/', authRouter);


// Middleware to handle routes
// app.use('/api', requiresAuth(), booksRouter, authorsRouter, testbooksRouter);
app.use('/api', usersRouter, adminsRouter, sessionsRouter);


app.get('/', (req, res) => {
  res.send('Welcome to the AjoZave API');
});

// Middleware to handle errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong on the server.');
});


app.listen(port, () => {
  // logger.info(`Server is running on port ${port}`);
  console.log(`Server is running on port ${port}`);

});


