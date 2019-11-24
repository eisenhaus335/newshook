const Agenda = require('agenda')
const agenda = new Agenda({
    db: {
        address: 'mongodb+srv://admin:admin@poop-wof5r.gcp.mongodb.net/test?retryWrites=true&w=majority',
        collection: 'jobs'
    },
    processEvery: '1 minutes'
})

<<<<<<< HEAD
agenda.on('sendNews', jobs => {
    console.log('Event: SendNews', { jobs: {...jobs} })
})
module.exports = agenda
=======
agenda.define('send news indonesia', async () => {
    const articles = await NewsApi.v2.topHeadlines({
        country: 'id'
    }).then(news => news.articles.splice(0,5))
    
    console.log(Date.now())
    webhook.send("KORAN KORAN!\nAmbil ini, tambahlah ilmu pengetahuan",{
        embeds: articles.map(article => ({
                url: article.url,
                thumbnail: {
                    url: article.urlToImage,
                },
                title: article.title,
                description: article.description,
                timestamp: article.publishedAt
            })
        )
    })
});

(async function (){
    await agenda.start()
    await agenda.create('send news indonesia').repeatAt('7.00').save()
    await agenda.create('send news indonesia').repeatAt('12.00').save()
    await agenda.create('send news indonesia').repeatAt('16.00').save()
    await agenda.create('send news indonesia').repeatAt('20.00 pm').save()
    await webhook.send('NewsHook READY!')
})()
>>>>>>> 31ff75242fcb992fba3694b3c25ffe1c2b7573d6
