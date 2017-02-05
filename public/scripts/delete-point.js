$(() => {

  $(".point-delete-btn").on("click", function() {
    const pointToDelteId = $(".point-edit-btn").data().pointId;


    $.ajax({
      method: "POST",
      url: "/maps/points/" + pointToDelteId + "/delete"   //hard coded point id (for now)
    }).done(() => {
      console.log("Sent delete (POST) request");
    })
  });

});
