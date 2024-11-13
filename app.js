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
const passport = require('passport');
require('./middlewares/authentication/auth')

const Scheduler = require('./components/Scheduler');
const SessionManager = require('./components/SessionManager');

// Instantiate components
const scheduler = new Scheduler();
// const sessionManager = new SessionManager();




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


// Initialize passport middleware
app.use(passport.initialize());

//Middleware for authentication
app.use('/', authRouter);


// Middleware to handle routes
// app.use('/api', requiresAuth(), booksRouter, authorsRouter, testbooksRouter);
app.use('/api', usersRouter, adminsRouter, sessionsRouter);


app.get('/', (req, res) => {
  res.send('Welcome to the AjoZave API');
});


// Get all running jobs
app.get('/running-jobs', (req, res) => {
  try {
    const jobs = scheduler.getAllJobs();
    res.status(200).json(jobs);
  } catch (err) {
    res.status(500).send('Error fetching running jobs');
  }
});



// Test endpoint to create sessions and schedule jobs
app.post('/schedule-session', (req, res) => {
  const { sessionId, deadline, cronExpression } = req.body;

  // Create session
  sessionManager.createSession({ sessionId, deadline });

  // Schedule job for contribution deadline
  scheduler.scheduleJob(sessionId, cronExpression, () => {
    sessionManager.handleContributionDeadline(sessionId);
  });

  res.status(201).send(`Session ${sessionId} scheduled with cron "${cronExpression}"`);
});

// Cancel a scheduled job
app.delete('/cancel-job/:jobId', (req, res) => {
  const { jobId } = req.params;

  try {
    scheduler.cancelJob(jobId);
    res.status(200).send(`Job with ID ${jobId} has been canceled.`);
  } catch (err) {
    res.status(400).send(err.message);
  }
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


