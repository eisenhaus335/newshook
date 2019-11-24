const agenda = require('./agenda')
const discord = require('./discord')

async function run() {
    await agenda.start()
    await discord.login(process.env.TOKEN)
}

run().catch(error => {
    console.log(error)
    process.exit(-1)
})