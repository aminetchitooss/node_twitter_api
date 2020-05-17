const Twit = require('twit')
const config = require('./config')

const T = new Twit(config)

let count = 0

function enableBot(pTweetMsg, pLimitTweets, pLoopTime) {
    console.log("Bot On ...")
    const loopFunction = setInterval(() => {
        const rn = Math.floor(Math.random() * 100)
        T.post('statuses/update', { status: pTweetMsg + rn }, (err) => {
            if (err) {
                console.log('Smth went wrooooooooong', err)
            } else {
                console.log('nicely done')
            }
            if (pLimitTweets && count == pLimitTweets) {
                console.log('Bot Off')
            }
        })
        count++;
        if (pLimitTweets && count == pLimitTweets) {
            clearInterval(loopFunction)
        }
    }, pLoopTime * 1000);
}

// Trigger the bot
enableBot("#BotEnabled .. and the random winner is number ", 3, 20)