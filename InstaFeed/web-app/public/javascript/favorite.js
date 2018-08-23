var FavJSONdata ={};

function getCurrentUser(){
  var cur_url = window.location.href;
  var parseURL = cur_url.split('/');
  var username = parseURL[parseURL.length-2];
  return username;
}

console.log(getCurrentUser());
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

makeRequest('/api/'+getCurrentUser()+'/favorite', function(data) {
//     // Transform the response string into a JavaScript object
    if(data){
        var favObj = JSON.parse(data);
        FavJSONdata['favoriteList'] = favObj['favoriteList'];
    }
    favoriteLoaded = true;
    attemptRunApplication();
});
var attemptRunApplication = function() {
    if (favoriteLoaded === true) {
        runApplication();
    }
};



function  runApplication(){
  console.log(FavJSONdata['favoriteList']);
  var aFavList = FavJSONdata['favoriteList'];

  for (var i=0;i<aFavList.length;i++){
    $(".list-group")[0].appendChild(createFavList(aFavList[i].title, aFavList[i].id, aFavList[i].description, aFavList[i].source));
  }

  $(".unfavorite").on('click',function(){
    var unfav_title = $(this).prev().children().html();
    var cur_url = window.location.href;
    var parseURL = cur_url.split('/');
    var username = parseURL[parseURL.length-2];

    console.log("the favorite article title is: "+ unfav_title);
    var unfavoriteURL = '/api/' + username + '/favorite';
    var unfavoritetoDelete = {
      "title" : unfav_title
    }
    $.ajax({
        type: 'DELETE',
        url: unfavoriteURL,
        crossDomain: true,
        dataType: "json",
        data: unfavoritetoDelete,
        // success: function() {
        //    $(this).parent().parent().remove();
        // },
        // error: function() {
        //   // $(this).parent().parent().remove();
        //   window.location.reload();
        // }
    })
    $(this).parent().parent().remove();
  })



function createFavList(title,id,description,source){

  var favItem = document.createElement('div');
  favItem.className ="list-group-item list-group-item-action flex-column align-items-start";
  var favInnerItem = document.createElement('div');
  favInnerItem.className = "d-flex w-100 justify-content-between";
  favItem.appendChild(favInnerItem);
  var aLink = document.createElement('a');
  aLink.href = "/news/" + id;
  var titleItem = document.createElement('h5');
  titleItem.className = "mb-1 title-text";
  titleItem.innerHTML = title;
  aLink.appendChild(titleItem);
  favInnerItem.appendChild(aLink);
  var unfavButton = document.createElement('button');
  unfavButton.className = "unfavorite waves-effect waves-light btn";
  unfavButton.innerHTML = "Unlike";
  favInnerItem.appendChild(unfavButton);
  var descriptionItem = document.createElement('p');
  descriptionItem.className = "mb-1 description";
  descriptionItem.innerHTML = description;
  var sourceItem = document.createElement("small");
  sourceItem.className = "source";
  sourceItem.innerHTML = "Source: " + source;
  favItem.appendChild(descriptionItem);
  favItem.appendChild(sourceItem);
  return favItem;
}


$(document).ready(function() {
  $("#searchBar").keyup(function(){
    var key = $("#searchBar").val();
    $(".title-text").each(function(title){
      //console.log($(this).parent().parent().parent());
      if($(this).html().toLowerCase().includes(key.toLowerCase())) {
        $(this).parent().parent().parent().css("display", "block");
      } else {
        $(this).parent().parent().parent().css("display", "none");
      }
    });
  });
});



          // <div class="list-group-item list-group-item-action flex-column align-items-start">
          //   <div class="d-flex w-100 justify-content-between">
          //     <a href="#">
          //     <h5 class="mb-1 title-text">List group item heading</h5>
          //     </a>
          //     <medium class="unfavorite">Unfavorite</medium>
          //   </div>
          //   <p class="mb-1 description">DescriptionDescriptionDescriptionDescription</p>
          //   <small class="source">Fav.source</small>
          // </div>

















}
