function ClickListener(indexSong) {
	plusIconArr[indexSong].addEventListener("click",function(){
		songName = plusIconArr[indexSong].parentNode.previousSibling.childNodes[0].innerHTML;
		document.getElementById("modal").style.display = "block";

	});
}
 for (var i=0; i<plusIconArr.length; i++){
	ClickListener(i);
}

function listenPlaylistEvent(playlistIndex) {
document.getElementsByClassName('modal-row')[playlistIndex].onclick = function(){
	rowNum = playlistIndex+2;
	document.getElementById("modal").style.display = "none";
	for (var j=0; j<aSongs.length; j++){
			if (aSongs[j].title === songName){	
				//this works --need to get value of which playlist and use related row class index (2,3,4)->(playlist1,2,3) 
				//click 1st -> getElementsByClassName('row')[2] and aPlaylist[0].songs.
				//console.log(rowindex);
				if (aPlaylist[playlistIndex].songs.indexOf(aSongs[j].id) === -1){
					document.getElementsByClassName('row')[rowNum].appendChild(Createdsong(aSongs[j].title, aSongs[j].artist));
					aPlaylist[playlistIndex].songs.push(aSongs[j].id);
				}
			}
			// console.log(aPlaylist[0].songs);
		};
		console.log(aPlaylist[0].songs);
		console.log(aPlaylist[1].songs);
		console.log(aPlaylist[2].songs);
}
}
for (var i=0;i<3;i++){
	listenPlaylistEvent(i);
}