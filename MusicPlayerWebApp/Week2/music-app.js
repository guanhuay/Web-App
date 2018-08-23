//alert(datacopy.playlists[0].name);

//replace inline handler with javascript handler
document.getElementById("close_modal").onclick = function(){closeModal()};
//alternative way: document.getElementsByClassName("Some Class")[0].onclick = function{somefunction()};
//must have [0] specify because getElementByClassName return a tag, we need to access the element from there.
document.getElementById("defaultOpen").onclick= function(){tabswitch(event,'library')};
document.getElementById("playlistshandler").onclick= function(){tabswitch(event,'playlists')};
document.getElementById("searchhandler").onclick=function(){tabswitch(event,'search')};
document.getElementById("defaultSort").onclick=function(){librarySwitch('artist')};
document.getElementById("titlehandler").onclick=function(){librarySwitch('title')};
document.getElementById("inputtext").onkeyup=function(){searchdata()};
var datacopy = window.MUSIC_DATA;
var datacopy1 = window.MUSIC_DATA;
var datacopy2 = window.MUSIC_DATA;

for(var i=0;i<datacopy.playlists.length;i++){
    var newLi = document.createElement("li");
    newLi.className = "modal_playlist";
    newLi.innerHTML = '</br><div className="modal_playlist" data-id="'+ datacopy.playlists[i].id +'">' + datacopy.playlists[i].name + '</div></br>';
    var insertId = document.getElementById("modal_insert");
    insertId.appendChild(newLi);      
}

//tab switch
//show playlist on modal
function tabswitch(evt, tabName) {
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the link that opened the tab
    document.getElementById(tabName).style.display = "block";
    if(tabName === 'library'){
        document.getElementById("defaultSort").click();
        backtoplaylist();
        // document.getElementById('playlist_hide').style.display="";
        // document.getElementById("playlist_insert").style.display="none";

    }
    if(tabName === 'search'){
        backtoplaylist();
    }
    if(tabName === 'playlists'){
        backtoplaylist();
    }
    //backtoplaylist();
    evt.currentTarget.className += " active";
}
document.getElementById("playlistshandler").click();
document.getElementById("defaultOpen").click();
// document.getElementById("id0").click();
// document.getElementById("id1").click();
// document.getElementById("id2").click();

//playlists page
for(i=0;i<datacopy.playlists.length;i++){
	var newLi = document.createElement("li");
	newLi.innerHTML = '<div class="playlist-wrap col-xs-12 col-md-12" id="id'+ i +'"onclick="printsong('+ datacopy.playlists[i].id +')"> <div class="coverpage-module col-xs-2 col-md-2"><canvas class="coverpage"></canvas></div>' + '<div class="playlists-title-module col-xs-8 col-md-8"><p class="playlists-text" >' + 
    datacopy.playlists[i].name + '</p></div><div class="icon-module"><span class="glyphicon glyphicon-chevron-right"></span></div></div>';
	//newLi.textContent = datacopy.playlists[i].name;
    newLi.className= "playlists-temp";
    newLi.style.display= "";
	var insertId = document.getElementById("playlist_hide");
	insertId.appendChild(newLi);
}

function printsong(playlistid){
    var A = document.getElementById("playlist_hide");
    A.style.display = "none";
    var B = document.getElementById("playlist_insert");
    for(var j=B.childNodes.length-1; j>=0; j--){
        B.childNodes[j].innerHTML="";
    }
    B.style.display = "";
    var temp;
    for(i=0;i<datacopy.playlists.length;i++){
        if(datacopy.playlists[i].id === playlistid){
            temp = datacopy.playlists[i].name;
        }
    }
    newA = document.createElement("li");
    newA.innerHTML = '<h3 id="playlist_name">' + temp + '</h3>';
    newB = document.createElement("li");
    newB.innerHTML = '<button id="playlist_button" onClick="backtoplaylist()">Back</button>';
    //newA.innerHTML = event.textContent;
    var insertId = document.getElementById('playlist_insert');
    insertId.appendChild(newA);
    insertId.appendChild(newB);
    for(j=0;j<datacopy.songs.length;j++){
        if(datacopy.playlists[playlistid].songs.includes(j)){
            newC = document.createElement("li");
            newC.className = "playlist_song";
            newC.innerHTML = '<div class="playlist-wrap col-xs-12 col-md-12"><div class="coverpage-module col-xs-2 col-md-2"><canvas class="coverpage"></canvas></div>' + '<div class="title-module col-xs-8 col-md-8"><p class="songs-text">' + datacopy.songs[j].title + 
            '</p><p class="songs-text" id="album-text" data-id="' + datacopy.songs[j].id + '">' + datacopy.songs[j].artist + '</p></div>' + 
            '<div class="icon-module"><span class="glyphicon glyphicon-plus-sign add3"></span><span class="glyphicon glyphicon-play"></span></div></div>';
            insertId.appendChild(newC);
        }
    }
}

