const agenda = require('../agenda')
const Router = require('koa-router')
const router = new Router()

router.get('/jobs', async ctx => {
    const jobs = await agenda.jobs()
    ctx.body = {
        ...jobs
    }
})

router.get('/jobs/:jobs', async (ctx, next) => {
    const body = ctx.request.body
    if (!ctx.params.jobs) {
        next()
    }
    console.log('test')
    const collection = agenda._collection.collection || agenda._collection;
    const jobs = await collection.aggregate([
        {$match: { name: ctx.params.jobs }},
        {$sort: {
            nextRunAt: -1,
            lastRunAt: -1,
            lastFinishedAt: -1
        }},
        {$project: {
            _id: 0,
            job: '$$ROOT',
            nextRunAt: {$ifNull: ['$nextRunAt', 0]},
            lockedAt: {$ifNull: ['$lockedAt', 0]},
            lastRunAt: {$ifNull: ['$lastRunAt', 0]},
            lastFinishedAt: {$ifNull: ['$lastFinishedAt', 0]},
            failedAt: {$ifNull: ['$failedAt', 0]},
            repeatInterval: {$ifNull: ['$repeatInterval', 0]}
        }},
        {$project: {
            job: '$job',
            _id: '$job._id',
            running: {$and: [
              '$lastRunAt',
              {$gt: ['$lastRunAt', '$lastFinishedAt']}
            ]},
            scheduled: {$and: [
              '$nextRunAt',
              {$gte: ['$nextRunAt', new Date()]}
            ]},
            queued: {$and: [
              '$nextRunAt',
              {$gte: [new Date(), '$nextRunAt']},
              {$gte: ['$nextRunAt', '$lastFinishedAt']}
            ]},
            completed: {$and: [
              '$lastFinishedAt',
              {$gt: ['$lastFinishedAt', '$failedAt']}
            ]},
            failed: {$and: [
              '$lastFinishedAt',
              '$failedAt',
              {$eq: ['$lastFinishedAt', '$failedAt']}
            ]},
            repeating: {$and: [
              '$repeatInterval',
              {$ne: ['$repeatInterval', null]}
            ]}
        }},
    ])

    ctx.body = {
        jobs
    }
})

module.exports = router.routes()