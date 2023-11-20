var cities = [
    {
      value: "London",
      city: "London",
      country: "Uk",
      state: "null",
    },
    {
      value: "New York",
      city: "New York",
      country: "US",
      state: "NY",
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
        if(item.state == "null"){
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