function backtoplaylist(){
    var A = document.getElementById("playlist_insert");
    A.style.display = "none";
    var B = document.getElementById("playlist_hide");
    B.style.display = "";
}

//library page
function sortBy(filed, rev, primer) {
    rev = (rev) ? -1 : 1;
    return function (a, b) {
        a = a[filed];
        b = b[filed];
        if (typeof (primer) != 'undefined') {
            a = primer(a);
            b = primer(b);
        }
        if (a < b) { return rev * -1; }
        if (a > b) { return rev * 1; }
        return 1;
    }
}

//sort switch
function librarySwitch(sortName) {
    if(sortName === 'artist'){
    	sortSelector('artist');
    }
    else{
    	sortSelector('title');
    }
}

//default sort
document.getElementById("titlehandler").click();
document.getElementById("defaultSort").click();

//sorting algorithm
function sortSelector(sortName) {
	var sortVar;
	if(sortName === 'artist'){
        // var insertIdtemp = document.getElementById("libraryinsert");
        // if(insertIdtemp.childNodes.length){
        //     for(var j=insertIdtemp.childNodes.length-1; j>=0; j--){
        //         //insertIdtemp.removeChild(insertId.childNodes[j]);
        //         insertIdtemp.childNodes[j].innerHTML="";
        //     }
        // //restore orginal music-data order by id
        // datacopy.songs.sort(sortBy('id', false, parseInt));
        // }
        var insertId2 = document.getElementById("libraryinsert2");
        insertId2.style.display = "none";
        datacopy.songs.sort(sortBy('id', false, parseInt));
        var temp = document.getElementById("libraryinsert1");
        temp.style.display ="";
        if(temp.childNodes.length===0){
		var pattern = new RegExp("^The ")
		for(var i=0;i<datacopy1.songs.length;i++){
			if(pattern.test(datacopy1.songs[i].artist)){
				datacopy1.songs[i].sortartist = datacopy1.songs[i].artist.substr(4,datacopy1.songs[i].artist.length);
			}
			else{
				datacopy1.songs[i].sortartist = datacopy1.songs[i].artist;
			}
		}
		sortVar = 'sortartist';
        datacopy.songs.sort(sortBy(sortVar, false, String));
        for(var i=0;i<datacopy1.songs.length;i++){
            var newLi = document.createElement("li");
            newLi.innerHTML = '<div class="playlist-wrap col-xs-12 col-md-12"><div class="coverpage-module col-xs-2 col-md-2"><canvas class="coverpage"></canvas></div>' + '<div class="title-module col-xs-8 col-md-8"><p class="songs-text">' + datacopy1.songs[i].title + 
            '</p><p class="songs-text" id="album-text" data-id="' + datacopy1.songs[i].id + '">' + datacopy1.songs[i].artist + '</p></div>' + 
            '<div class="icon-module"><span class="glyphicon glyphicon-plus-sign add1"></span><span class="glyphicon glyphicon-play"></span></div></div>';
            //newLi.textContent = datacopy.playlists[i].name;
            var insertId1 = document.getElementById("libraryinsert1");
            insertId1.appendChild(newLi);
            insertId1.style.display = "";
        }
	}
}
	else{
        // var insertIdtemp = document.getElementById("libraryinsert");
        // if(insertIdtemp.childNodes.length){
        //     for(var j=insertIdtemp.childNodes.length-1; j>=0; j--){
        //         //insertIdtemp.removeChild(insertId.childNodes[j]);
        //         insertIdtemp.childNodes[j].innerHTML="";
        //     }
        // //restore orginal music-data order by id
        // datacopy.songs.sort(sortBy('id', false, parseInt));
        // }
        var insertId1 = document.getElementById("libraryinsert1");
        insertId1.style.display = "none";
        datacopy2.songs.sort(sortBy('id', false, parseInt));
        var temp = document.getElementById("libraryinsert2");
        temp.style.display ="";
        if(temp.childNodes.length===0){
		var pattern = new RegExp("^The ")
		for(var i=0;i<datacopy2.songs.length;i++){
			if(pattern.test(datacopy2.songs[i].title)){
				datacopy2.songs[i].sorttitle = datacopy2.songs[i].title.substr(4,datacopy2.songs[i].title.length);
			}
			else{
				datacopy2.songs[i].sorttitle = datacopy2.songs[i].title;
			}
		}
		sortVar = 'sorttitle';
        datacopy2.songs.sort(sortBy(sortVar, false, String));
        for(var i=0;i<datacopy2.songs.length;i++){
            var newLi = document.createElement("li");
            newLi.innerHTML = '<div class="playlist-wrap col-xs-12 col-md-12"><div class="coverpage-module col-xs-2 col-md-2"><canvas class="coverpage"></canvas></div>' + '<div class="title-module col-xs-8 col-md-8"><p class="songs-text">' + datacopy2.songs[i].title + 
            '</p><p class="songs-text" id="album-text" data-id="' + datacopy2.songs[i].id + '">' + datacopy2.songs[i].artist +'</p></div>' + 
            '<div class="icon-module"><span class="glyphicon glyphicon-plus-sign add2"></span><span class="glyphicon glyphicon-play"></span></div></div>';
            //newLi.textContent = datacopy.playlists[i].name;
            var insertId2 = document.getElementById("libraryinsert2");
            insertId2.appendChild(newLi);
            insertId2.style.display = "";
        }
	}
}
}

