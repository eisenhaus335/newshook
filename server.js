const Koa = require('koa')
const app = new Koa()
const port = process.env.PORT || 8080
const bodyParser = require('koa-bodyparser')
app.use(bodyParser())

app.listen(port)

console.log(`Server is listening at ${port}`)