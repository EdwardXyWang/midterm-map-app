$(() => {

  var map;

  $.ajax({
    method: "GET",
    url: "/maps"
  }).done((maps) => {
    for(map of maps) {
      $("<a>").data("mapId", map.id).attr("href", "#").text(map.map_title).addClass("list-group-item").appendTo($(".map-list"));
    }
  });

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
          zoom: 11,
          maxZoom: 17
        });
      } else {
        alert("Could not find location: " + location);
      }
    });
  }
  initMap();

  // click the list
  $(".map-list").on("click", "a", function () {
    $(".maps-pane").addClass("hide-pane");
    $(".points-pane").removeClass("hide-pane");
    const map_id = $(this).data().mapId;
    getListMapCoordinates(map_id, showListMap);
    showMapPoints(map_id);
  });

  function showMapPoints(map_id) {
    $.ajax({
      method: "GET",
      url: "/maps/" + map_id
    }).done((points) => {
      if(points.point_title){
        for(point of points) {
          $("<a>").attr("href", "#").text(point.point_title).addClass("list-group-item").appendTo($(".points-list"));
        }
        $("<div>").text("Map Created by: " + points[0].first_name + " " + points[0].last_name).appendTo($(".map-created-by"));
      } else{
        $("<div>").text("Map Created by: " + points[0].first_name + " " + points[0].last_name).appendTo($(".map-created-by"));
      }
    });
  }

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

  // show map when click the list
  function showListMap(coordinates) {
    const markers = [];
    const bounds = new google.maps.LatLngBounds();

    // make the markers
    for (let i = 0; i < coordinates.length; i++) {
      addMarkerWithTimeout(coordinates[i], i * 150);
      window.setTimeout(function() {
        if (i === coordinates.length - 1) {
          map.fitBounds(bounds);
        }
      }, (i * 150) + 100);
    };

    function addMarkerWithTimeout(position, timeout) {
      window.setTimeout(function() {
        const marker = new google.maps.Marker({
          position: position,
          map: map,
          animation: google.maps.Animation.DROP
        })

        markers.push(marker);

        bounds.extend(marker.getPosition());
      }, timeout);
    }

  }// end of showListMap

  $('.new-map form').on('submit', function (event) {
    event.preventDefault();
    if (!$.trim($(this).find('.input-group input').val())) {
      $(this).closest('.maps-pane').find('.alert').removeClass('hide-class');
      setTimeout(function () {
        $('.maps-pane .alert').addClass('hide-class');
      }, 1400);
    } else {
      var formData = $(this).serialize();
      $.ajax({
        method: 'POST',
        url: '/maps',
        data: formData
      }).done(function (res) {
        $(".maps-pane").addClass("hide-pane");
        $(".points-pane").removeClass("hide-pane");
        showMapPoints(res[0]);
      });
    }
  });

});
