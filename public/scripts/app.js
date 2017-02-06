$(function() {
  // Variable declarations
  var googleMap;
  var markers = [];
  var USER_ID = $(".maps-crumb").attr("data-userid");

  // Function definitions

  // Displays list of maps
  function getMapList(done) {
    $.ajax({
      method: "GET",
      url: "/maps"
    }).done(function (maps) {
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
    }).done(function (points) {
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
    }).done(function (info) {
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
    if(USER_ID) {
      showIfFavourited(map_id, updateFavButton);
    }

    $(".maps-pane").addClass("hide-class");
    $(".point-detail-pane").addClass("hide-class");
    $(".points-pane").removeClass("hide-class");
    $(".points-crumb").removeClass("hide-class");
    $(".pdetail-crumb").addClass("hide-class");

    // Create the points list in the sidebar
    clearPointsList();
    getPointsList(map_id, generatePointList);

    getPointsList(map_id, function (points) {
      if (!points[0].lat) {
        return;
      }
      addMarkersFromPoints(points);
    });

    $(".point-edit-btn").data("pointId", null);
    $(".points-crumb").data("mapId", map_id);
  }

  function viewPointDetailPane(point_id) {
    getPointDetails(point_id, function (info) {
      populatePointInfo(info[0]);
      googleMap.setCenter({ lat: info[0].lat, lng: info[0].long });
      googleMap.setZoom(17);
    });

    $(".maps-pane").addClass("hide-class");
    $(".points-pane").addClass("hide-class");
    $(".point-detail-pane").removeClass("hide-class");
    $(".points-crumb").removeClass("hide-class");
    $(".pdetail-crumb").removeClass("hide-class");
  }

  function clearMapsList() {
    $(".map-list").empty();
  }

  function clearPointsList() {
    $(".points-pane .points-list").empty().siblings(".created").remove();
  }

  // Toggles whether user has favourited in database
  function toggleFavourite(mapId, updateFavButton) {
    var formData = {map_id: mapId};
    $.ajax({
      method: "POST",
      url: "/users/favourites",
      data: formData
    }).done(function (res) {
      // true: existed; false: new
      updateFavButton(res);
    });
  }

  // Checks db for existence of user/map favourite combination
  function showIfFavourited(mapId, updateFavButton) {
    var urlLike = "/users/" + USER_ID + "/favourites";
    $.ajax({
      method: "GET",
      url: urlLike
    }).done(function (res) {
      for (var i = 0; i < res.length; i++) {
        if (res[i].id === mapId) {
          updateFavButton(false);
          return;
        }
      }
      updateFavButton(true);
    });
  }

  // Show appropriate state of favourite button
  function updateFavButton(boolValue) {
    if (boolValue) {
      // true: existed
      $(".points-pane .fav-btn").text("Like?").removeClass("is-favourite");
    } else {
      // false: new
      $(".points-pane .fav-btn").text("Liked!").addClass("is-favourite");
    }
  }

  // Creates thumbnail with point specific info
  function populatePointInfo(pInfo) {
    $(".img-thumbnail").attr("src", pInfo.image).on("error", function () {
      $(this).unbind("error").attr("src", "/map-marker.png");
    })

    $(".thumbnail-title").text(pInfo.point_title);
    $(".description").text("Description: " + pInfo.description);
    $(".point-created-by").text("Point created by: " + pInfo.first_name + " " + pInfo.last_name);
    $(".point-edit-btn").data("pointId", pInfo.point_id).data;
    $(".point-delete-btn").data("pointId", pInfo.point_id).data;
  }

  // Google maps api functions
  function initMap() {
    var geocoder = new google.maps.Geocoder();
    var location = "Vancouver";
    geocoder.geocode({"address": location}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        var lat = results[0].geometry.location.lat();
        var lng = results[0].geometry.location.lng();
        var latlng = {lat: lat, lng: lng};
        googleMap = new google.maps.Map(document.getElementsByClassName("map-box")[0], {
          center: latlng,
          zoom: 11,
          maxZoom: 17
        });
      } else {
        alert("Could not find location: " + location);
      }
    });
  }

  // Adds markers to the map corresponding to list of points
  function addMarkersFromPoints(points) {
    var coordinates = [];
    for (var i = 0; i < points.length; i++) {
      coordinates.push({
        lat: points[i]["lat"],
        lng: points[i]["long"]
      });
    }

    clearMarkers(markers);

    var bounds = new google.maps.LatLngBounds();

    // make the markers
    for (var i = 0; i < coordinates.length; i++) {
      addMarkerWithTimeout(coordinates[i], i * 150);

      if (i === coordinates.length - 1) {
        window.setTimeout(function() {
          googleMap.fitBounds(bounds);
        }, (i * 150) + 100);
      }
    };

    function addMarkerWithTimeout(position, timeout) {
      window.setTimeout(function() {
        var marker = new google.maps.Marker({
          position: position,
          map: googleMap,
          animation: google.maps.Animation.DROP
        })

        markers.push(marker);

        bounds.extend(marker.getPosition());
      }, timeout);
    }
  }

  function clearMarkers(markers) {
    for (var marker of markers) {
      marker.setMap(null);
      marker = null;
    }
  }

  // Startup Actions

  initMap();
  getMapList(generateMapList);
  if (window.location.hash.includes("viewmap-")) {
    var hashMapId = window.location.hash.substring(9);

    window.setTimeout(function() {
      viewPointsPane(hashMapId);
    }, 1000);

    $(".points-crumb").data("mapId", hashMapId);

    getPointsList(hashMapId, function(points) {
      var mapTitle = points[0].map_title;
      $(".points-pane .maps-title").text(mapTitle);
    });
  }

  // Event listeners

  $(".maps-crumb").on("click", function () {
    viewMapsPane();
  });

  $(".points-crumb").on("click", function () {
    viewPointsPane($(this).data().mapId);
  });

  // Show list of points when clicking on a map title
  $(".map-list").on("click", "a", function () {
    var mapTitle = $(this).data().mapTitle;
    $(".points-pane .maps-title").text(mapTitle);

    var map_id = $(this).data().mapId;
    $(".points-crumb").data("mapId", map_id);

    viewPointsPane(map_id);

  });

  //Displays information for a specific point
  $(".points-list").on("click", "a", function () {
    var map_id = $(".points-crumb").data().mapId;
    var point_id = $(this).data().pointId;
    $(".pdetail-crumb").data("pointId", point_id);

    viewPointDetailPane(point_id);
  });

  // New map form submission
  $(".new-map form").on("submit", function (event) {
    event.preventDefault();
    if (!$.trim($(this).find(".input-group input").val())) {
      $(this).closest(".maps-pane").find(".alert").toggleClass("hide-class");
    } else {
      var formMapTitle = $(this).find('[name="map_title"]').val();
      var formData = $(this).serialize();
      $(this)[0].reset();
      $.ajax({
        method: "POST",
        url: "/maps",
        data: formData
      }).done(function (res) {
        viewPointsPane(res[0]);
        $(".points-crumb").data("mapId", res[0]);
        $(".points-pane .maps-title").text(formMapTitle);
      });
    }
  });

  // Handle point deletion
  $(".point-delete-btn").on("click", function() {
    var pointToDeleteId = $(".point-edit-btn").data().pointId;
    $.ajax({
      method: "POST",
      url: "/maps/points/" + pointToDeleteId + "/delete"
    }).done(function () {
      $(".point-edit-btn").data("pointId", null);
      clearMarkers(markers);
      viewPointsPane($(".points-crumb").data().mapId);
    })
  });

  // Change default behaviour of alert dismissal
  $(".maps-pane .alert").on("close.bs.alert", function (event) {
    event.preventDefault();
    $(this).toggleClass("hide-class");
  })

  $("#point-modal").on("hidden.bs.modal", function() {
    clearPointsList();
    getPointsList($(".points-crumb").data().mapId, generatePointList);
    if(!$(".point-detail-pane").hasClass("hide-class")) {
      viewPointDetailPane($(".pdetail-crumb").data().pointId);
    }
  });

  $(".points-pane").on("click", ".fav-btn", function () {
    var mapId = $(".points-crumb").data("mapId");
    toggleFavourite(mapId, updateFavButton);
  })

});
