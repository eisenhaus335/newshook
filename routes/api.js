const agenda = require('../agenda')
const Router = require('koa-router')
const router = new Router()


router.get('/jobs/:jobs', async ctx => {
    const { jobs } = ctx.params

    const jobs_result = agenda._collection.aggregate([
        {$match: { name: 'sendNews' }},
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
    ]).catch(error => {
        console.log(error)
    })
    ctx.body = jobs_result
})

router.post('/news/:country', async (ctx, next) => {
    const { country } = ctx.params
    const body = ctx.request.body
    if(!country) next()
    
    const jobs = agenda.create('sendNews', { country })
    if(body.repeatAt) jobs.repeatAt(body.repeatAt)

    await jobs.save()
        .then(result => {
            ctx.body = result
        })
})

module.exports = router.routes()