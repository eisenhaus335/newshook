const Koa = require('koa')
const app = new Koa()
const port = process.env.PORT || 8080
const agenda = require('./agenda')
const Agendash = require('agendash')

app.use(async (ctx, next) => {
    try {
      await next();
    } catch (err) {
      ctx.status = err.status || 500;
      ctx.body = err.message;
      ctx.app.emit('error', err, ctx);
    }
});

const indexRoutes = require('./routes')
app.use(indexRoutes)

app.listen(port)
console.log('Web Ready')