// const schedule = require('node-schedule');

// // Schedule a job to run every minute
// const job = schedule.scheduleJob('*/2 * * * * *', function(){
//   console.log('This job runs every 2 seconds.');
// });


// const job1 = schedule.scheduleJob('*/5 * * * * *', function(){
//     console.log('This job runs every 5 seconds.');
//   });
  

//   const job2 = schedule.scheduleJob('*/10 * * * * *', function(){
//     console.log('This job runs every 10 seconds.');
//   });
  

const schedule = require('node-schedule');

function runEvery2Seconds() {
  console.log('This job runs every 2 seconds.');
  setTimeout(runEvery2Seconds, 2000); // 2000ms = 2 seconds
}

function runEvery5Seconds() {
  console.log('This job runs every 5 seconds.');
  setTimeout(runEvery5Seconds, 5000); // 5000ms = 5 seconds
}

function runEvery10Seconds() {
  console.log('This job runs every 10 seconds.');
  setTimeout(runEvery10Seconds, 10000); // 10000ms = 10 seconds
}

runEvery2Seconds();
runEvery5Seconds();
runEvery10Seconds();