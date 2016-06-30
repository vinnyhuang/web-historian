var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');
var httpHelpers = require ('./request-handler.js');
// require more modules/folders here!


exports.handleRequest = function (req, res) {
  var method = req.method;

  if (method === 'GET') {
    return handleGet(req, res);
  } else if (method === 'POST') {
    return handlePost(req, res);
  }

  res.end('<input');
  // res.end(archive.paths.list);
};


var handleGet = function(req, res) {
  var requestedUrl = req.url;
  //console.log(requestedUrl);

  var headers = Object.assign({}, httpHelpers.headers);

  if (requestedUrl === '/') {
    // TODO: send index.html page
    res.end('<input');
  } else {
    var targetPath = archive.paths.archivedSites + requestedUrl;
    // consult archive for target
    fs.readFile(targetPath, 'utf8', function(err, data) {
      if (err) {
        headers['Content-type'] = 'text/plain';
        res.writeHead(404, headers);
        res.end('File path not found');
        return;
      }
      
      res.writeHead(200, headers);
      res.end(data);
      return;
      // var stream = fs.createReadStream(data);

      // stream.on('data', function(chunk) {
      //   // console.log(typeof chunk);
      //   body += chunk;
      // });
      // stream.on('end', function() {
        // console.log(body.length);
        // console.log(Buffer.isBuffer(data));
      // });
    });
    // read file contents from archive
    // when finished, send a response
  }
};

var handlePost = function(req, res) {

};