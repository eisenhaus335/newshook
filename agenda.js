console.log('Prepare to setup')

const Agenda = require('agenda')
const { MongoClient } = require('mongodb');


const discord = require('discord.js')
const webhook = new discord.WebhookClient(process.env.ID, process.env.TOKEN)

const api = require('newsapi')
const NewsApi = new api(process.env.NEWSAPI)

const agenda = new Agenda({
    db: {
        address: process.env.MONGO,
        collection: 'jobs'
    },
    processEvery: '30 seconds'
})

agenda.define('send news indonesia', async () => {
    const articles = await NewsApi.v2.topHeadlines({
        country: 'id'
    }).then(news => news.articles.splice(0,4))
    
    console.log(Date.now())
    webhook.send({
        content: "KORAN KORAN!\nAmbil ini, tambahlah ilmu pengetahuan",
        embed: articles.map(article => ({
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
    await agenda.create('send news indonesia').repeatAt('7.00 am').save()
    await agenda.create('send news indonesia').repeatAt('12.00 pm').save()
    await agenda.create('send news indonesia').repeatAt('4.00 pm').save()
    await agenda.create('send news indonesia').repeatAt('8.00 pm').save()
    await webhook.send('NewsHook READY!')
})()