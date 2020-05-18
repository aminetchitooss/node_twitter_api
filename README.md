# On this branch

> A fun and simple twitter bot

## Quick start:

> Every N seconds the bot is sending a tweet  
 
Using the function **enableBot** above

* You can set the tweet message, 

* The interval in seconds (be careful of short loop time you might get your account shut down)

* The limit of tweets (optional) 

Note: I've used a random number generator in order to mismatch consecutive tweets
  
  > Twitter doesn't allow the same consecutive tweets

## How to use
  
  Make sure to set up a ".env" config file to set up variables like 
  
```bash
CONSUMER_KEY = XXXXXX
CONSUMER_SECRET = XXXXXX
ACCESS_TOKEN = XXXXXX-XXXXX
ACCESS_TOKEN_SECRET = XXXXXX
```

  then run these commands 
  
```bash
npm i

npm start

#with nodemon (restart server with every save)
npm run dev

```
## Special deployment config

### If deployed to don't forget to create a "Procfile"

```bash
worker: node index.js
```

### If depolying to heroku from another branch use 

    git push -f heroku <yourbranchname>:master
