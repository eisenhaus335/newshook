const agenda = require('./agenda')
const discord = require('./discord')
async function run() {
    await agenda.start()
    await discord.login('NjQ3NDI2NzU3NTIzMTQ0NzE0.XdoedQ.9DzByVp0i-w5GoaXvWdMKoomqB4')
}

run().catch(error => {
    console.log(error)
    process.exit(-1)
})