$(document).on("click", "#clearNpr", function(event) {
  event.preventDefault();
  console.log("CLEAR WORKS");
  event.preventDefault();
  $.ajax({
    type: "DELETE",
    url: "/scrape"
  }).then(location.reload());
});

$(document).on("click", "#scrapeNpr", function(event) {
  event.preventDefault();
  console.log("SCRAPE WORKS");
  $.ajax("/scrape", {
    type: "GET"
  }).then(function() {
    console.log("scraping");
    // Reload the page to get the updated list
    window.location.href = "/";
  });
});

$(document).on("click", "#save", function(event) {
  console.log("SAVE WORKS!");
  event.preventDefault();
  var podId = $(this).data("id");
  console.log(podId);
  $.ajax({
    url: "podcasts/" + podId,
    type: "PUT",
    data: { saved: true }
  }).then(function() {
    location.reload();
  });
});

$(document).on("click", "#deleteSaved", function(event) {
  event.preventDefault();
  var podId = $(this).data("id");
  $.ajax({
    url: "podcasts/" + podId,
    type: "PUT",
    data: { saved: false }
  }).then(function() {
    location.reload();
  });
});

$(document).on("click", "#addNote", function(event) {
  event.preventDefault();
  var podId = $(this).attr("data-id");
  console.log(podId);
  $("#noteTitleEntry-" + podId).val("");
  $("#noteBodyEntry-" + podId).val("");
  $("#noteModal-" + podId).modal("show");
  return podId;
});

$(document).on("click", "#saveNote", function(event) {
  event.preventDefault();
  var podId = $(this).attr("data-id");
  // console.log("SAVE BTN: ", podId);
  var title = $("#noteTitleEntry-" + podId).val();
  var body = $("#noteBodyEntry-" + podId).val();
if(title && body){
  $.ajax({
    type: "POST",
    url: "/podcasts/" + podId,
    data: {
      title: title,
      body: body
    }
  }).then(function(data) {
    console.log(data);
    $("#noteModal-" + podId).modal("hide");
    $("#noteTitleEntry-" + podId).val("");
    $("#noteBodyEntry-" + podId).val("");
    location.reload();

  });
}
else {
  $("#errorModal").modal("show")
}
});

$(document).on("click", "#viewNote", function(event) {
  event.preventDefault();
  var podId = $(this).attr("data-id");
  console.log("/api/podcasts/" + podId )
  $.ajax({
    type: "GET",
    url: "/api/podcasts/" + podId 
  }).then(function() {
  console.log()

  });
  
});

