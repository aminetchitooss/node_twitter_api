const Twit = require('twit')
const config = require('./config')

const T = new Twit(config)

function tweetIt(pTweetMsg) {

    T.post('statuses/update', { status: pTweetMsg }, tweeted)

    function tweeted(err, data, response) {
        if (err) {
            console.log('Smth went wrooooooooong', err)
        } else {
            console.log('nicely done')
        }

    }
}

function getTweets(pSearch) {
    const params = {
        q: pSearch,
        count: 10,
        // lang: 'fr'
    }

    T.get('search/tweets', params, gotData)

    function gotData(err, data, response) {
        console.log(data.statuses.map(res => res.text))
    }
}

//to tweet 
tweetIt('hellow World')

getTweets('javascript')