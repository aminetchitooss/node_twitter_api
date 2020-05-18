require('dotenv').config();
const CryptoJS = require("crypto-js");

class Config {

    twitterConfig = {
        consumer_key: process.env.CONSUMER_KEY,
        consumer_secret: process.env.CONSUMER_SECRET,
        access_token: process.env.ACCESS_TOKEN,
        access_token_secret: process.env.ACCESS_TOKEN_SECRET,
        // timeout_ms: 60 * 1000,  // optional HTTP request timeout to apply to all requests.
        // strictSSL: true,     // optional - requires SSL certificates to be valid.
    }

    cipher = this.encrypt(Date.now().toString())

    checkCipherError(param) {
        const decyptedCipher = this.decrypt(param)
        if (Number(decyptedCipher) && Date.now() < Number(decyptedCipher) + 12 * 3600 * 1000) {
            return false
        }
        return true
    }

    encrypt(param) {
        return CryptoJS.AES.encrypt(param, process.env.KEY).toString()
    }

    decrypt(param) {
        if (!param)
            return ""
        return CryptoJS.AES.decrypt(param, process.env.KEY).toString(CryptoJS.enc.Utf8)
    }

}

module.exports = Config