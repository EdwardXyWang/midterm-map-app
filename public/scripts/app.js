$(() => {
<<<<<<< HEAD


=======
  $.ajax({
    method: "GET",
    url: "/maps"
  }).done((maps) => {
    for(map of maps) {
      $("<a>").data("mapId", map.id).attr("href", "#").text(map.map_title).addClass("list-group-item").appendTo($(".map-list"));
    }
  });

  $(".map-list").on("click", "a", function () {
    $(".maps-pane").addClass("hide-pane");
    $(".points-pane").removeClass("hide-pane");
    getListMapCoordinates($(this).data("mapId"), showListMap);
  });

  var map;

  // Click on .map-list, send a .ajax request to load the requested map
  function getListMapCoordinates(mapId, callback) {
    $.ajax({
      method: "GET",
      url: `/maps/${mapId}`
    }).done((res) => {
      let coordinates = [];
      for (let i = 0; i < res.length; i++) {
        coordinates.push({
          lat: res[i]['lat'],
          lng: res[i]['long']
        });
      }
      callback(coordinates);
    });
  }// end of getListMapCoordinates

  // show the map in main page
  function initMap() {
    let geocoder = new google.maps.Geocoder();
    const location = "Vancouver";
    geocoder.geocode({'address': location}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        var lat = results[0].geometry.location.lat();
        var lng = results[0].geometry.location.lng();
        var latlng = {lat: lat, lng: lng};
        map = new google.maps.Map(document.getElementsByClassName('map-box')[0], {
          center: latlng,
          zoom: 11
        });
      } else {
        alert("Could not find location: " + location);
      }
    });
  }
  initMap();

  // show map when click the list
  function showListMap(coordinates) {
    let listCenter = {
      lat: 0,
      lng: 0
    };
    for(let coord of coordinates) {
      listCenter['lat'] += coord['lat'];
      listCenter['lng'] += coord['lng'];
    };
    listCenter['lat'] = listCenter['lat'] / coordinates.length;
    listCenter['lng'] = listCenter['lng'] / coordinates.length;

    var latlng = new google.maps.LatLng(listCenter['lat'], listCenter['lng']);
    map.setCenter(latlng);
    map.setZoom(11);

    // make the markers
    for (let coord of coordinates) {
      new google.maps.Marker({
            position: coord,
            map: map
          }).setAnimation(google.maps.Animation.DROP);
    };
  }// end of showListMap
>>>>>>> 23da99f8bbb2afc118c7f0bb0219c4a8b7657029

});
