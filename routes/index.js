var express = require('express');
var router = express.Router();
var cheerio = require('cheerio');
var request = require('request');

function trim(s){
  return ( s || '' ).replace( /^\s+|\s+$/g, '' );
}

var getPriceValue = function(priceText) {
    if (priceText.toUpperCase() === 'EVS') {
        return 1;
    }
    var splitPrice = priceText.split('/');
    return +splitPrice[1] / +splitPrice[0];
};

router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

router.get('/get-all-races', function(req, res, next) {
  var url = 'http://www.sportinglife.com/racing/live-shows';
  request(url, function (error, response, html) {
      if (!error) {
          var $ = cheerio.load(html);
          var races = [];
          $('#select-racecard').find('> option').each(function() {
              var option = $(this);
              var data = option.text().replace(/\n/g, '').split('\t\t\t');
              var url = option.val().replace('/racecards/', '/live-shows/').replace('/racecard/', '/live-show/');
              races.push({name: trim(data[1]), time: trim(data[0]), url: url});
          });
          res.json({races: races});
      }
  });
});

router.get('/get-racecard', function(req, res) {
    var url = req.query['racecard-url'];
    request('http://www.sportinglife.com' + url, function(error, response, html) {
        if (!error) {
            var $ = cheerio.load(html);
            var racecard = [];
            $('table').eq(0).find('tr').each(function() {
                var cells = $(this).children('td');
                if (cells.length > 0) {
                    var horseNumber = cells.eq(0).text();
                    var horseName = cells.eq(1).children().first().text();
                    var status = 0;
                    var priceList = [];
                    var priceValueList = [];
                    var lastPriceValue = -1;
                    $(this).find('ul[class="odds-prog"]').children('li').each(function() {
                        var priceText = trim($(this).text());
                        priceList.push(priceText);
                        var newPriceValue = getPriceValue(priceText);
                        priceValueList.push(newPriceValue);
                        if (lastPriceValue !== -1) {
                            if (newPriceValue < lastPriceValue) {
                                status = Math.min(status + 1, 3);
                            }
                            else if (newPriceValue > lastPriceValue) {
                                status = 0;
                            }
                        }
                        lastPriceValue = newPriceValue;
                    });
                    racecard.push({
                        horseNumber: horseNumber,
                        horseName: horseName,
                        priceList: priceList,
                        priceValueList: priceValueList,
                        status: status
                    });
                }
            });
            res.json({racecard: racecard, url: 'http://www.sportinglife.com' + url});
        }
    })
});

module.exports = router;
