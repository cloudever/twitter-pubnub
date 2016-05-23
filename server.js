require('dotenv').config();

var Pubnub = require('pubnub'),
    Twitter = require('twitter')

var serve = require('node-static'),
    fileServer = new serve.Server('./public');

var trackPhrase = 'trump';

require('http').createServer(function(request, response) {
    request.addListener('end', function() {
        fileServer.serve(request, response);
    }).resume();
}).listen(process.env.PORT, process.env.IP);


var TwitterClient = new Twitter({
    consumer_key        : process.env.TWITTER_CONSUMER_KEY,
    consumer_secret     : process.env.TWITTER_CONSUMER_SECRET,
    access_token_key    : process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret : process.env.TWITTER_ACCESS_TOKEN_SECRET
});

var PubnubClient = new Pubnub({
    publish_key: process.env.PUBLISH_KEY,
    subscribe_key: process.env.SUBSCRIBE_KEY
})

var stream = TwitterClient.stream('statuses/filter', {
    track: trackPhrase
});


/** when the tweet has came **/
stream.on('data', function(tweet) {
    /** publish it **/
    PubnubClient.publish({
        channel: process.env.CHANNEL,
        message: tweet.text || ''
    });
});