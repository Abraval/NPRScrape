// On-click function to clear all podcasts

$(document).on("click", "#clearNpr", function(event) {
  event.preventDefault();
  event.preventDefault();
  $.ajax({
    type: "DELETE",
    url: "/scrape"
  }).then(location.reload());
});

//On-click function to check for new podcasts
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

//On-click function to save podcasts to favorite
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

//On-click function to remove podcasts from favorite
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

//On-click function to display "Add-note" modal
$(document).on("click", "#addNote", function(event) {
  event.preventDefault();
  var podId = $(this).attr("data-id");
  // console.log(podId);
  $("#noteTitleEntry-" + podId).val("");
  $("#noteBodyEntry-" + podId).val("");
  $("#noteModal-" + podId).modal("show");
  return podId;
});

//On-click function to save note DB
$(document).on("click", "#saveNote", function(event) {
  event.preventDefault();
  var podId = $(this).attr("data-id");
  // console.log("SAVE BTN: ", podId);
  var title = $("#noteTitleEntry-" + podId).val();
  var body = $("#noteBodyEntry-" + podId).val();
  if (title && body) {
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
      $("#notificationSavedModal").modal("show");
    });
  } else {
    $("#errorModal").modal("show");
  }
});

//On-click function to display all notes
$(document).on("click", "#viewNote", function(event) {
  event.preventDefault();
  var podId = $(this).attr("data-id");
  console.log("/api/podcasts/" + podId);
  $.ajax({
    type: "GET",
    url: "/api/podcasts/" + podId
  }).then(function() {
    console.log();
  });
});

//On-click function to display "Edit" modal
$(document).on("click", "#edit-note", function(event) {
  event.preventDefault();
  console.log("Edit click works");
  var noteId = $(this).attr("data-id");
  var title = $("#note-title-" + noteId).text();
  var body = $("#note-body-" + noteId).text();
  console.log(title);
  console.log(noteId);
  // $("#editnoteTitleEntry-" + noteId).val("")
  // $("#editnoteBodyEntry-" + noteId).val("")
  $("#editnoteTitleEntry-" + noteId).val(title);
  $("#editnoteBodyEntry-" + noteId).val(body);
  $("#editModal-" + noteId).modal("show");
  return noteId;
});

//On-click function to save updated note to DB
$(document).on("click", "#updateNote", function(event) {
  event.preventDefault();
  var noteId = $(this).attr("data-id");
  $.ajax({
    url: "/notes/" + noteId,
    data: {
      title: $("#editnoteTitleEntry-" + noteId).val(),
      body: $("#editnoteBodyEntry-" + noteId).val()
    },
    type: "PUT"
  }).then(function(data) {
    $("#editModal-" + noteId).modal("hide");
    $("#notificationUpdateModal").modal("show");
  });
});

//On-click function to delete comment
$(document).on("click", "#delete-note", function(event) {
  event.preventDefault();
  console.log("this works!");
  var noteId = $(this).attr("data-id");
  var podId = $(".comments-card").attr("data-id");

  // console.log("THIS IS noteID:", noteId);
  // console.log("THIS IS podID:", podId);

  $.ajax({
    url: "/podcasts/" + podId + "/note/" + noteId,
    type: "DELETE"
  }).then(function() {
    $("#notificationModal").modal("show");
  });
});

//On-click function to reload the page after closing a notification modal
$(document).on("click", "#closeNotification", function() {
  location.reload();
});
