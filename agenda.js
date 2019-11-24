const Agenda = require('agenda')
const agenda = new Agenda({
    db: {
        address: 'mongodb+srv://admin:admin@poop-wof5r.gcp.mongodb.net/test?retryWrites=true&w=majority',
        collection: 'jobs'
    },
    processEvery: '1 minutes'
})

agenda.on('sendNews', jobs => {
    console.log('Event: SendNews', { jobs: {...jobs} })
})
module.exports = agenda