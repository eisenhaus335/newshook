const Agenda = require('agenda')
const agenda = new Agenda({
    db: {
        address: process.env.MONGO,
        collection: 'jobs'
    },
    processEvery: '1 minutes'
})
const Client = require('./discord')

agenda.on('sendNews', async jobs => {
    const data = job.attrs.data
    const articles = await NewsApi.v2.topHeadlines({
        country: data.country
    }).then(news => news.articles.splice(0,5))
    
    const channel = Client.channels.find('name', process.env.CHANNEL)
    channel.send("KORAN KORAN!\nAmbil ini, tambahlah ilmu pengetahuan",{
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
})

module.exports = agenda