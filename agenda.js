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
    })
    news.articles.splice(0,4)
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
    await webhook.send('Newshook sudah berjalan')
    await agenda.schedule('send news indonesia').repeatAt('7.00 am').save()
    await agenda.schedule('send news indonesia').repeatAt('12.00 am').save()
    await agenda.schedule('send news indonesia').repeatAt('16.00 pm').save()
    await agenda.schedule('send news indonesia').repeatAt('20.00 pm').save()
    
}

run().catch(error => {
    console.error(error);
    process.exit(-1);
})