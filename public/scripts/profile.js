$(function () {

  var pathname = window.location.pathname;

  // Accesses list of maps that user has created
  $.ajax({
    method: "GET",
    url: pathname + "/maps"
  }).done(function (maps) {
    for(map of maps) {
      $("<a>").attr("href", "/#viewmap-" + map.id).text(map.map_title).addClass("list-group-item").appendTo($(".map-list"));
    }
  });

  // Accesses list of maps that user has contributed to
  $.ajax({
    method: "GET",
    url: pathname + "/contributions"
  }).done(function (contributions) {
    for(contribution of contributions) {
      $("<a>").attr("href", "/#viewmap-" + contribution.id).text(contribution.map_title).addClass("list-group-item").appendTo($(".map-contributions"));
    }
  });

  // Accesses list of user's favoutite maps
  $.ajax({
    method: "GET",
    url: pathname + "/favourites"
  }).done(function (favourites) {
    for(favourite of favourites) {
      $("<a>").attr("href", "/#viewmap-" + favourite.id).text(favourite.map_title).addClass("list-group-item").appendTo($(".map-favourites"));
    }
  });

});
