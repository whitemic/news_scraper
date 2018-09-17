$.getJSON("/articles", function(data) {
    data.forEach(function(element) {
        $("#articles").append("<p data-id='" + element._id + "'>" + element.title + "<br/>" + element.link + "</p>");
    });
});

$(document).on("click", "p", function(){
    $("#comments").empty();
    var thisId = $(this).attr("data-id");

    $.ajax({
        method: "GET",
        url: "/articles" + thisId
    })
        .then(function(data){
            $("#comments").append("<h2>" + data.title + "</h2>");
            
             $("#comments").append("<input id='titleinput' name='title' >");

             $("#comments").append("<textarea id='bodyinput' name='body'></textarea>");

             
            $("#comments").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
      

            if (data.comment) {

              $("#titleinput").val(data.comment.title);

              $("#bodyinput").val(data.comment.body)
            
            };
        });
});

$(document).on("click", "#savecomment", function(){
    var thisId = $(this).attr("data-id");

    $.ajax({
        method: "POST",
        url: "/articles/" + thisId,
        data: {
            title: $("#titleinput").val(),
            body: $("#bodyinput").val()
        }
    })
        .then(function(data){
            $("#comments").empty
        });

    $("#titleinput").val("");
    $("#bodyinput").val("");
});