//search implementation
for(var i=0; i<datacopy.playlists.length;i++){
      var newLi = document.createElement("li");
      newLi.className = "temp";
      newLi.style.display = "none";
      newLi.innerHTML = '<div class="playlist-wrap col-xs-12 col-md-12" data-id="'+ datacopy.playlists[i].id +'" onClick = "jumptoplaylist('+ datacopy.playlists[i].id +')"> <div class="coverpage-module col-xs-2 col-md-2"><canvas class="coverpage"></canvas></div>' + '<div class="playlists-title-module col-xs-8 col-md-8"><p class="playlists-text">' + 
      datacopy.playlists[i].name + '</p></div><div class="icon-module"><span class="glyphicon glyphicon-chevron-right"></span></div></div>';
      //newLi.textContent = datacopy.playlists[i].name;
      var insertId = document.getElementById("searchinsert");
      insertId.appendChild(newLi);
}
for(var i=0; i<datacopy.songs.length;i++){
      var newLi = document.createElement("li");
      newLi.className = "temp";
      newLi.style.display = "none";
      newLi.innerHTML = '<div class="playlist-wrap col-xs-12 col-md-12"><div class="coverpage-module col-xs-2 col-md-2"><canvas class="coverpage"></canvas></div>' + '<div class="title-module col-xs-8 col-md-8"><p class="songs-text">' + datacopy.songs[i].title + 
      '</p><p class="songs-text" id="album-text" data-id="' + datacopy.songs[i].id + '">' + datacopy.songs[i].artist +'</p></div>' + 
      '<div class="icon-module"><span class="glyphicon glyphicon-plus-sign add4"></span><span class="glyphicon glyphicon-play"></span></div></div>';
      //newLi.textContent = datacopy.playlists[i].name;
      var insertId = document.getElementById("searchinsert");
      insertId.appendChild(newLi);
}

function jumptoplaylist(listid){
    var tempA = 'playlists';
    tabswitch(event,tempA);
    printsong(listid);
}

