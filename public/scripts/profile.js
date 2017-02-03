$(() => {

  const pathname = window.location.pathname;
  $.ajax({
    method: "GET",
    url: pathname + "/maps"
  }).done((maps) => {
    for(map of maps) {
      $("<a>").attr("href", "#").text(map.map_title).addClass("list-group-item").appendTo($(".map-list"));
    }
  });

});
