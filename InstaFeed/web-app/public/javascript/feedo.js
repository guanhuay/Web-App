var newsJSONData = {};
var articleObj;
newsJSONData['subscript'] = [];
var aSources = [];

var FavJSONdata = {};
var aFavlistId =[];

var newsFiltedBySource=[];

     //subscript keep tracks of all the source id the user subscript
//Need to change 'list' and html id name to sth else
var list = document.getElementById("grid");
// $("footer").attr('display','none');
var iterator=0, newUpperLimit=10;   //keep track of the rendered article index
var theEnd=false, notified=false;  //notify infinite scroll that all the articles have been displayed
var news = document.getElementById("news");
var lightSpeedIn = document.getElementById("lightSpeedIn");


function getCurrentUser(){
    var cur_url = window.location.href;
    var parseURL = cur_url.split('/');
    var username = parseURL[parseURL.length-1];
    return username;
}


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



makeRequest('/api/article', function(data) {
//     // Transform the response string into a JavaScript object
    if(data){
        articleObj = JSON.parse(data);
        newsJSONData['articles'] = articleObj['articles'];
        // newsJSONData.articles.sort(function(a,b){
        //   if(a.publishedAt && b.publishedAt){
        //     return a.publishedAt - b.publishedAt;
        //   }
        // });
    }
    articlesLoaded = true;
    loadSources();
});

var loadSources = function(){
  makeRequest('/api/'+getCurrentUser()+'/source', function(data) {
    // Transform the response string into a JavaScript object
    if(data){
        var UserSource = JSON.parse(data);
        for (var i=0;i<UserSource.sourceList.length;i++){
          aSources.push(UserSource.sourceList[i]);
        }

    }
    sourceLoaded = true;
    loadFavorite();
  });
}

var loadFavorite = function(){
  makeRequest('/api/'+getCurrentUser()+'/favorite', function(data) {
     // Transform the response string into a JavaScript object
    if(data){
        var favObj = JSON.parse(data);
        FavJSONdata['favoriteList'] = favObj['favoriteList'];
    }
    favoriteLoaded = true;
    attemptRunApplication();
  });
}

var attemptRunApplication = function() {
    if (articlesLoaded && sourceLoaded && favoriteLoaded) {
        runApplication();
    }
};



