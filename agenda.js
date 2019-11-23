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
    }
})

agenda.define('send news indonesia', async () => {
    const news = await NewsApi.v2.topHeadlines({
        country: 'id'
    }).splice(0,4)
    webhook.send('Dibaca Beritanya')
    webhook.send({
        embeds: news.articles.map(article => ({
            url: article.url,
            thumbnail: {
                url: article.urlToImage,
            },
            title: article.title,
            description: article.description,
            timestamp: article.publishedAt
        }))
    })
})


async function run() {
    await agenda.start()
    await agenda.schedule('at 7.00', 'send news indonesia').repeatAt('7.00')
    await agenda.schedule('at 12.00', 'send news indonesia').repeatAt('12.00')
    await agenda.schedule('at 16.00', 'send news indonesia').repeatAt('16.00')
    await agenda.schedule('at 20.00am', 'send news indonesia').repeatAt('20.00')
    await webhook.send('Newshook Bekerja')
}

run().catch(error => {
    console.error(error);
    process.exit(-1);
})