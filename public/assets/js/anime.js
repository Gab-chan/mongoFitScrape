// Make sure we wait to attach our handlers until the DOM is fully loaded.
$(function() {
  $(document).on("click", "p", function() {
    // Save the id from the p tag
    var currentArticle = $(this).attr("data-id");
    displayNotes(currentArticle);
  });
  function displayNotes(currentArticle) {
    // Empty the notes from the note section
    $("#notes").empty();
    // Now make an ajax call for the Article
    $.ajax({
      method: "GET",
      url: "/api/posts/" + currentArticle
    })
      // With that done, add the note information to the page
      .then(function(data) {
        var notes = data.note;
        if (notes.length > 0) {
          for (var i = 0; i < notes.length; i++) {
            $("#notes").append(
              "<h4>" +
                notes[i].body +
                "  " +
                "<button id='delete-note' article-id='" +
                currentArticle +
                "'  data-id='" +
                notes[i]._id +
                "' >x</button></h4>"
            );
          }
        }
        // The title of the article
        $("#notes").append("<h2>" + data.title + "</h2>");
        // A textarea to add a new note body
        $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
        // A button to submit a new note, with the id of the article saved to it
        $("#notes").append(
          "<button data-id='" + data._id + "' id='savenote'>Save Note</button>"
        );
      });
  }

  $(".create-form").on("submit", function(event) {
    // Make sure to preventDefault on a submit event.
    event.preventDefault();

    var newCat = {
      name: $("#ca").val().trim(),
      sleepy: $("[name=sleepy]:checked").val().trim()
    };

    // Send the POST request.
    $.ajax("/api/cats", {
      type: "POST",
      data: newCat
    }).then(
      function() {
        console.log("created new cat");
        // Reload the page to get the updated list
        location.reload();
      }
    );
  });

  $(".delete-cat").on("click", function(event) {
    var id = $(this).data("id");

    // Send the DELETE request.
    $.ajax("/api/cats/" + id, {
      type: "DELETE"
    }).then(
      function() {
        console.log("deleted cat", id);
        // Reload the page to get the updated list
        location.reload();
      }
    );
  });
});