function searchdata(){
    var inputtext,filter,ul,li,lireset,p,p2,p3;
    inputtext = document.getElementById('inputtext');
    filter = inputtext.value;
    li = document.getElementsByClassName("temp");
    for(var i=0; i< li.length; i++){
        if(i>2){
            p2 = li[i].getElementsByTagName("p")[0];
            p3 = li[i].getElementsByTagName("p")[1];
            if(p2.innerHTML.toLowerCase().indexOf(filter.toLowerCase()) > -1 || p3.innerHTML.toLowerCase().indexOf(filter.toLowerCase()) > -1){
                li[i].style.display = "";
            }
            else{
                li[i].style.display = "none";
            }
            continue;
        }
        p = li[i].getElementsByTagName("p")[0];
        if(p.innerHTML.toLowerCase().indexOf(filter.toLowerCase()) > -1){
            li[i].style.display = "";
        }
        else{
            li[i].style.display = "none";
        }
    }
    if(filter===""){
        lireset = document.getElementsByClassName("temp");
        for(var i=0; i<lireset.length; i++){
            lireset[i].style.display = "none";
        }
    }
    // for(var i=0; i<li2.length;i++){
    //     p2 = li2[i].getElementsByTagName("p")[0];
    //     p3 = li2[i].getElementsByTagName("p")[0];
    //     if(p2.innerHTML.indexOf(filter)>-1 || p3.innerHTML.indexOf(filter) >-1){
    //         li2[i].style.display = "";
    //     }
    //     else{
    //         li2[i].style.display = "none";
    //     }
    // }
    // for(var i=0; i<datacopy.playlists.length;i++){
    //     if(datacopy.playlists[i].name.indexOf(filter)> -1){
    //         var newLi = document.createElement("li");
    //         newLi.innerHTML = '<div class="playlist-wrap col-xs-12 col-md-12"> <div class="coverpage-module col-xs-2 col-md-2"><canvas class="coverpage"></canvas></div>' + '<div class="playlists-title-module col-xs-8 col-md-8"><p class="playlists-text">' + 
    //         datacopy.playlists[i].name + '</p></div><div class="icon-module"><span class="glyphicon glyphicon-chevron-right"></span></div></div>';
    //         //newLi.textContent = datacopy.playlists[i].name;
    //         var insertId = document.getElementById("searchinsert");
    //         insertId.appendChild(newLi);            
    //     }
    // }
    // for(var i=0; i<datacopy.songs.length;i++){
    //     if(datacopy.songs[i].title.indexOf(filter) > -1 || datacopy.songs[i].artist.indexOf(filter) > -1){
    //         var newLi = document.createElement("li");
    //         newLi.innerHTML = '<div class="playlist-wrap col-xs-12 col-md-12"><div class="coverpage-module col-xs-2 col-md-2"><canvas class="coverpage"></canvas></div>' + '<div class="title-module col-xs-8 col-md-8"><p class="songs-text">' + datacopy.songs[i].title + 
    //         '</p><p class="songs-text" id="album-text">' + datacopy.songs[i].artist +'</p></div>' + 
    //         '<div class="icon-module"><span class="glyphicon glyphicon-plus-sign"></span><span class="glyphicon glyphicon-play"></span></div></div>';
    //         //newLi.textContent = datacopy.playlists[i].name;
    //         var insertId = document.getElementById("searchinsert");
    //         insertId.appendChild(newLi);      
    //     }
    // }
}



// function overlay(songid){
//     addArray = plusIcon[songid].parentNode.previousSibling.childNodes[0].innerHTML;
//     var modalView;
//     console.log(songid);
//     modalView = document.getElementById("overlay");
//     modalView.style.width = "100%";
//     modalView.style.visibility = (modalView.style.visibility === "visible") ? "hidden" : "visible";
//     if(document.getElementById('modal_insert').childNodes.length === 1){
//         for(var i=0; i<datacopy.playlists.length;i++){
//             var newLi = document.createElement("li");
//             newLi.className = "modal_playlist";
//             //newLi.className = 'modal_playlist';
//             newLi.innerHTML = '</br><div className="modal_playlist" data-id="'+ datacopy.playlists[i].id +'" onClick="addtolist('+ datacopy.playlists[i].id +')">' + datacopy.playlists[i].name + '</div></br>';
//             var insertId = document.getElementById("modal_insert");
//             insertId.appendChild(newLi);      
//         }
//     }
// }

// function addtolist(playlistid){
//     document.getElementById("overlay").style.visibility = "hidden";
//     for(i=0;i<datacopy.songs.length; i++){
//       if(datacopy.songs[i] === addArray){
//          if(datacopy.playlists[playlistid].songs.indexOf(datacopy.songs[i].id) === -1){
//             newC = document.createElement("li");
//             newC.className = "playlist_song";
//             newC.innerHTML = '<div class="playlist-wrap col-xs-12 col-md-12"><div class="coverpage-module col-xs-2 col-md-2"><canvas class="coverpage"></canvas></div>' + '<div class="title-module col-xs-8 col-md-8"><p class="songs-text">' + datacopy.songs[i].title + 
//             '</p><p class="songs-text" id="album-text" data-id="' + datacopy.songs[i].id + '">' + datacopy.songs[i].artist + '</p></div>' + 
//             '<div class="icon-module"><span class="glyphicon glyphicon-plus-sign"></span><span class="glyphicon glyphicon-play"></span></div></div>';
//             var inserId = document.getElementById('playlist_insert')
//             insertId.appendChild(newC);
//             datacopy.playlists[playlistid].songs.push(datacopy.songs[i].id);
//          }
//       }
//     }
//     // var saveto = this.textContent;
//     // for(var i=0; i<datacopy.playlists.length;i++){
//     //     if(saveto === datacopy.playlists[i].name && !datacopy.playlists[i].songs.includes(songid))
//     //     {
//     //         datacopy.playlists[i].songs.push(songid);
//     //         console.log(songid);
//     //     }    
//     // }
// }
//modal inplementation
var addArray;
var plus1 = document.getElementsByClassName("add1");
var plus2 = document.getElementsByClassName("add2");
var plus3 = document.getElementsByClassName("add3");
var plus4 = document.getElementsByClassName("add4");
var plus5 = document.getElementsByClassName("add5");