function  runApplication(){
//********** VARIABLES SECTION
if (FavJSONdata['favoriteList']){
  for (var i=0;i<FavJSONdata['favoriteList'].length;i++){
  aFavlistId.push(FavJSONdata['favoriteList'][i].id);
  }
  console.log(aFavlistId);
}



//********** FUNCTIONS SECTION
function getJSON(source){
  $.getJSON("https://newsapi.org/v1/articles?source="+source+"&sortBy=top&apiKey=05619ebbf6c24c3493a6dfd971bb5557",function(jsonData){
    $.ajax({
      type:'POST',
      url: '/api/article',
      crossDomain: true,
      data: jsonData,
      dataType: "json",
      success: function(json) {
        if(json.error) return;
        //fire off all ajax calls
        $(document).ajaxStop(function() { location.reload(); });
      }
    })

  })
}


var listTen = function(data) {
  var articlesLen=data.length;

  if(newUpperLimit >= articlesLen){

    newUpperLimit=articlesLen;
    theEnd=true;
  }
  var toAppend = '';
  for(var i=iterator; i<newUpperLimit; i++){
    ///img/dummy.png
    // var rand = Math.floor(Math.random() * (3 - 1) + 1);
    if (aFavlistId.includes(data[i].id)){

    toAppend += `<li><a target="_blank" href="/news/${data[i].id}">
                              <img src="${data[i].urlToImage}" alt="${data[i].url}" height="314" width="314"></a>
                              <h3>${data[i].title}<br>
                              <div><img id="i${i}" class="favorite" src="/img/favorite1.png" height="26" width="26"></img>
                              </div>
                              </h3>
                  </li>`;
    }else{
    toAppend += `<li><a target="_blank" href="/news/${data[i].id}">
                              <img src="${data[i].urlToImage}" alt="${data[i].url}" height="300" width="330"></a>
                              <h3>${data[i].title}<br>
                              <div><img id="i${i}" class="favorite" src="/img/favorite.png" height="26" width="26"></img>
                              </div>
                              </h3>
                  </li>`;      
    }

  }
  $('#grid').append(toAppend);
  $(document).ready(function(){
       new GridScrollFx( document.getElementById( 'grid' ), {
        viewportFactor : 0.4
        } );
  })
  iterator=i;
  newUpperLimit+=10;
  if(theEnd===true && notified===false) {
    $('#endFeed').show();
    $("footer").attr('display','block');
    notified=true;

  }
  if(notified===false) {

  }
}


//MAIN CODE*****************************************

function showFeed(key) {
  if(newsJSONData.articles){
    newsFiltedBySource = [];
    //console.log(aSources);
    for (var i=0;i<newsJSONData.articles.length;i++){
      // console.log("aSources within for loop:"+ aSources);
      if (aSources.includes(newsJSONData.articles[i].source) && newsJSONData.articles[i].title.toLowerCase().includes(key.toLowerCase()))

        newsFiltedBySource.push(newsJSONData.articles[i]);
      // console.log(newsFiltedBySource);
    }
    console.log(newsFiltedBySource);
    listTen(newsFiltedBySource);

  }
}

showFeed('');

//only used for pulling JSON
var AllSources = ["bbc-news","ign","cnn","national-geographic","new-scientist","polygon",
  "reuters", "espn", "bloomberg","buzzfeed", "the-economist", "engadget",
  "reddit-r-all", "mtv-news", "google-news"
];

if (getCurrentUser() !== "admin"){
  $("#getjsonButton").hide();
}
if (getCurrentUser() === "admin"){
  $("#getjsonButton").click(function(){
      for (var i=0;i<AllSources.length;i++){
        getJSON(AllSources[i]);

      };
    $(document).ajaxStop(function() { location.reload();});

  })
}

//----------------add click event to all images in modal to make they look selected when clicking
$(".modal-icon").click(function(){
  var name = $(this).attr("name");
  var source_img_id = $(this).attr('id');
  // console.log(source_img_id);
  //var source_id = Number(source_img_id.substr(2));
  if(name==="dark"){
    $(this).css('box-shadow', 'inset 0 0 5px orange, 0 0 5px orange');
    $(this).attr("name", "light");
    newsJSONData.subscript.push(source_img_id);
  }else if(name==="light") {
    $(this).css('box-shadow', 'inset 0 0 5px white, 0 0 5px white');
    $(this).attr("name", "dark");
    let ind_source_img_id = newsJSONData.subscript.indexOf(source_img_id);
    console.log("index is :" + ind_source_img_id);
    if(ind_source_img_id>-1) newsJSONData.subscript.splice(ind_source_img_id, 1);
  }
  // console.log(newsJSONData.subscript);
});

//**************************modal Section under Manage Subscription
$(document).ready(function() {
  for(let k = 0; k < aSources.length ; k++) {
    // console.log("click " + aSources[k])
    $('#'+aSources[k]).click();
  }

  $("#searchWord").click(function() {
    var key = $("#searchBar").val();
    //initialize
    iterator=0;
    newUpperLimit=10;
    theEnd=false;
    notified=false;
    $("#grid").html('');
    showFeed(key);

  });

  $("#clearWord").click(function() {
    $("#searchBar").val('');
    //initialize
    iterator=0;
    newUpperLimit=10;
    theEnd=false;
    notified=false;
    $("#grid").html('');
    showFeed('');
  });

  $(document).on('click', '.favorite', function(){
        if($(this).attr('src') === '/img/favorite.png'){

          $(this).attr('src','/img/favorite1.png');
          var fav_url = $(this).parent().parent().prev().attr("href");
          var fav_title = $.trim($(this).parent().parent().text());
          var cur_url = window.location.href;
          var parseURL = cur_url.split('/');
          var username = parseURL[parseURL.length-1];

          var favoriteURL = '/api/' + username + '/favorite';
          var favoritetoCreate = {
            "title" : fav_title
          }
          $.ajax({
              type: 'POST',
              url: favoriteURL,
              crossDomain: true,
              dataType: "json",
              data: favoritetoCreate,
          })

        }
        else{
          $(this).attr('src','/img/favorite.png');

          var unfav_url = $(this).parent().parent().prev().attr("href");
          var unfav_title = $.trim($(this).parent().parent().text());
          var cur_url = window.location.href;
          var parseURL = cur_url.split('/');
          var username = parseURL[parseURL.length-1];
          // var favoriteToCreate
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
          })

        }
      });


  $(this).scrollTop(0);

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
      // location.reload();

    }
  });


  $("#subscribe").animatedModal({
    modalTarget: 'teste',
    animatedIn: 'bounceInUp',
    animatedOut: 'bounceOutDown',
    color: '#39BEB9',
    animationDuration: '.5s',
    beforeOpen: function() {
      $("#teste").css('display','block');
      var children = $(".thumb");
      var index = 0;
      function addClassNextChild() {
        if (index == children.length) return;
        children.eq(index++).show().velocity("transition.slideUpIn", {
          opacity: 1,
          stagger: 450,
          defaultDuration: 100
        });
        window.setTimeout(addClassNextChild, 100);
      }
      addClassNextChild();
    },
    afterClose: function() {
      console.log("after close modal");
      console.log(newsJSONData.subscript);
      // var selectedSources = {
      //   "sources": newsJSONData.subscript
      // }
      // var urlToPut = '/api/'+getCurrentUser()+'/source';
      // // console.log(urlToPut);
      // $.ajax({
      //   type: 'PUT',
      //   url: urlToPut,
      //   crossDomain: true,
      //   dataType: "json",
      //   data: selectedSources,
      // })
      $(".thumb").hide();
      //  window.setTimeout(5000);
      //  location.reload();
      // $(document).ajaxStop(function() { location.reload(); });
    }
  });

  $(".close-teste").click(function(){
    var selectedSources = {
      "sources": newsJSONData.subscript
    }
    var urlToPut = '/api/'+getCurrentUser()+'/source';
    // console.log(urlToPut);
    $.ajax({
      type: 'PUT',
      url: urlToPut,
      crossDomain: true,
      dataType: "json",
      data: selectedSources,
      success: function(data) {
        console.log("successfully updating subscription");
        location.reload();
      },
      error: function(data) {
        console.log("error updating subscription");
        location.reload();
      }
    })
  });
//****************************modal section ends
//infinite scroll function
  $(window).scroll(function () {
     if ($(window).scrollTop() >= $(document).height() - $(window).height() - 40) {
        listTen(newsFiltedBySource);
     }
  });
//infinite scroll function ends
});







//runApplication ends
}
