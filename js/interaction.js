var cities = [
    {
      value:"London",
      city: "London",
      country: "GB",
      state: "null",
      lat: 51.5073219,
      lon: -0.1276474,
    },
    {
      value:"New York",
      city: "New York",
      country: "US",
      state: "NY",
      lat: 39.6852874,
      lon: -93.9268836,
    },
    
  ];


$( function() {
    $( ".search-input" ).autocomplete({
      minLength: 3,
      source: cities,
      focus: function( event, ui ) {
        $( "#project" ).val( ui.item.city );
        return false;
      },
      select: function( event, ui ) {
        $( ".search-input" ).val( ui.item.city );
        $( "#search-id" ).val( ui.item.value );
      }
    })
    .autocomplete( "instance" )._renderItem = function( ul, item ) {
        if(item.state == "null" || item.state == undefined){
            return $( "<li>" )
                .append( "<div>" + item.city + "<br>" + item.country + "</div>" )
                .appendTo( ul );
    }
        else{
            return $( "<li>" )
                .append( "<div>" + item.city + "<br>" + item.country + ", " + item.state + "</div>" )
                .appendTo( ul );
        }
    };
  } );



$("#search-sumbit").on("click", function(event){
    event.preventDefault();
    console.log($(".search-input").val());
    citySelected = $(".search-input").val();
    $(".search-input").val("");
    if(!searchForCity(citySelected)){
      getWeatherInfoFromCity(citySelected)
    }
    else{
      const cityFound = searchForCity(citySelected);
      if(cityFound){
        apiWeatherCalls(cityFound.lat, cityFound.lon);
        updateCity(cityFound.city);
      }
    }
})

$(".city-list").on("click", function(event){
    event.preventDefault();
    event.stopPropagation();
    apiWeatherCalls($(event.target).attr("data-lat"),$(event.target).attr("data-lon"));
    updateCity($(event.target).attr("data-city"))
  })

function renderRecentCities(){
  $(".city-list").text("");
  cities.forEach(function(item){
    var cityEl = $("<button>")
    .text(item.city + ", " + item.country)
    .addClass("city-button")
    .attr({"data-city": item.city,
    "data-lat": item.lat,
    "data-lon": item.lon});
    $(".city-list").prepend(cityEl);
  })
}

function addNewCity(cityName, cityCountry){
  cities.push({value: cityName, city: cityName, country: cityCountry});
  renderRecentCities();
}

//https://stackoverflow.com/questions/12462318/find-a-value-in-an-array-of-objects-in-javascript
const searchForCity = cityName => cities.find(element => element.city === cityName);


renderRecentCities();

