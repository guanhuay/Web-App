// Import the http library
var http = require('http');

//load in filesystem module
var fs = require('fs');
var fileName = './playlists.json';
var file = require(fileName);
var query = require("querystring");
// function library(){
//     document.getElementById("defaultOpen").click();
// }
// Create a server and provide it a callback to be executed for every HTTP request
// coming into localhost:3000.
var server = http.createServer(function(req, res){
    //req.Cache-Control = 30000;
    //console.log(req.url);
    if (req.url === '/'){
    	res.writeHead(301,{'Content-Type' : 'text/plain', 'Location':'/playlists', cache: 1800});
        res.end();
    }
    else if (req.url === '/playlists' || req.url === '/library' || req.url === '/search') {
        res.writeHead(200, {'Content-Type':'text/html', cache: 1800});
        fs.createReadStream(__dirname+ '/playlist.html', 'utf8').pipe(res);
    }
    else if(req.url === '/style.css') {
        res.writeHead(200, {'Content-Type':'text/css', cache: 1800});
        fs.createReadStream(__dirname+ '/playlist.css','utf8').pipe(res);
    }
    else if(req.url === '/music-app.js'){
        res.writeHead(200,{'Content-Type':'text/js', cache: 1800});
        fs.createReadStream(__dirname+'/music-app.js','utf8').pipe(res);  
    }
    else if(req.url === '/api/songs' && req.method === 'GET'){
        res.writeHead(200,{'Content-Type':'text/json'});
        fs.createReadStream(__dirname+'/songs.json').pipe(res);
    }
    //&& req.method === 'GET'
    else if(req.url === '/api/playlists' && req.method === 'GET' ){
        res.writeHead(200,{'Content-Type':'text/json'});
        fs.createReadStream(__dirname+'/playlists.json').pipe(res);
    }
    else if(req.url === '/api/playlists' && req.method === 'POST'){
        //var postdata = "";
        //fs.writeFile('/temp.json',temp);
        var body = '';
        req.on('data', function( data ){
            body += data;
            fs.writeFile('playlists.json', body);
        });
        req.on('error', function(err){
            res.writeHead(400);
            res.end('400, Bad Request!');
        })
        req.on('end',function(){
            console.log(body);
            res.writeHead(200,{"Content-Type": "text/json", "Access-Control-Allow-Origin":"*"});
            res.end(body);
        });
        //console.log(req.body.name);
        // res.json(req.body.id);
        // req.addListener("data",function(postchunk){
        //     postdata += postchunk;
        // })
        
        // //POST结束输出结果
        // req.addListener("end",function(){
        //     var params = query.parse(postdata);
        //     params['fruit'] = compute(params);
        //     res.write(JSON.stringify(params));
        //     res.end();
        // })
        // var body = '';
        // req.on('data', function(chunk) {
        //     body += chunk;
        // });
        // req.on('end', function() {
        //     console.log(body);
        //     res.end('Successfully added to DB!');
        // });
    }
    else{
        res.writeHead(404);
        res.end("404 Page Not Found!");
    }      
});

// Start the server on port 3000
server.listen(3000, function(){
    console.log('Amazing music app server listening on port 3000!')
});