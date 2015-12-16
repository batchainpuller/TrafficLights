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