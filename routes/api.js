const agenda = require('../agenda')
const Router = require('koa-router')
const router = new Router()

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