const schedule = require('node-schedule');
const winston = require('winston');

class Scheduler {
	constructor() {
		this.jobs = new Map(); // To track all scheduled jobs
	}

	getAllJobs() {
		return Array.from(this.jobs.entries()).map(([jobId, job]) => ({
		  jobId,
		  nextInvocation: job.nextInvocation() ? job.nextInvocation().toISOString() : null,
		}));
	}

	scheduleJob(jobId, cronExpression, callback) {
		if (this.jobs.has(jobId)) {
			throw new Error(`Job with ID ${jobId} already exists.`);
		}

		const job = schedule.scheduleJob(cronExpression, callback);
		this.jobs.set(jobId, job);

		winston.info(`Scheduled job "${jobId}" with cron "${cronExpression}".`);
	}

	cancelJob(jobId) {
		if (!this.jobs.has(jobId)) {
			throw new Error(`Job with ID ${jobId} not found.`);
		}

		const job = this.jobs.get(jobId);
		job.cancel();
		this.jobs.delete(jobId);

		winston.info(`Cancelled job "${jobId}".`);
	}

	rescheduleJob(jobId, newCronExpression) {
		if (!this.jobs.has(jobId)) {
			throw new Error(`Job with ID ${jobId} not found.`);
		}

		const job = this.jobs.get(jobId);
		job.reschedule(newCronExpression);

		winston.info(`Rescheduled job "${jobId}" to "${newCronExpression}".`);
	}
}

module.exports = Scheduler;
