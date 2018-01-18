# tweet-skimmer

This is a quick node.js script that generates an RSS feed of a user's timeline without replies or retweets. Call it like this:

	/timeline?name=[username w/o @]

It gets the user's most recent tweets via the Twitter API. You'll need to register an app at the Twitter API (https://apps.twitter.com/) and pass in a consumer key, consumer secret, and app bearer token when you start this script. It will look something like this:

	TWITTER_CONSUMER_KEY='[key]' TWITTER_CONSUMER_SECRET='[secret]' TWITTER_BEARER_TOKEN='[token]' node server.js
  
Happy tweet skimming!
