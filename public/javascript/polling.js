var data = require('./data');

var refreshRacecard = function(url) {
    var fullUrl = '/get-racecard' + '?racecard-url=' + url;
    var horseList = $('.horse-list');
    $.get(fullUrl, function (response) {
        var racecardData = response.racecard;
        for (var i = 0; i < racecardData.length; i++) {
            var el = document.querySelector('.horse[horse-number="' + racecardData[i].horseNumber + '"]');
            if (el.getAttribute('status') !== data.statusList[racecardData[i].status]) {
                var newOne = el.cloneNode(true);
                newOne.setAttribute('class', 'horse');
                newOne.setAttribute('status', data.statusList[racecardData[i].status]);
                el.parentNode.replaceChild(newOne, el);
            };
        }
        setTimeout(pollCurrentRacecard, 1000);
    });
};

var pollCurrentRacecard = function() {
    var raceSelect = document.querySelector('.race-select');
    if (raceSelect) {
        var currentRaceUrl = raceSelect.value;
        if (currentRaceUrl !== 'none') {
            refreshRacecard(currentRaceUrl);
        }
        else {
            setTimeout(pollCurrentRacecard, 1000)
        }
    }
    else {
        setTimeout(pollCurrentRacecard, 1000)
    }
};

module.exports = {
    loaded: function() {
        pollCurrentRacecard();
    }
};