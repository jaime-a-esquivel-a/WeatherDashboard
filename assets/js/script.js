//8317f2907e7792815e65ac40b4c293be
//https://api.openweathermap.org/data/2.5/weather?q=London&appid={API key}
//how to display the weather icon:
//var iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";

var weatherContainer  = $('#WeatherZone');
var forecastContainer = $('#ForecastZone');

printSearchHistory();

//getForecast('Tulum'); //erase

function getCity(){

  var lv_city = $('#InputCity').val();
  $('#InputCity').val('');
  lv_city = capitalizeFirstLetter(lv_city);
  getWeather(lv_city);

}

function getWeather(lp_city){

lp_city = capitalizeFirstLetter(lp_city);

fetch('https://api.openweathermap.org/data/2.5/weather?q='+lp_city+'&appid=8317f2907e7792815e65ac40b4c293be&units=metric')
.then(function (response) {
    return response.json();
  })
.then(function (data) {

    if ( data.cod == 200 ){

      console.log(data);
      console.log('City: ' + data.name);
      console.log('Temp: ' + data.main.temp + ' \u2103');
      console.log(data.wind.speed + ' m/s');
      console.log('Humidity: ' + data.main.humidity + '%');

      weatherContainer.html('');

      var divcol = document.createElement('div');
      divcol.className = 'col';
      var divcard = document.createElement('div');
      divcard.className = 'card';
      var divcardhdr = document.createElement('div');
      divcardhdr.className = 'card-header';
      var divcardbdy = document.createElement('div');
      divcardbdy.className = 'card-body';

      var city = document.createElement('h3');
      city.textContent = data.name;
      var nowText = document.createElement('h5');
      nowText.textContent = 'Now';
      var icon = document.createElement('img');
      var h6NowIcon = document.createElement('h6');
      icon.src = 'http://openweathermap.org/img/w/' + data.weather[0].icon + '.png';
      h6NowIcon.className='card-subtitle';
      h6NowIcon.append(icon);
      var nowTemp = document.createElement('h5');
      nowTemp.textContent = 'Temp: ' + data.main.temp + ' \u2103';
      var nowWind = document.createElement('h5');
      nowWind.textContent = 'Wind: ' + data.wind.speed + ' m/s';
      var nowHumidity = document.createElement('h5');
      nowHumidity.textContent = 'Humidity: ' + data.main.humidity + '%';

      divcardbdy.append(nowText);
      divcardbdy.append(h6NowIcon);
      divcardbdy.append(nowTemp);
      divcardbdy.append(nowWind);
      divcardbdy.append(nowHumidity);

      divcardhdr.append(city);
      divcard.append(divcardhdr);
      divcard.append(divcardbdy);
      divcol.append(divcard);

      weatherContainer.append(divcol);

      localStoreCity(data.name);
      getForecast(data.name);

    }else{

      console.log(data.cod);
      console.log(data.message);

      weatherContainer.html('');
      forecastContainer.html('');

      var divcol = document.createElement('div');
      divcol.className = 'col';
      var divcard = document.createElement('div');
      divcard.className = 'card';
      var divcardhdr = document.createElement('div');
      divcardhdr.className = 'card-header';
      var divcardbdy = document.createElement('div');
      divcardbdy.className = 'card-body';
      var city = document.createElement('h3');
      city.textContent = 'City NOT found';

      divcardhdr.append(city);
      divcard.append(divcardhdr);
      divcard.append(divcardbdy);
      divcol.append(divcard);
      weatherContainer.append(divcol);

    }

  });

}

function getForecast(lp_city){

  $('#ForecastZone').empty();

  fetch('https://api.openweathermap.org/data/2.5/forecast?q='+lp_city+'&appid=8317f2907e7792815e65ac40b4c293be&units=metric')
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {

      var today = moment().format("YYYY-MM-DD");

      for (var i = 1; i <= 5; i++){

        var forecast = moment().add(i, 'days').format("YYYY-MM-DD");

        forecast += ' 12:00:00';
    
        for (var j = 0; j < data.list.length; j++){
    
          if (data.list[j].dt_txt == forecast){

            console.log(data.list[j]);


            var divcol = document.createElement('div');
            divcol.className = 'col';
            var divcard = document.createElement('div');
            divcard.className = 'card text-white bg-custom01';
            var divcardbdy = document.createElement('div');
            divcardbdy.className = 'card-body';

            var date = document.createElement('h5');
            date.className='card-title';
            date.textContent = data.list[j].dt_txt.substring(0,10);

            var icon = document.createElement('img');
            var h6icon = document.createElement('h6');
            icon.src = 'http://openweathermap.org/img/w/' + data.list[j].weather[0].icon + '.png';
            h6icon.className='card-subtitle';
            h6icon.append(icon);

            var temp = document.createElement('p');
            temp.className = 'card-text';
            temp.textContent = 'Temp: ' + data.list[j].main.temp + ' \u2103';

            var wind = document.createElement('p');
            wind.className = 'card-text';
            wind.textContent = 'Wind: ' + data.list[j].wind.speed + ' m/s';

            var humidity = document.createElement('p');
            humidity.className = 'card-text';
            humidity.textContent = 'Humidity: ' + data.list[j].main.humidity + ' %';

            divcardbdy.append(date);
            divcardbdy.append(h6icon);
            divcardbdy.append(temp);
            divcardbdy.append(wind);
            divcardbdy.append(humidity);
            divcard.append(divcardbdy);
            divcol.append(divcard);

            forecastContainer.append(divcol);
    
         }
    
        }
    
      }

  })

}

function localStoreCity(lp_city){

  console.log(lp_city);

  var la_Cities = [];
  var searchIndex;

  if ( localStorage.getItem('lsa_Cities') != undefined ){

    la_Cities = JSON.parse(localStorage.getItem('lsa_Cities'));

    searchIndex = la_Cities.findIndex((element) => element == lp_city);

    if ( searchIndex >= 0 ){

      la_Cities.splice(searchIndex, 1);
      
    }

  }

  la_Cities.push(lp_city);

  localStorage.setItem('lsa_Cities', JSON.stringify(la_Cities));

  printSearchHistory();

}

function printSearchHistory(){


  var htmlStr = '<label for="formGroupExampleInput" class="form-label">Search History:</label>';
  var la_Cities = [];

  if ( localStorage.getItem('lsa_Cities') != undefined ){

    la_Cities = JSON.parse(localStorage.getItem('lsa_Cities'));

    la_Cities = la_Cities.reverse();

    for(i=0; i<la_Cities.length; i++){

      htmlStr += '<button type="button" class="btn btn-secondary" onclick="getWeather(&apos;'+la_Cities[i]+'&apos;)">'+la_Cities[i]+'</button>'

    }

  }

  $('#SearchHistory').html('');
  $('#SearchHistory').html(htmlStr);

}

function clearHistory(){

  localStorage.removeItem('lsa_Cities');

  printSearchHistory();

}

function capitalizeFirstLetter(string){

  string = string.toLowerCase();
  return string.charAt(0).toUpperCase() + string.slice(1);

}