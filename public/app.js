$.getJSON("/articles", function(data) {
    data.forEach(function(element) {
        $("#articles").append(
            "<li class='list-group-item' data-id='" + element._id + "'><p  class=font-weight-bold>" + element.title +  "</p><p>" + element.summary + "</p><br/><button type='button' class='btn btn-primary' href='/comments.html'>Comments</button><button type='button' class='btn btn-primary ml-1' href='" + element.link + "'>Link</button></li>");
        });
});

var exexute;

function showComments(id) {
    $.ajax({
        method: "GET",
        url: "/articles/" + id
    })
        .then(function(data){
            $("#comments").append("<div class='form'><div id='comment-form'class='form-group'></div></div>")
            $("#comment-form").append("<h2>" + data.title + "</h2>");
            
             $(".form-group").append("<input id='titleinput' class='form-control' type='text' placeholder='Contributor Name'>");

             $(".form-group").append("<textarea id='bodyinput' class='form-control' id='exampleFormControlTextarea1' placeholder='Write comment text here...' rows='3'></textarea>");

             
            $("#comment-form").append("<button class='btn btn-primary' data-id='" + data._id + "' id='savecomment'>Save Note</button>");

            $("comments").show();
      

            if (data.comment !== null) {
                // console.log(data.comment);
                $("#oldercomments").empty();
                data.comment.forEach(function(element) {
                    $("#oldercomments").append("<li class='list-group-item' data-id='" + element._id + "'><p  class=font-weight-bold>" + element.title +  "</p><p>" +element.body + "</p><br/><button id='delete' data-commentid=" + element._id + " data-articleid=" + id + " type='button' class='btn btn-primary'>Delete</button></li>");

                console.log("id is " + id);
            });
            //   $("#titleinput").val(data.comment.title);
            //   $("#bodyinput").val(data.comment.body)          
            };
        });
}

$(document).on("click", "li", function(){
    $("#comments").empty();
    var thisId = $(this).attr("data-id");
    // console.log(thisId);

    showComments(thisId);

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
        $("#comments").empty();
        showComments(thisId);
    });

    $("#titleinput").val("");
    $("#bodyinput").val("");
});

$(document).on("click", "#delete", function () {
    var thisId = $(this).attr("data-commentid");
    var articleId = $(this).attr("data-articleid");
    var url = "/delete/" + thisId + "/" + articleId;
    console.log("url is" + url);



    $.ajax({
            method: "POST",
            url: "/delete/" + thisId + "/" + articleId,
        })
        .then(function (data) {
            // console.log(data);
            if (data.note) {
                $("#titleinput").val(data.note.title);
                $("#bodyinput").val(data.note.body);
            }
            $("#commentdiv").empty();
            // showComments(articleId);
        }).then(function() {
            showComments(articleId);
        }
        );


});