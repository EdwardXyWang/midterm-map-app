$(() => {
  // Variable declarations
  var map;

  // Function definitions

  function viewMapPane () {
    $(".maps-pane").removeClass("hide-pane");
    $(".point-detail-pane").addClass("hide-pane");
    $(".points-pane").addClass("hide-pane");
  }

  function viewPointsPane () {
    $(".maps-pane").addClass("hide-pane");
    $(".point-detail-pane").addClass("hide-pane");
    $(".points-pane").removeClass("hide-pane");
  }

  function viewPointDetailPane () {
    $(".maps-pane").addClass("hide-pane");
    $(".point-detail-pane").removeClass("hide-pane");
    $(".points-pane").addClass("hide-pane");
  }

  // Displays list of maps
  function getMapList (done) {
    $.ajax({
      method: "GET",
      url: "/maps"
    }).done((maps) => {
      done(maps);
    });
  }

  function getPointsList (map_id, done) {
    $.ajax({
      method: "GET",
      url: "/maps/" + map_id
    }).done((points) => {
      done(points);
    });
  }

  // Google maps api functions
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

  function generatePointsList(map_id) {
    $.ajax({
      method: "GET",
      url: "/maps/" + map_id
    }).done((points) => {
      if (points[0].lat) {
        for(point of points) {
          $("<a>").attr("href", "#").data("mapId", map_id).data("pointId", point.id).text(point.point_title).addClass("list-group-item").appendTo($(".points-list"));
        }
      }
      $("<div>").text("Map Created by: " + points[0].first_name + " " + points[0].last_name).appendTo($(".map-created-by"));
    });
  }

  // Startup Actions

  initMap();

  getMapList(function (maps) {
    for(map of maps) {
      $("<a>").data("mapId", map.id).data("mapTitle", map.map_title).attr("href", "#").text(map.map_title).addClass("list-group-item").appendTo($(".map-list"));
    }
  });

  // Event listeners

  // click the list
  $(".map-list").on("click", "a", function () {
    viewPointsPane();

    const mapTitle = $(this).data('mapTitle');
    const map_id = $(this).data().mapId;

    $(".points-pane .maps-title").text("Map Title: " + mapTitle);
    getListMapCoordinates(map_id);
    // addMarkersFromCoords();

    // Add the points as markers to the map
    // getPointsList(map_id, function(points) {

    // });

    // Create the points list in the sidebar
    getPointsList(map_id, function(points) {
      if (points[0].lat) {
        for(point of points) {
          $("<a>").attr("href", "#").data("mapId", map_id).data("pointId", point.point_id).text(point.point_title).addClass("list-group-item").appendTo($(".points-list"));
        }
      }
      $("<div>").text("Map Created by: " + points[0].first_name + " " + points[0].last_name).appendTo($(".map-created-by"));
    });
  });

  // Click on .map-list, send a .ajax request to load the requested map
  function getListMapCoordinates(mapId) {
    $.ajax({
      method: "GET",
      url: `/maps/${mapId}`
    }).done((res) => {
      if (!res[0].lat) {
        console.log(res);
        return 0;
      }
      console.log("getting..:)");
      let coordinates = [];
      for (let i = 0; i < res.length; i++) {
        coordinates.push({
          lat: res[i]['lat'],
          lng: res[i]['long']
        });
      }
      addMarkersFromCoords(coordinates);
      return;
    });
  }// end of getListMapCoordinates

  // show map when click the list
  function addMarkersFromCoords(coordinates) {
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

  }// end of addMarkersFromCoords

  //Creates thumbnail with point specific info
  function populatePointInfo (pInfo) {
    $(".img-thumbnail").attr("src", pInfo.image);
    $(".thumbnail-title").text("Point title: " + pInfo.point_title);
    $(".description").text("Description: " + pInfo.description);
    $(".point-created-by").text("Point created by: " + pInfo.first_name + " " + pInfo.last_name);
    $(".point-edit-btn").data("pointId", pInfo.id).data;
  }

  //Displays information for a specific point
  $(".points-list").on("click", "a", function () {
    $(".points-pane").addClass("hide-pane");
    $(".point-detail-pane").removeClass("hide-pane");
    const map_id = $(this).data().mapId;
    const point_id = $(this).data().pointId;
    console.log(map_id, point_id);
    $.ajax({
      method: "GET",
      url: "/maps/" + map_id + "/" + point_id
    }).done((info) => {
      console.log(info);
      populatePointInfo(info[0]);
      map.setCenter({ lat: info[0].lat, lng: info[0].long });
      map.setZoom(17);
    });
  });

  // New map form submission
  $('.new-map form').on('submit', function (event) {
    event.preventDefault();
    if (!$.trim($(this).find('.input-group input').val())) {
      $(this).closest('.maps-pane').find('.alert').toggleClass('hide-class');
    } else {
      var formData = $(this).serialize();
      $.ajax({
        method: 'POST',
        url: '/maps',
        data: formData
      }).done(function (res) {
        viewPointsPane();
        // res is array of [map_id, created_by]
        generatePointsList(res[0]);
      });
    }
  });

  // Change default behaviour of alert dismissal
  $(".maps-pane .alert").on('close.bs.alert', function (event) {
    event.preventDefault();
    $(this).toggleClass("hide-class");
  })

});
