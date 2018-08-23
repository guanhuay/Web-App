var sqlite3 = require('sqlite3').verbose();
var file = "music.db";
var db = new sqlite3.Database(file);
var fs = require('fs');

db.serialize(function () {
  	//create Songs table
  	db.run('CREATE TABLE songs ("id" INTEGER PRIMARY KEY, "album" VARCHAR(255), "title" VARCHAR(255), "artist" VARCHAR(255), "duration" INTEGER)');
    fs.readFile(__dirname + '/songs.json', function(err, data) {
      if(err) throw err;
      var music_data = JSON.parse(data);
      var songs = music_data['songs'];
      //songs.replaceAll("\\\\","");
      // for(var i=0;i<songs.length;i++){
      //    songs[i].title.replace("\\/g","");
      // }
      var query
      for (var i = 0; i < songs.length; i++) {
          var song = songs[i];
          if(song.title.indexOf('"')> -1){
            query = `INSERT INTO songs (id, album, title, artist, duration) VALUES (${song.id}, "${song.album}", "${'One last ""Whoo-hoo!"" for the Pullman'}", "${song.artist}", "${song.duration}")`;
          }
          else{
            query = `INSERT INTO songs (id, album, title, artist, duration) VALUES (${song.id}, "${song.album}", "${song.title}", "${song.artist}", "${song.duration}")`;
          //console.log(query);
          }

          //神code 简直太6啦！
          // query = `INSERT INTO songs (id, album, title, artist, duration) VALUES (${song.id}, "${song.album}", (?), "${song.artist}", "${song.duration}")`;
          // db.run(query, song.title);
          db.run(query);
      }
      //set id of songs begin with 0 instead of 1
      //db.run('UPDATE songs SET id=id-1');
        //db.close()
        // db.each('SELECT * FROM songs', function (err, row) {
        //    console.log(row)
        // })
  	});
      //db.run('UPDATE sqlite_sequence SET seq=0 WHERE name = "songs"');
      // db.each('SELECT * FROM songs', function (err, row) {
      //   console.log(row)
      // })
	  //create playlist table
      db.run('CREATE TABLE playlist ("id" INTEGER PRIMARY KEY, "name" VARCHAR(255))');
      fs.readFile(__dirname + '/playlists.json', function(err,data){
        if(err){
          return console.log(err);
        }
      	var playlist_data = JSON.parse(data);
      	var playlists = playlist_data['playlists'];
      	for(var i=0; i<playlists.length;i++){
      		var playlist = playlists[i];
      		var query = `INSERT INTO playlist (id,name) VALUES (${playlist.id},"${playlist.name}")`;
      		//console.log(query);
      		db.run(query);
      	}
        //db.run('UPDATE playlist SET id=id-1');
        //db.close()
        // db.each('SELECT * FROM playlist', function (err, row) {
        //    console.log(row)
        // })
      });
      //db.run('UPDATE sqlite_sequence SET seq=0 WHERE name = "playlist"');
      // var length = `SELECT id FROM songs WHERE id=100`;
      // console.log(length);
      // var temp = db.run(length);
      //db.close()
      //create songs_playlist table
      db.run('CREATE TABLE songs_playlists ("id" INTEGER PRIMARY KEY, "playlist_id" INTEGER, "song_id" INTEGER, FOREIGN KEY(playlist_id) REFERENCES playlist(id), FOREIGN KEY(song_id) REFERENCES songs(id))');
      fs.readFile(__dirname + '/playlists.json', function(err,data){
        if(err){
          return console.log(err);
        }
      	var playlist_data = JSON.parse(data);
      	var playlists = playlist_data['playlists'];
      	for(var i=0; i< playlists.length;i++){
          var playlist = playlists[i];
          for(var j=0; j<playlist.songs.length;j++){
              var playlist_id = playlist.songs[j];
              var query = `INSERT INTO songs_playlists (id,playlist_id,song_id) VALUES (null,"${playlist.id}","${playlist_id}")`;
              //console.log(query);
              db.run(query);
      	   }
         }
         db.run('UPDATE songs_playlists SET id=id-1');
         //db.close()
      });
  });
  //db.close();
  // for(var i=0; i< MUSIC_JSON.playlists.length;i++){
  //   var playlist = MUSIC_JSON.playlists[i];
  //   //console.log(playlist);
  //   for(var j=0;j<playlist.songs.length;j++){
  //     var playlist_id = playlist.song[j];
  //     console.log(playlist_id);
  //   }
  // }

  // db.close();
