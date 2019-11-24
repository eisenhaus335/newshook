const Koa = require('koa')
const app = new Koa()
const port = process.env.PORT || 8080
const agenda = require('./agenda')
const Agendash = require('agendash')

const indexRoutes = require('./routes')
app.use(indexRoutes)

app.listen(port)
console.log('Web Ready')