$(document).on('click', '.note-button', function () {
    // Clear out notes div before displaying new info
    $('#notes').empty();
    // Grab ID from p tag
    var thisID = $(this).attr("data-id");
    console.log(thisID)
    $.ajax({
        method: "GET",
        url: "/articles/" + thisID
    })
        // Once we get the article data by ID, build out note components
        .then(function (data) {
            console.log(data);
            // Title of article
            $('.note[id=' + thisID + ']').append(`<h4>${data.title}</h4>`);
            // Input for note title
            $('.note[id=' + thisID + ']').append("<input id='titleInput' class='m-3' name='title' ><br>");
            // Text area for note body
            $('.note[id=' + thisID + ']').append("<textarea id='bodyInput' class='mb-3 mx-3' name='body'></textarea><br>");
            // Submit button for note
            $('.note[id=' + thisID + ']').append("<button data-id='" + data._id + "' id='saveNote'>Save Note</button>");

            // If there's a note saved for the article...
            if (data.note) {
                // Set the values of the title and body to the saved note info
                $('#titleInput').val(data.note.title);
                $('#bodyInput').val(data.note.body)
            }
        });
});

// Onclick for the save note button
$(document).on('click', '#saveNote', function () {
    // Get article ID that was saved as data to the submit button
    var thisID = $(this).attr("data-id");
    // console.log(thisID);
    // Run a POST request to update the note, using what's entered in the inputs
    $.ajax({
        method: "POST",
        url: "/articles/" + thisID,
        data: {
            // Value taken from title input
            title: $("#titleInput").val(),
            // Value taken from note textarea
            body: $("#bodyInput").val()
        }
    })

        // With that done
        .then(function (data) {
            // Log the response
            console.log(data);
            // Empty the notes section
            $(".note").empty();
        });

    // Lastly, empty out the text in the note.
    $("#titleInput").val("");
    $("#bodyInput").val("");
});

// Onclick for clear article button
$('#clear-articles-btn').on('click', function () {
    $('.articles-container').empty();
});

// Onclick for Scrape New Articles button
$('#scrape-articles-btn').on('click', function () {
    // empty out container before repopulating
    $('.articles-container').empty();

    // Make ajax call to /scrape route, get new scraped articles into db
    $.ajax({
        method: "GET",
        url: "/scrape"
    }).then(function (data) {
        console.log(data, 'scrape data')
        // --------------------------
        // Maybe something here ???
        // --------------------------
    }).then(

        // get json from the /articles route, which should contain any new articles
        $.getJSON("/articles", function (data) {
            // Iterate through data
            for (let i = 0; i < data.length; i++) {
                $('.articles-container').append(
                    `<div class="article m-3">
                    <div class="row">
                        <div class="col-12 headline-container">
                            <a href='${data[i]._id}' target="_blank" class="article-link">${data[i].title}</a>
                        </div>
                    </div>
                    <div class="row summary">
                        <div class="col-sm-9">
                            <p class="article-summary">${data[i].summary}</p>
                        </div>
                        <div class="col-sm-3">
                            <button class="note-button" data-id="${data[i]._id}">Open Notes</button>
                        </div>
                    </div>
                    <div class="note" id="${data[i]._id}"></div>
                </div>`
                );
            }
            console.log(data, 'article data');
        })
    )
})

