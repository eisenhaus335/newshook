const agenda = require('../agenda')
const Router = require('koa-router')
const router = new Router()

router.get('/jobs/', async ctx => {
    const status = ctx.params.status
    const jobs = await agenda.jobs()
    
    ctx.body = {
        jobs
    }
})

router.get('/jobs/:jobs', async ctx => {
    const jobs_id = ctx.params.jobs
    const jobs = await agenda.jobs({ _id: jobs_id })

    ctx.body = {
        jobs
    }
})

router.post('/jobs/:jobs/repeatAt', async ctx => {
    const jobs_id = ctx.params.jobs
    const time = ctx.request.body
    const jobs = await agenda.jobs({ _id: jobs_id })

    await jobs.repeatAt(time).save()

    ctx.body = {
        jobs
    }
})

router.post('/news/:country', async ctx => {
    const country = ctx.params.country

    const jobs = await agenda.create('sendNews', { country })
    await jobs.save()

    ctx.body = {
        jobs
    }
})

module.exports = router.routes()