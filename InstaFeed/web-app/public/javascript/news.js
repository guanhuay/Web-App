var articleData = {};
var userData = {};
var articleidFromBackend = document.getElementById("invisible").innerHTML;
var articleid = Number(articleidFromBackend);
var title = document.getElementById("title");
var description = document.getElementById("description");
var image = document.getElementById("image");
var moreAbout = document.getElementById("moreAbout");
var news = document.getElementById("news");
var close = document.getElementById("close");
var replyToId, editId  //keep track of the replied user and the comment being edited
//var commentSection = document.getElementById("comment-body");

console.log(articleid);


function makeRequest(url,callback) {
    var httpRequest = new XMLHttpRequest();
    if (!httpRequest) {
      alert('Fail to create httpRequest');
      return false;
    }
   httpRequest.onreadystatechange = function(){
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
      if (httpRequest.status === 200) {
        var local = httpRequest.responseText;
        //var parselocal = JSON.parse(local);
        callback.apply(this,[local]);
      } else {
        console.log('There was a problem with the request.');
      }
    }

   };

    httpRequest.open('GET', url);
    httpRequest.send();

}

function getCurrentUser() {
  makeRequest('/api/currentuser', function(data) {
    if(data) {
      var userObj = JSON.parse(data);
      userData = userObj;
      console.log(userData);
    }
    attemptRunApplication();
  });
}

makeRequest('/api/news/' + articleid, function(data) {
//     // Transform the response string into a JavaScript object
    if(data){
        var articleObj = JSON.parse(data);
        articleData = articleObj;
        console.log("articleData got data");
    }
    articlesLoaded = true;
    getCurrentUser();

});
var attemptRunApplication = function() {
    if (articlesLoaded === true) {
        runApplication();
    }
};

