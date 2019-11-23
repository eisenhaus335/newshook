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
        console.log("job run at "+new Date())
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
    await sendnews.repeatAt('7:00 AM').save()
    await sendnews.repeatAt('12:00 AM').save()
    await sendnews.repeatAt('5:00 PM').save()
    await sendnews.repeatAt('8:00 PM').save()
    console.log('Everything is done')
}


run().catch(error => {
    console.error(error);
    process.exit(-1);
  });

