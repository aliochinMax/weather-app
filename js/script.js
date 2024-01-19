
var apiKey = "c016bcae80e2a280b58992bbaa2bc3a5";
var citySelected;


//var geoQueryUrl = "http://api.openweathermap.org/geo/1.0/direct?q=London&limit=5&appid=" +apiKey;
// var weatherQueryUrl = "https://api.openweathermap.org/data/3.0/onecall?lat={lat}&lon={lon}&exclude={part}&appid=" +apiKey;

function updateCity(cityName){
    spanEls = $(".city").text(cityName);
}

function resetForecastInfo(){
    $(".forecastCards").text("")
}

const convertFromKelvinToCelcius = (temp) => temp-273.15

function constructArrayFromDataMain(data,dataItem){
    var array = [];
    data.forEach(function(item){
        array.push(item[dataItem])
    })
    return array;
}

function findAverage(array){
    var total = 0;
    array.forEach(function(item){
        total += item;
    })
    return ~~(total/array.length).toFixed(2);
}

function findPeak(array){
    var largest = -9999999;
    array.forEach(function(item){
      
        if(item > largest){
            largest = item;
        }
    })
   
    return ~~largest;
}

function handleForecastData(list){
    var currentWorkingDay = dayjs().add(1,"day");
    
    var tempArray = [];
    var humidityArray = [];
    list.forEach(function(item){
        var daySelected = dayjs(item.dt_txt);
        if(dayjs(daySelected).format("ddd") != dayjs().format("ddd")){
            if(dayjs(daySelected).format("ddd") != dayjs(currentWorkingDay).format("ddd")){
                    var ulEl = $("<ul class=\"forecastCard col\"></ul>");
                    var infoContainerEl = $("<div class=\"info container forecast-info\"></div>");
                    var foreCastDateEl = $("<p>").text(dayjs(currentWorkingDay).format("ddd"))
                    .attr("data-day", dayjs(currentWorkingDay).format("DD/MM/YYYY"));
                    var avgTempEl = $("<p>").text("Avg temperture: " + convertFromKelvinToCelcius(findAverage(tempArray)).toFixed(2) + " Celcius");
                    var peakTempEl =  $("<p>").text("Peak temperture: " + convertFromKelvinToCelcius(findPeak(tempArray)).toFixed(2) + " Celcius");
                    var avgHumidityEl = $("<p>").text("Humidity: " + findAverage(humidityArray));
                    $(".forecastCards").append(ulEl.append(infoContainerEl.append(foreCastDateEl, avgTempEl, peakTempEl, avgHumidityEl)));
                    currentWorkingDay = daySelected;
                    tempArray = [];
                    humidityArray = [];
                }
                    tempArray.push(item.main.temp);
                    humidityArray.push(item.main.humidity);
        }
    })


}



function weatherOneCallApiCall(weatherQueryUrl){
    fetch(weatherQueryUrl).then(function(response){
        return response.json();
    }).then(function(data){
        humidityArray = constructArrayFromDataMain(data.hourly, "humidity");
        tempArray = constructArrayFromDataMain(data.hourly, "temp");
        $(".date").text(dayjs().format("DD/MM/YYYY"))
        .attr("data-date",dayjs().format("DD/MM/YYYY"));
        $("#selected-humidity").text(findAverage(humidityArray).toFixed(2));
        $("#seleceted-avg-temp").text(convertFromKelvinToCelcius(findAverage(tempArray)).toFixed(2) + " Celcius");
        $("#selected-peak-temp").text(convertFromKelvinToCelcius(~~findPeak(tempArray)).toFixed(2) + " Celcius");
    })
}

function weatherForecastApiCall(weatherQueryUrl){
    fetch(weatherQueryUrl).then(function(response){
        return response.json();
    }).then(function(data){
        handleForecastData(data.list);      
    })
}

function apiWeatherCalls(lat, lon){
    resetForecastInfo();
    var weatherOneCallQueryUrl = "https://api.openweathermap.org/data/3.0/onecall?lat="+lat+"&lon="+lon+"&appid=" +apiKey;
        var weatherForecastQueryUrl = "https://api.openweathermap.org/data/2.5/forecast?lat="+lat+"&lon="+lon+"&appid="+apiKey;
        weatherOneCallApiCall(weatherOneCallQueryUrl);
        weatherForecastApiCall(weatherForecastQueryUrl);
}

function getWeatherInfoFromCity(cityName){
    var geoQueryUrl = "http://api.openweathermap.org/geo/1.0/direct?q="+cityName+"&limit=5&appid=" +apiKey;
    fetch(geoQueryUrl).then(function (response){
        return response.json();
    }).then(function(data){
        
        var selectedCity = data[0];
        console.log(selectedCity);
        updateCity(selectedCity.name);
        if(!searchForCity(selectedCity.name)){
            addNewCity(selectedCity.name, selectedCity.country);
        }
        apiWeatherCalls(selectedCity.lat,selectedCity.lon)
        
    }
    )
}

