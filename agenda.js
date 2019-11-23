console.log('Prepare to setup')

const Agenda = require('agenda')
const { MongoClient } = require('mongodb');


const discord = require('discord.js')
const webhook = new discord.WebhookClient(process.env.ID, process.env.TOKEN)

const api = require('newsapi')
const NewsApi = new api(process.env.NEWSAPI)

const agenda = new Agenda({
    mongo: {
        address: process.env.MONGO,
        collection: 'NewsHook'
    }
})

agenda.define('send news indonesia', async () => {
    const news = await NewsApi.v2.topHeadlines({
        country: 'id'
    })
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

(async function() {
    const newsReport = agenda.create('send news indonesia')
    await newsReport.repeatAt('at 7.00').save()
    await newsReport.repeatAt('at 12.00').save()
    await newsReport.repeatAt('at 16.00').save()
    await newsReport.repeatAt('at 20.00').save()
})