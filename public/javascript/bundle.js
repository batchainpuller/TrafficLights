(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = {
    statusList:  [
        'red', 'amber', 'yellow', 'green'
    ]
};
},{}],2:[function(require,module,exports){
var raceMenu = require('./raceMenu');
var polling = require('./polling');

Promise.resolve()
    .then(raceMenu.loaded)
    .then(polling.loaded);
},{"./polling":3,"./raceMenu":4}],3:[function(require,module,exports){
var data = require('./data');

var refreshRacecard = function(url) {
    var fullUrl = '/get-racecard' + '?racecard-url=' + url;
    var horseList = $('.horse-list');
    $.get(fullUrl, function (response) {
        var racecardData = response.racecard;
        for (var i = 0; i < racecardData.length; i++) {
            var el = document.querySelector('.horse[horse-number="' + racecardData[i].horseNumber + '"]');
            console.log('current status = ' + el.getAttribute('status'));
            console.log('new status = ' + data.statusList[racecardData[i].status]);
            if (el.getAttribute('status') !== data.statusList[racecardData[i].status]) {
                var newOne = el.cloneNode(true);
                newOne.setAttribute('class', 'horse');
                newOne.setAttribute('status', data.statusList[racecardData[i].status]);
                el.parentNode.replaceChild(newOne, el);
            }
        }
        setTimeout(pollCurrentRacecard, 1000);
    });
};

var pollCurrentRacecard = function() {
    var raceSelect = document.querySelector('.race-select');
    console.log(raceSelect);
    if (raceSelect) {
        var currentRaceUrl = raceSelect.value;
        console.log(currentRaceUrl);
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
}
},{"./data":1}],4:[function(require,module,exports){
var data = require('./data');

var populateRaceList = function() {
    $.get('/get-all-races', function (response) {
        var races = response.races;
        var raceSelect = $('.race-select');
        for (var i = 0; i < races.length; i++) {
            var time = races[i].time;
            var name = races[i].name;
            var url = races[i].url;
            raceSelect.append($('<option/>', {text: time + ' ' + name, value: url}));
        }
    });
};

var createHorseListItem = function(horseData) {
    var listItem = document.createElement('li');
    listItem.classList.add('horse');

    listItem.setAttribute('status', data.statusList[horseData.status]);

    var horseNumber = document.createElement('div');
    horseNumber.classList.add('horse-number');
    horseNumber.innerHTML = horseData.horseNumber;
    listItem.setAttribute('horse-number', horseData.horseNumber);
    listItem.appendChild(horseNumber);

    var horseName = document.createElement('div');
    horseName.classList.add('horse-name');
    horseName.innerHTML = horseData.horseName;
    listItem.appendChild(horseName);

    var priceListData = horseData.priceList.reverse();
    var priceListString = '';
    for (var i = 0; i < priceListData.length; i++) {
        priceListString += priceListData[i] + '  ';
    }

    var priceList = document.createElement('div');
    priceList.classList.add('price-list');
    priceList.innerHTML = priceListString;
    listItem.appendChild(priceList);

    return listItem;

};

var loadRacecard = function(url) {
    var fullUrl = '/get-racecard' + '?racecard-url=' + url;
    var horseList = $('.horse-list').empty();
    $.get(fullUrl, function (response) {
        var racecardData = response.racecard;
        for (var i = 0; i < racecardData.length; i++) {
            horseList.append(createHorseListItem(racecardData[i]));
        }
    });
};

module.exports = {
    loaded: function() {
        populateRaceList();
        document.addEventListener('change', function(event) {
            if (event.target.classList.contains('race-select')) {
                loadRacecard(event.target.value);
            }
        });
    }
};
},{"./data":1}]},{},[2]);