function plusListener1(songIndex){
    plus1[songIndex].addEventListener("click",function(){
        addArray = plus1[songIndex].parentNode.previousSibling.childNodes[0].innerHTML;
        //document.getElementById("overlay").style.width = 100%
        document.getElementById("overlay").style.visibility = "visible";
    });
}
function plusListener2(songIndex){
    plus2[songIndex].addEventListener("click",function(){
        addArray = plus2[songIndex].parentNode.previousSibling.childNodes[0].innerHTML;
        //document.getElementById("overlay").style.width = 100%
        document.getElementById("overlay").style.visibility = "visible";
    });
}

function plusListener3(songIndex){
    plus3[songIndex].addEventListener("click",function(){
        addArray = plus3[songIndex].parentNode.previousSibling.childNodes[0].innerHTML;
        //document.getElementById("overlay").style.width = 100%
        document.getElementById("overlay").style.visibility = "visible";
    });
}

function plusListener4(songIndex){
    plus4[songIndex].addEventListener("click",function(){
        addArray = plus4[songIndex].parentNode.previousSibling.childNodes[0].innerHTML;
        //document.getElementById("overlay").style.width = 100%
        document.getElementById("overlay").style.visibility = "visible";
    });
}
function plusListener5(songIndex){
    plus5[songIndex].addEventListener("click",function(){
        addArray = plus5[songIndex].parentNode.previousSibling.childNodes[0].innerHTML;
        //document.getElementById("overlay").style.width = 100%
        document.getElementById("overlay").style.visibility = "visible";
    });
}
function addtolistListener(playlistIndex){
    document.getElementsByClassName("modal_playlist")[playlistIndex].onclick = function(){
        document.getElementById("overlay").style.visibility = "hidden";
        for(var i=0; i<datacopy.songs.length;i++){
            if(datacopy.songs[i].title === addArray){
                if(!datacopy.playlists[playlistIndex].songs.includes(datacopy.songs[i].id)){
                    var newLi = document.createElement("li");
                    newLi.className = "playlist_song";
                    newLi.innerHTML = '<div class="playlist-wrap col-xs-12 col-md-12"><div class="coverpage-module col-xs-2 col-md-2"><canvas class="coverpage"></canvas></div>' + '<div class="title-module col-xs-8 col-md-8"><p class="songs-text">' + datacopy.songs[i].title + 
                    '</p><p class="songs-text" id="album-text">' + datacopy.songs[i].artist +'</p></div>' + 
                    '<div class="icon-module"><span class="glyphicon glyphicon-plus-sign add5"></span><span class="glyphicon glyphicon-play"></span></div></div>';
                    //newLi.textContent = datacopy.playlists[i].name;
                    var insertId = document.getElementById("playlist_insert");
                    insertId.appendChild(newLi);
                    datacopy.playlists[playlistIndex].songs.push(datacopy.songs[i].id);
                }
            }
        }
        console.log(datacopy.playlists[0].songs);
        console.log(datacopy.playlists[1].songs);
        console.log(datacopy.playlists[2].songs);
    }
}

for(var i=0; i<plus1.length;i++){
    plusListener1(i);
}
for(var i=0; i<plus2.length;i++){
    plusListener2(i);
}
for(var i=0; i<plus3.length;i++){
    plusListener3(i);
}
for(var i=0; i<plus4.length;i++){
    plusListener4(i);
}
for(var i=0; i<plus5.length;i++){
    plusListener5(i);
}

for(var i=0; i<3;i++){
    addtolistListener(i);
}

function closeModal(){
     document.getElementById("overlay").style.visibility = "hidden";
}
