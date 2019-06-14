// Onclick for Open Notes Button
$(document).on('click', '.note-button', function () {
    // Clear out notes div before displaying new info (just in case)
    $('#notes').empty();
    // Hide open notes button when notes are open. This prevents duplicates.
    $('.note-button').hide();
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
            // Input for note title
            $('.note[id=' + thisID + ']').append("<input id='titleInput' class='mb-3' name='title' >");
            // Text area for note body
            $('.note[id=' + thisID + ']').append("<textarea id='bodyInput' class='mb-3' name='body'></textarea>");
            // Container for submit button (To help with centering)
            $('.note[id=' + thisID + ']').append("<div class='d-flex justify-content-center' id='button-container'></div>");
            // Submit button for note
            $('#button-container').append("<button data-id=" + data._id + " class='text-center btn btn-outline-success mb-3' id='saveNote'>Save Note</button>");

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
            // Empty the notes section and bring back the 'open notes' button.
            $(".note").empty();
            $('.note-button').show();
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
    }).then(function() {
        
        // get json from the /articles route, which should contain any new articles
        $.getJSON("/articles", function (data) {
            // Iterate through data
            for (let i = 0; i < data.length; i++) {
                // The HTML below matches index.handlebarse
                $('.articles-container').append(
                    `<div class="article m-3">
                    <div class="row">
                        <div class="col-sm-9 headline-container">
                            <a href='${data[i].link}' target="_blank" class="article-link">${data[i].title}</a>
                        </div>
                        <div class="col-sm-9">
                            <p class="article-summary">${data[i].summary}</p>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-12 d-flex justify-content-center">
                            <button class="note-button btn btn-outline-success m-3" data-id="${data[i]._id}">Open Notes</button>
                        </div>
                    </div>
                    <div class="note-container d-flex justify-content-center">
                        <div class="note" id="${data[i]._id}"></div>
                    </div>
                </div>`
                );
            }
            // ${data[i].link}
            // ${data[i].title}
            // ${data[i].summary}
            // ${data[i]._id}
            console.log(data, 'article data');
        })
    })
})

