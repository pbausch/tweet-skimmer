var express = require('express');
var RSS = require('rss');
var url = require('url');
var twitter = require('twitter');
var app = express();
var xml;

app.get('/timeline', function(req, res) {

	var queryData = url.parse(req.url, true).query;
	
	if (queryData.name) {

		var client = new twitter({
		  consumer_key: process.env.TWITTER_CONSUMER_KEY,
		  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
		  bearer_token: process.env.TWITTER_BEARER_TOKEN
		});

		client.get('statuses/user_timeline', {screen_name: queryData.name, tweet_mode: 'extended'},  function(error, tweets, response) {
		  	if (!error) {
				var feed = new RSS({
					title: queryData.name + '\'s tweets on Twitter',
					description: queryData.name + '\'s tweets on Twitter',
					site_url: 'https://twitter.com/' + queryData.name + '/',
					language: 'en',
					ttl: '60'
				});			
				for(var i in tweets) {
					var tweet = tweets[i];
					var user = tweet['user'];
					var urls = tweet['entities']['urls'];
					var post_title = 'tweet by ' + user['screen_name'];
					var post_url = 'https://twitter.com/'+ user['screen_name'] +'/status/' + tweet['id_str'];
				    var post_desc = tweet['full_text'];
					for (var j in urls) {
						post_desc = post_desc.replace(urls[j]['url'],'<a href="'+urls[j]['expanded_url']+'">'+urls[j]['display_url']+'</a>');
					}
					var is_reply = tweet['in_reply_to_status_id'];
					if (is_reply === null) {
						feed.item({
							title: post_title,
							description: post_desc,
							url: post_url
						});
					}

				}
				xml = feed.xml({indent: true});

				res.end(xml);
			}
			else { 
				console.log(error); 
				res.end("Problems, sorry!");
			}
		});
		
  	} else {
		res.end("Need a name!");
  	}
});

app.listen('8087');
console.log('server started on 8087');