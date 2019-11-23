console.log('Prepare to setup')

const Agenda = require('agenda')
const { MongoClient } = require('mongodb');


const discord = require('discord.js')
const webhook = new discord.WebhookClient(process.env.ID, process.env.TOKEN)

const api = require('newsapi')
const NewsApi = new api(process.env.NEWSAPI)

async function run() {
    const agenda = new Agenda({
        db: {
            address: process.env.MONGO
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

    await new Promise(resolve => agenda.once('ready', resolve));

    const sendnews = agenda.create('send news indonesia')
    await agenda.start()
    await sendnews.repeatAt('at 7.00am').save()
    await sendnews.repeatAt('at 12.00am').save()
    await sendnews.repeatAt('at 5.00pm').save()
    await sendnews.repeatAt('at 8.00pm').save()
    console.log('Everything is done')
}


run().catch(error => {
    console.error(error);
    process.exit(-1);
  });