function  runApplication(){
var socket = io.connect('http://localhost:8080/', {
  'force new connection': true
});

function hasReply(u){
  if(!u) return "";
  else return "@"+u+": ";
}

function hasReplyId(ID) {
  if(!ID) return 0;
  else return ID;
}

function sameUser(commentid, userid) {
  if(userid == userData.id) {
    return '<span id="e' + commentid + '" name="en'+ userid + '" class="edit waves-effect waves-light btn">Edit</span>';
  }else {
    return '';
  }
}

function hasAuthor(author) {
  if(author) return author;
  else return 'unknown author'
}

function hasCreated(create) {
  if(create) return create;
  else return ''
}

console.log(articleData);
moreAbout.textContent = `By ${hasAuthor(articleData.author)} ${hasCreated(articleData.publishedAt)} (${articleData.source})`
title.innerHTML = `<strong class="titleLink" id="titleLink" target="_blank" href=${articleData.url}>${articleData.title}</strong>`;
description.textContent = `${articleData.description}...`;
image.innerHTML = `<img class="news_img" src="${articleData.urlToImage}" alt=${articleData.title} />`;
var commentLen = articleData.comments.length;
//to_append = '';
for(var i = 0; i < commentLen; i++){
  var time = articleData.comments[i].create.split('.')[0];
  $('#comment-body').append(`
    <div id="c${articleData.comments[i].id}" name="${articleData.comments[i].username}" class="comment col-xs-12 col-md-12">
      <div class="left-wrapper col-xs-1 col-md-1">
        <div><img class="avatar" src="${articleData.comments[i].avatar}"></div>
        <div class="comment-title">${articleData.comments[i].username}</div>
      </div>
      <div class="middle-wrapper col-xs-10 col-md-10">
        <p class="replyLink">${hasReply(articleData.comments[i].replyuser)}</p>
        <section class="desc" id="d${articleData.comments[i].id}">${articleData.comments[i].description}</section>
        <span><p class="publise_time"> ${time} </p></span>
      </div>
    <div class="col-xs-12 col-md-12">
      <div class="two_button col-xs-10 col-md-10"><button id="r${articleData.comments[i].id}" name="rn${articleData.comments[i].userid}" class="reply waves-effect waves-light btn">Reply</button>${sameUser(articleData.comments[i].id, articleData.comments[i].userid)}</div>
    </div>
    </div>`
  );
}
//$('#comment-body').append(to_append);

//------------------socket started
socket.on('successfulAddNormalComment', function(data) {
  console.log("gotcha server normal comment");
  if(data.articleid == articleid){
    var time = data.create.split('.')[0];
    $('#comment-body').append(`
      <div id="c${data.commentid}" name="${data.cuname}" class="comment col-xs-12 col-md-12">
        <div class="left-wrapper col-xs-1 col-md-1">
          <div><img class="avatar" src="${data.avatar}"></div>
          <div class="comment-title">${data.cuname}</div>
        </div>
        <div class="middle-wrapper col-xs-10 col-md-10">
          <section class="desc" id="d${data.commentid}">${data.content}</section>
          <span><p class="publise_time"> ${time}</p></span>
        </div>
      <div class="col-xs-12 col-md-12">
        <div class="two_button col-xs-10 col-md-10"><button id="r${data.commentid}" name="rn${data.cuid}" class="reply waves-effect waves-light btn">Reply</button>${sameUser(data.commentid, data.cuid)}</div>
      </div>
      </div>`
    );
    var newNormalComment = {
      "id": data.commentid,
      "description": data.content,
      "userid": data.cuid,
      "username": data.cuname,
      "replyid": null,
      "replyuser": null,
      "create": data.create,
      "update": data.update,
    }
    articleData.comments.push(newNormalComment);
  }
});

socket.on('successfulReply', function(data) {
  console.log("gotcha server normal comment");
  if(data.articleid == articleid){
    var time = data.create.split('.')[0];
    $('#comment-body').append(`
      <div id="c${data.commentid}" name="${data.cuname}" class="comment col-xs-12 col-md-12">
        <div class="left-wrapper col-xs-1 col-md-1">
          <div><img class="avatar" src="${data.avatar}"></div>
          <div class="comment-title">${data.cuname}</div>
        </div>
        <div class="middle-wrapper col-xs-10 col-md-10">
          <p class="replyLink">@${data.replyuser}: </p>
          <section class="desc" id="d${data.commentid}">${data.content}</section>
          <span><p class="publise_time"> ${time}</p></span>
        </div>
      <div class="col-xs-12 col-md-12">
        <div class="two_button col-xs-10 col-md-10"><button id="r${data.commentid}" name="rn${data.cuid}" class="reply waves-effect waves-light btn">Reply</button>${sameUser(data.commentid, data.cuid)}</div>
      </div>
      </div>`
    );
    var newNormalComment = {
      "id": data.commentid,
      "description": data.content,
      "userid": data.cuid,
      "username": data.cuname,
      "replyid": data.replyid,
      "replyuser": data.replyuser,
      "create": data.create,
      "update": data.update,
    }
    articleData.comments.push(newNormalComment);
  }
});

socket.on('successfulEdit', function(data) {
  console.log("gotcha server edit comment");
  if(data.articleid == articleid){
    console.log("the right article for edit");
    if($("#d"+data.commentid).length){
      console.log("can edit it at client side");
      $("#d"+data.commentid).html(data.content);
      for(var i = 0; i < articleData.comments.length; i++) {
        if(data.commentid == articleData.comments[i].id){
          articleData.comments[i].description = data.content;
        }
      }
    }
  }
});

//

$(document).ready(function(){
  $("#add-comment").click(function() {
    $("#comment-area").val('');
    $(".enteredLen").text(null);
  });

  $("#post").click(function() {
    $("#unpost").click();
    commentValue = $("#comment-area").val();
    console.log(commentValue);
    if(commentValue.length<2 || commentValue.length >200) {
      alert("Your comment should be between 2~200 letters.");
    } else {
      var normalCommentObj = {
        "val": commentValue,
        "commentuser": userData.id,
        "article": articleid,
        "avatar": userData.avatar
      }
      socket.emit('sendNormalComment', normalCommentObj);
    }
  });

  $(document).on('click', '.reply', function() {
    $("#reply-area").val('');
    $(".enteredLen").text(null);
    var replyButtonId = $(this).attr("name");
    replyToId = replyButtonId.substr(2);
    var replyCommentId = $(this).attr("id").substr(1);
    console.log("replyCommentId is " + replyCommentId);
    var replyTo = $("#c"+replyCommentId).attr("name");
    //console.log(replyTo);
    $("#replyLabel").text("Reply To " + replyTo + ":");
    $("#reply-comment").click();
    //$("#reply-area").focus();

  });

  $("#post2").click(function(){
    $("#unpost2").click();
    var replyValue = $("#reply-area").val();
    if(replyValue.length<2 || replyValue>200) {
      alert("Your comment should be between 2~200 letters.");
    } else {
      var replyCommentObj = {
        "val": replyValue,
        "commentuser": userData.id,
        "replyuser": replyToId,
        "article": articleid,
        "avatar": userData.avatar
      }
      socket.emit('sendReplyComment', replyCommentObj);
    }
  })

  $(document).on('click', '.edit', function() {
    console.log("into edit");
    editId = $(this).attr("id").substr(1);
    var previousComment = $("#d" + editId).text();
    var lettersLeft = 200-previousComment.length;
    $(".enteredLen").text(lettersLeft);
    console.log(previousComment);
    $("#edit-area").html(previousComment);
    $("#edit-comment").click();
  });

  $("#post3").click(function(){
    $("#unpost3").click();
    var editValue = $("#edit-area").val();
    if(editValue.length<2 || editValue.length >200) {
      alert("Your comment should be between 2~200 letters.");
    } else {
      var editCommentObj = {
        "val": editValue,
        "commentid": editId,
        "articleid": articleid,
      }
      socket.emit('sendEditComment', editCommentObj);
    }
  })

  $(".form-control").on('keyup', function() {
    var enteredString = $(this).val();
    var enteredStringLen = enteredString.length;
    var letterLeft = 200-enteredStringLen;
    //console.log($(this).next());
    if(letterLeft>=0){
      $(".enteredLen").text(letterLeft);
    } else {
      $(".enteredLen").text("Letter limit exceeded!");
    }

  })

  $("#preview").click(function(){
    var utp = articleData.url;
    news.innerHTML=`<iframe src="${utp}"></iframe>`;
    $("#demo1").click();
  })

  $("#demo1").animatedModal({
    modalTarget: 'lightSpeedIn',
    animatedIn: 'lightSpeedIn',
    animatedOut: 'bounceOutDown',
    color: 'red',
    beforeOpen: function() {
      $("#lightSpeedIn").css('display','block');
      // console.log($(this));
      // var urlToPage=$(this).children("img").attr("alt");
      // document.getElementById("news").innerHTML=`<iframe src="${urlToPage}"></iframe>`;
      var children = $(".thumb");
      var index = 0;
      function addClassNextChild() {
        if (index == children.length) return;
        children.eq(index++).show().velocity("transition.slideRightIn", {
          opacity: 1,
          stagger: 450,
          defaultDuration: 100
        });
        window.setTimeout(addClassNextChild, 100);
      }
      addClassNextChild();
    },
    afterClose: function() {
      $(".thumb").hide();
    }
  });

  $(".close-lightSpeedIn").click(function(){
    news.innerHTML='';
  });

});

// $(window).bind('mousewheel', function(event) {
//     if (event.originalEvent.wheelDelta >= 0) {
//         console.log('Scroll up');
//         close.style.display="block";
//     }
//     else {
//         console.log('Scroll down');
//         close.style.display="none";
//     }
// });

}  // end of run function
