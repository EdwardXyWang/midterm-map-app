$(() => {
  // Variable declarations
  var googleMap;
  var markers = [];

  // Function definitions

  // Displays list of maps
  function getMapList(done) {
    $.ajax({
      method: "GET",
      url: "/maps"
    }).done((maps) => {
      done(maps);
    });
  }

  function generateMapList(maps) {
    for(map of maps) {
      $("<a>").data("mapId", map.id).data("mapTitle", map.map_title).attr("href", "#").text(map.map_title).addClass("list-group-item").appendTo($(".map-list"));
    }
  }

  function getPointsList(map_id, done) {
    $.ajax({
      method: "GET",
      url: "/maps/" + map_id
    }).done((points) => {
      done(points);
    });
  }

  function generatePointList(points) {
    if (points[0].lat) {
      for(point of points) {
        $("<a>").attr("href", "#").data("mapId", point.map_id).data("pointId", point.point_id).text(point.point_title).addClass("list-group-item").appendTo($(".points-list"));
      }
    }
    $("<div>").addClass("created").text("Map Created by: " + points[0].first_name + " " + points[0].last_name).appendTo($(".points-pane .panel-body"));
  }

  function getPointDetails(point_id, done) {
    $.ajax({
      method: "GET",
      url: "/maps/points/" + point_id
    }).done((info) => {
      done(info);
    });
  }

  function viewMapsPane() {
    $(".maps-pane").removeClass("hide-class");
    $(".point-detail-pane").addClass("hide-class");
    $(".points-pane").addClass("hide-class");
    $(".points-crumb").addClass("hide-class");
    $(".pdetail-crumb").addClass("hide-class");

    // Create maps list in the sidebar
    clearMapsList();
    getMapList(generateMapList);
    $(".points-crumb").data("mapId", null);

    clearMarkers(markers);
    googleMap.setZoom(11);
  }

  function viewPointsPane(map_id) {
    $(".maps-pane").addClass("hide-class");
    $(".point-detail-pane").addClass("hide-class");
    $(".points-pane").removeClass("hide-class");
    $(".points-crumb").removeClass("hide-class");
    $(".pdetail-crumb").addClass("hide-class");

    // Create the points list in the sidebar
    clearPointsList();
    getPointsList(map_id, generatePointList);
    $(".point-edit-btn").data("pointId", null);
  }

  function viewPointDetailPane() {
    clearPointsList();
    $(".maps-pane").addClass("hide-class");
    $(".point-detail-pane").removeClass("hide-class");
    $(".points-pane").addClass("hide-class");
    $(".points-crumb").removeClass("hide-class");
    $(".pdetail-crumb").removeClass("hide-class");
  }

  function clearMapsList() {
    $(".map-list").empty();
  }

  function clearPointsList() {
    $(".points-pane .points-list").empty().siblings(".created").remove();

  }

  // Creates thumbnail with point specific info
  function populatePointInfo(pInfo) {
    $(".img-thumbnail").attr("src", pInfo.image);
    $(".thumbnail-title").text("Point title: " + pInfo.point_title);
    $(".description").text("Description: " + pInfo.description);
    $(".point-created-by").text("Point created by: " + pInfo.first_name + " " + pInfo.last_name);
    $(".point-edit-btn").data("pointId", pInfo.point_id).data;
    $(".point-delete-btn").data("pointId", pInfo.point_id).data;
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
        googleMap = new google.maps.Map(document.getElementsByClassName('map-box')[0], {
          center: latlng,
          zoom: 11,
          maxZoom: 17
        });
      } else {
        alert("Could not find location: " + location);
      }
    });
  }

  function clearMarkers(markers) {
    for (let marker of markers) {
      marker.setMap(null);
    }
  }

  // Startup Actions

  initMap();
  getMapList(generateMapList);

  // Event listeners

  $(".maps-crumb").on("click", function () {
    viewMapsPane();
  });

  $(".points-crumb").on("click", function () {
    viewPointsPane($(this).data().mapId);
  });

  $(".pdetail-crumb").on("click", function () {
    viewPointDetailPane();
  });

  // Show list of points when clicking on a map title
  $(".map-list").on("click", "a", function () {
    const mapTitle = $(this).data().mapTitle;
    $(".points-pane .maps-title").text("Map Title: " + mapTitle);

    const map_id = $(this).data().mapId;
    $(".points-crumb").data("mapId", map_id);

    viewPointsPane(map_id);

    getListMapCoordinates(map_id);

  });

  // Click on .map-list, send a .ajax request to load the requested map
  function getListMapCoordinates(mapId) {
    $.ajax({
      method: "GET",
      url: `/maps/${mapId}`
    }).done((res) => {
      if (!res[0].lat) {
        return;
      }
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
    markers = [];
    const bounds = new google.maps.LatLngBounds();

    // make the markers
    for (let i = 0; i < coordinates.length; i++) {
      addMarkerWithTimeout(coordinates[i], i * 150);
      window.setTimeout(function() {
        if (i === coordinates.length - 1) {
          googleMap.fitBounds(bounds);
        }
      }, (i * 150) + 100);
    };

    function addMarkerWithTimeout(position, timeout) {
      window.setTimeout(function() {
        const marker = new google.maps.Marker({
          position: position,
          map: googleMap,
          animation: google.maps.Animation.DROP
        })

        markers.push(marker);

        bounds.extend(marker.getPosition());
      }, timeout);
    }

  }// end of addMarkersFromCoords

  //Displays information for a specific point
  $(".points-list").on("click", "a", function () {
    const map_id = $(".points-crumb").data().mapId;
    const point_id = $(this).data().pointId;

    viewPointDetailPane();

    getPointDetails(point_id, function (info) {
      populatePointInfo(info[0]);
      googleMap.setCenter({ lat: info[0].lat, lng: info[0].long });
      googleMap.setZoom(17);
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
        viewPointsPane(res[0]);
      });
    }
  });

  // Handle point deletion
  $(".point-delete-btn").on("click", function() {
    const pointToDeleteId = $(".point-edit-btn").data().pointId;
    console.log(pointToDeleteId);
    $.ajax({
      method: "POST",
      url: "/maps/points/" + pointToDeleteId + "/delete"
    }).done(() => {
      console.log("Sent delete (POST) request");
      $(".point-edit-btn").data("pointId", null);
      viewPointsPane($(".points-crumb").data().mapId);
    })
  });

  // Change default behaviour of alert dismissal
  $(".maps-pane .alert").on('close.bs.alert', function (event) {
    event.preventDefault();
    $(this).toggleClass("hide-class");
  })

  $("#point-modal").on("hidden.bs.modal", function() {
    clearPointsList();
    getPointsList($(".points-crumb").data().mapId, generatePointList);
  });

});
