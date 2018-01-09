$(document).ready(function(){
  $('header').fadeOut(1000);
});

/*function getRestaurant(lat, lon) {
  $.ajax({
    url: 'https://developers.zomato.com/api/v2.1/geocode',
    data: {
      'lat': lat,
      'lon': lon,
    },
    headers: { 'Accept': 'application/json', 'user-key': 'db605020c76032269d89e88d2e318c42' }
  })
  .done(function(result) {
    console.log("success", result);
  })
  .fail(function(e) {
    console.log("error", e);
  });
}

getRestaurant(-33.4691, -70.6420);*/

var map;
var map2;
var service;
var infowindow;
var positionMap;
var markers = [];
var cols = 0;

function initialize() {
  var santiago = new google.maps.LatLng(-33.4546460000,-70.6569020000);
  map = new google.maps.Map(document.getElementById('map'), {
    center: santiago,
    zoom: 15
  });
            
  infowindow = new google.maps.InfoWindow();
  //service = new google.maps.places.PlacesService(map);

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      var request = {
        location: pos,
        radius: '500'
      };
      positionMap = pos;
      getRestaurant(positionMap.lat, positionMap.lng);

      infowindow.setPosition(pos);
      infowindow.setContent('Location found.');
      map.setCenter(pos);
    }, function() {
      setDefaultMap(santiago);
    });
  } else {
    setDefaultMap(santiago);
  }

  $('#modalLocal').on('shown.bs.modal', function (e) {
    google.maps.event.trigger(map2, "resize");
    console.log("entre!!")
  })
}

function setDefaultMap(defaultPosition) {
  var request = {
    location: defaultPosition,
    radius: '500'
  };
  positionMap = defaultPosition;
  getRestaurant(positionMap.lat, positionMap.lng);
}


function setSearchMap(search) {
  var request = {
    location: positionMap,
    radius: '500',
    types: ['restaurant'],
    keyword: [search]
  };

}

function createMarker(lat, lon) {
  var latLng = new google.maps.LatLng(lat, lon);
  //var image = 'https://userscontent2.emaze.com/images/9ee8f6cc-2b63-4759-bd7c-6492f61b815f/7710ad823f3e2aab72620a4c0c77066d.png';
  var marker = new google.maps.Marker({
    map: map,
    position: latLng,
    //icon: image
  });
  
  markers.push(marker);

  google.maps.event.addListener(marker, 'click', function() {
    //infowindow.setContent(place.name);
    infowindow.open(map, this);
  });
}

function removeMarker() {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
  markers = [];
}

//function createElement((lat, lon), index) {
  //console.log(place.name, place.photos);
  /*if (typeof place.photos != 'undefined') {
    if (cols == 0) {
      $("#listFood").append('<div class="row listImg"></div>');
    }

    var urlImage = place.photos[0].getUrl({'maxWidth': 250, 'maxHeight': 250});
    var name = place.name;
    var direccion = place.vicinity;
    var local = place.location;

    $("#listFood .row").last().append('<div class="col-xs-4 imgcont"><div class="img-'+index+' imgContenedor data-toggle="modal" data-target="#modalLocal""></div></div>');
    $('.img-'+index).css({'background-image': 'url('+urlImage+')', 'height': '10em', 'background-repeat': 'no-repeat', 'background-position': 'center center'});
    $('.img-'+index).last().append('<span class="nameList text-center"><strong>'+name+'</strong></span>');
    $('.img-'+index+' span').hide();
      $('.btnClose').click(function(event) {
      $('.name').last().html('');
      $('.direccion').last().html('');
      });
    $('.img-'+index).click(function(event) {
      console.log(place.name, place.photos, place.geometry.location);
      $('#modalLocal').modal('show');
      $('.name').last().append(name);
      $('.direccion').last().append('<span>'+direccion+'</span>')
      console.log(name);
      map2 = new google.maps.Map(document.getElementById('map2'), {
        center: place.geometry.location,
        zoom: 16
      });

      map2.setCenter(place.geometry.location);

      var marker = new google.maps.Marker({
        map: map2,
        position: place.geometry.location,
        //icon: image
      });
      
    });
    $('.img-'+index).mouseover(function(event) {
      $('.img-'+index).css({'opacity': '0.5'})
      $('.img-'+index+' span').show();
    });
    $('.img-'+index).mouseleave(function(event) {
      $('.img-'+index).css({'opacity': '1'})
      $('.img-'+index+' span').hide();
    });

    cols++;

    if (cols == 3) {
      cols = 0;
    }
  }*/
//}

$('#btnSearch').click(search);
function search() {
  setSearchMap($('#inputSearch').val());
}

function getRestaurant(lat, lon) {
  $.ajax({
    url: 'https://developers.zomato.com/api/v2.1/geocode',
    data: {
      'lat': lat,
      'lon': lon,
    },
    headers: { 'Accept': 'application/json', 'user-key': 'db605020c76032269d89e88d2e318c42' }
  })
  .done(function(result) {
    console.log("success", result);
    // Se limipia la lista de fotos
    $('#listFood').html("");
    cols = 0;
    // Se limpia los marker del mapa
    removeMarker();

      for (var i = 0; i < result['nearby_restaurants'].length; i++) {
        var lat = result['nearby_restaurants'][i]['restaurant']['location']['latitude'];
        var lon = result['nearby_restaurants'][i]['restaurant']['location']['longitude'];
        createMarker(lat, lon);
        // createElement((lat,lon), i + 1);
      }
  })
  .fail(function(e) {
    console.log("error", e);
  });
}

//getRestaurant(positionMap.lat, positionMap.lng);


