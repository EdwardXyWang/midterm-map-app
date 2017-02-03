$(() => {
  $.ajax({
    method: "GET",
    url: "/maps"
  }).done((maps) => {
    for(map of maps) {
      $("<a>").attr("href", "#").text(map.map_title).addClass("list-group-item").appendTo($(".map-list"));
    }
  });;



  $(".map-list").on("click", "a", function () {
    $(".maps-pane").addClass("hidden");
    $(".points-pane").removeClass("hidden");
  });
});
