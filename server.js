var express = require('express');
var RSS = require('rss');
var url = require('url');
var rp = require('request-promise');
var cheerio = require('cheerio');
var app = express();
var xml;

app.get('/timeline', function(req, res) {

	var queryData = url.parse(req.url, true).query;
	
	if (queryData.name) {

		var twitter_url = 'https://twitter.com/@'+ queryData.name +'/';
		var options = {
		    uri: twitter_url,
		    transform: function (body) {
		        return cheerio.load(body);
		    }
		};

		rp(options) 
		    .then(function ($) {
				var feed = new RSS({
					title: queryData.name + '\'s tweets on Twitter',
					description: queryData.name + '\'s tweets on Twitter',
					site_url: 'https://twitter.com/' + queryData.name + '/',
					language: 'en',
					ttl: '60'
				});			
				$('.stream-item').each(function(){
					var data = $(this);
					var user = data.find('.fullname').text();
					var post_title = 'tweet by ' + user;
					var post_url = 'https://twitter.com/' + data.find('.time').find('a').attr('href');
					var post_desc = data.find('.tweet-text').html();
					var has_retweet_text = data.find('.js-retweet-text');
					var post_date = data.find('.js-short-timestamp').attr('data-time-ms');
					if ((typeof post_date != 'undefined') && (post_desc !== '') && (has_retweet_text.length == 0)) {
						var post_date_iso = new Date(parseInt(post_date)).toISOString();
						feed.item({
							title: post_title,
							description: post_desc.replace(/<a/g," <a"),
							url: post_url,
							date: post_date_iso
						});
					}

				});
				xml = feed.xml({indent: true});

				res.end(xml);
			})
			.catch(function (err) {
				console.log(err);
			});
		
  	} else {
		res.end("Need a name!");
  	}
});

app.listen('8087');
console.log('server started on 8087');