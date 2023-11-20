
var apiKey = "c016bcae80e2a280b58992bbaa2bc3a5";
var citySelected;
//var geoQueryUrl = "http://api.openweathermap.org/geo/1.0/direct?q=London&limit=5&appid=" +apiKey;
// var weatherQueryUrl = "https://api.openweathermap.org/data/3.0/onecall?lat={lat}&lon={lon}&exclude={part}&appid=" +apiKey;

function updateCity(cityName){
    spanEls = $(".city").text(cityName);
}

function constructArrayFromDataMain(data,dataItem){
    var array = [];
    data.forEach(function(item){
        array.push(item.main[dataItem])
    })
    return array;
}

function findAverage(array){
    var total = 0;
    array.forEach(function(item){
        total += item;
    })
    return total/array.length;
}

function findPeak(array){
    var largest = -9999999;
    array.forEach(function(item){
      
        if(item > largest){
            largest = item;
        }
    })
   
    return largest;
}



function weatherOneCallApiCall(weatherQueryUrl){
    fetch(weatherQueryUrl).then(function(response){
        return response.json();
    }).then(function(data){
        return data;
    })
}

function weatherForecastApiCall(weatherQueryUrl){
    fetch(weatherQueryUrl).then(function(response){
        return response.json();
    }).then(function(data){
    
        humidityArray = constructArrayFromDataMain(data.list, "humidity");
        tempArray = constructArrayFromDataMain(data.list, "temp")
        $("#humidity").text(findAverage(humidityArray));
        $("#avg-temp").text((findAverage(tempArray)-273.15).toFixed(2) );
        $("#peak-temp").text((~~findPeak(tempArray) - 273.15).toFixed(2));
    })
}

function getWeatherInfoFromCity(cityName){
    var geoQueryUrl = "http://api.openweathermap.org/geo/1.0/direct?q="+cityName+"&limit=5&appid=" +apiKey;
    fetch(geoQueryUrl).then(function (response){
        return response.json();
    }).then(function(data){
        updateCity(data[0].name);
        var weatherOneCallQueryUrl = "https://api.openweathermap.org/data/3.0/onecall?lat="+data[0].lat+"&lon="+data[0].lon+"&appid=" +apiKey;
        var weatherForecastQueryUrl = "https://api.openweathermap.org/data/2.5/forecast?lat="+data[0].lat+"&lon="+data[0].lon+"&appid="+apiKey;
        weatherOneCallApiCall(weatherOneCallQueryUrl);
        weatherForecastApiCall(weatherForecastQueryUrl);
        
    }
    )
}

$("#search-sumbit").on("click", function(event){
    event.preventDefault();
    console.log($(".search-input").val());
    citySelected = $(".search-input").val();
    getWeatherInfoFromCity(citySelected)
    
    
})