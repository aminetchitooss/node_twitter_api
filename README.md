# On this branch is a simple twitter bot

### As a quick start, every N (defaultValue = 60) seconds the bot is sending a tweet  
 
> with the function enableBot(pTweetMsg, pLimitTweets, pLoopTime)

    > You can set the tweet message, 

    > The interval in seconds (be careful of short loop time you might get your account shut down)

    > The limit of tweets (optional) 

### I've used a randmom number generator in order to mismatch consecutive tweets
  
  > Twitter doesn't allow the same consecutive tweets

## How to use
  
  Make sure to set up a ".env" config file to set up variables like 
  
```bash
CONSUMER_KEY = XXXXXX
CONSUMER_SECRET = XXXXXX
ACCESS_TOKEN = XXXXXX-XXXXX
ACCESS_TOKEN_SECRET = XXXXXX
```

  If deployed to don't forget to create a "Procfile"

```bash
worker: node index.js
```

  then run these commands 
  
```bash
npm i

npm start

#with nodemone (restart server with every save)
npm run dev

```
