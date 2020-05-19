const Twit = require('twit')
const cors = require('cors')
const config = require('./config')
const canvas = require('./canvas')
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const express = require('express')
const app = express()
const Joi = require('@hapi/joi');
const path = require('path');
const port = process.env.PORT || 4200
const Encryption = new config()
const Draw = new canvas()
const T = new Twit(Encryption.twitterConfig)
const SUCCESS = "SUCCESS"
const ERROR = "ERROR"
const allowedOrigins = [
    'https://tchitostwitterapi.herokuapp.com/', 'http://localhost:' + port
];

app.use(cors({
    origin: function (origin, callback) {
        // allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            var msg = 'The CORS policy for this site does not ' +
                'allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    }
}));

//middle ware config
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
// View engine setup
app.engine('handlebars', exphbs({
    defaultLayout: '',
}));
app.set('view engine', 'handlebars');

// Static folder
app.use('/public', express.static(path.join(__dirname, 'public')));
app.listen(port, () => console.log('server running on ' + port))


app.get('/', (req, res) => {
    res.render('home');
});

app.post('/getTweets', (req, res) => {

    if (Encryption.checkCipherError(req.body.cipher))
        return res.status(401).send('cipher error')

    const { error } = validateGetTweetData(req.body)
    if (error) { return res.status(403).send(error.details[0].message) }

    const params = {
        q: req.body.search,
        count: req.body.limit ? req.body.limit : 5,
        lang: req.body.lang ? req.body.lang : 'en'
    }

    return getInfo(params).then(result => {
        return res.end(JSON.stringify(result))
    }).catch(err => {
        console.log('getting tweets went wrong', err)
        return res.status(500).send(JSON.stringify(err))
    })

});

app.post('/postPlainTweet', (req, res) => {

    if (Encryption.checkCipherError(req.body.cipher))
        return res.status(401).send('cipher error')

    const { error } = validatePostTweetData(req.body)
    if (error) { return res.status(403).send(error.details[0].message) }

    return tweetIt({ status: req.body.msgPost }).then(result => {
        console.log('nicely done tweet sent')
        return res.end('Media tweet sent Ok')
    }).catch(err => {
        console.log('Smth went wrooooooooong in posting', err)
        return res.status(500).send(JSON.stringify(err))
    })

});
app.post('/postMediaTweet', async (req, res) => {

    if (Encryption.checkCipherError(req.body.cipher))
        return res.status(401).send('cipher error')

    const { error } = validatePostMediaTweetData(req.body)
    if (error) { return res.status(403).send(error.details[0].message) }

    const medialistIds = []
    for (const content of req.body.listB64Content) {
        try {
            const resp = await uploadMedia(content)
            medialistIds.push(resp.data)
        } catch (error) {
            return res.status(500).send(error)
        }

    }

    return tweetIt({ status: req.body.msgPost, media_ids: medialistIds }).then(result => {
        console.log('Media tweet sent')
        return res.end('Media tweet sent Ok')
    }).catch(err => {
        console.log('Smth went wrooooooooong in posting media', err)
        return res.status(500).send(JSON.stringify(err))
    })

});
app.post('/postDrawTweet', async (req, res) => {

    if (Encryption.checkCipherError(req.body.cipher))
        return res.status(401).send('cipher error')

    const { error } = validatePostDrawTweetData(req.body)
    if (error) { return res.status(403).send(error.details[0].message) }

    try {
        const result = await Draw.drawFrom(req.body.messageToDraw)
        res.end("data:image/png;base64," + result)
        // const vListB64Content = [result]
        // const medialistIds = []
        // for (const content of vListB64Content) {
        //     try {
        //         const resp = await uploadMedia(content)
        //         medialistIds.push(resp.data)
        //     } catch (error) {
        //         return res.status(500).send(error)
        //     }

        // }

        // return tweetIt({ status: req.body.msgPost, media_ids: medialistIds }).then(result => {
        //     console.log('Media tweet sent')
        //     return res.end('Media Draw tweet sent Ok')
        // }).catch(err => {
        //     console.log('Smth went wrooooooooong in posting media', err)
        //     return res.status(500).send(JSON.stringify(err))
        // })        
    } catch (error) {
        return res.end(error.message)
    }

});

function uploadMedia(b64content) {

    return new Promise((resolve, reject) => {

        // first we must post the media to Twitter
        T.post('media/upload', { media_data: b64content }, function (err, data, response) {
            if (err)
                reject(err)
            else {
                // now we can assign alt text to the media, for use by screen readers and
                // other text-based presentations and interpreters
                var mediaIdStr = data.media_id_string
                var altText = "Small flowers in a planter on a sunny balcony, blossoming."
                var meta_params = { media_id: mediaIdStr, alt_text: { text: altText } }

                T.post('media/metadata/create', meta_params, function (err, data, response) {
                    if (!err) {
                        // now we can reference the media and post a tweet (media will attach to the tweet)
                        resolve({ status: SUCCESS, data: mediaIdStr })
                    } else {
                        reject(err)
                    }
                })
            }
        })
    })

}

function tweetIt(param) {

    return new Promise((resolve, reject) => {

        T.post('statuses/update', param, (err, data, response) => {
            if (err) {
                reject(err)
            } else {
                resolve(data)
            }
        })
    })
}

function getInfo(pSearchParams) {
    return new Promise((resolve, reject) => {

        T.get('search/tweets', pSearchParams, (err, data, response) => {
            if (err) {
                reject(err)
            } else {
                resolve(data)
            }
        })
    })
}

function validateGetTweetData(pData) {
    const schema = Joi.object({
        search: Joi.string().required(),
        count: Joi.number(),
        lang: Joi.string(),
        cipher: Joi.string(),
    })
    return schema.validate(pData)
}
function validatePostTweetData(pData) {
    const schema = Joi.object({
        msgPost: Joi.string().required(),
        cipher: Joi.string(),
    })
    return schema.validate(pData)
}
function validatePostMediaTweetData(pData) {
    const schema = Joi.object({
        msgPost: Joi.string().required(),
        listB64Content: Joi.array().items(Joi.string().base64()).required(),
        cipher: Joi.string(),
    })
    return schema.validate(pData)
}
function validatePostDrawTweetData(pData) {
    const schema = Joi.object({
        messageToDraw: Joi.string().required(),
        msgPost: Joi.string(),
        cipher: Joi.string(),
    })
    return schema.validate(pData)
}

console.log(Encryption.cipher)