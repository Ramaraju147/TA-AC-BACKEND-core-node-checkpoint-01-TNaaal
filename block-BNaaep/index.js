const http = require('http');
const url = require('url');
const fs = require('fs');
const qs = require('querystring')

const server = http.createServer(handleRequests);

function handleRequests(req,res){
    let parsedUrl = url.parse(req.url,true)
    console.log(parsedUrl)
    if(req.method === 'GET' && parsedUrl.pathname === '/'){
        res.setHeader('Content-type','text/html');
        fs.readFile('assets/html/index.html',(err,content) => {
            res.end(content);
        })

    }else if(req.method === 'GET' && parsedUrl.pathname === '/about'){
        res.setHeader('Content-type','text/html');
        fs.readFile('assets/html/about.html',(err,content) => {
            res.end(content);
        })
    }else if(req.method === 'GET' && parsedUrl.pathname === '/contact'){
        res.setHeader('Content-type','text/html');
        fs.readFile('assets/html/contact.html',(err,content) => {
            res.end(content);
        })
    }else if(req.method === 'POST' && parsedUrl.pathname === '/form'){
        let store = '';
        req.on('data', (chunk) => {
            store += chunk;
        })
        req.on('end',() => {
            let parsedStore = qs.parse(store)
            let username = parsedStore.username
            fs.writeFile('contacts/'+username+'.json',JSON.stringify(parsedStore),() => {
               res.end("File created Successfully")
            })
        })
    }else if(req.method === 'GET' && req.url === '/users'){
        function readFiles(dirname, onFileContent, onError) {
            fs.readdir(dirname, function(err, filenames) {
              if (err) {
                onError(err);
                return;
              }
              filenames.forEach(function(filename) {
                fs.readFile(dirname + filename, 'utf-8', function(err, content) {
                  if (err) {
                    onError(err);
                    return;
                  }
                  onFileContent(filename, content);
                });
              });
            });
          }
          var data = {};
          readFiles('contacts/', function(filename, content) {
            data[filename] = content;
            res.write(data)
          }, function(err) {
            throw err;
          });
          res.end()
        // console.log(arr)
        // res.setHeader('Content-type','application/json')
        // res.end(JSON.stringify(arr))
    }else if(req.method === 'GET' && parsedUrl.pathname === '/users'){
        let username = parsedUrl.query.username
        fs.readFile('contacts/'+username+'.json',(err,content) => {
            res.setHeader('Content-type','application/json')
            res.end(content);
        })

    }

    if(parsedUrl.pathname.split(".").pop() == 'css'){
        res.setHeader("Content-type",'text/css')
        fs.readFile('assets/'+parsedUrl.pathname, (err,content) => {
            res.end(content);
        })
    }
    if(parsedUrl.pathname.split(".").pop() == 'jpeg'){
        res.setHeader("Content-type",'image/jpeg')
        fs.readFile('assets/'+parsedUrl.pathname, (err,content) => {
            res.end(content);
        })
    }


}

server.listen(5000,() => {
    console.log('Server is running on port 5000')
})