var fs = require('fs');
var path = require('path');
var http = require('http');
var _ = require('underscore');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

var paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

exports.paths = paths;

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

// read from sites.txt

var readListOfUrls = function(cb) {
  var allData = [];

  fs.readFile(paths.list, 'utf8', function(err, data) {
    var i = 0;
    var entry = '';

    while (i < data.length) {
      if (data[i] === '\n') {
        allData.push(entry);
        entry = '';
      } else {
        entry += data[i];
      }

      i += 1;
    }
    if (entry !== '') {
      allData.push(entry);
    }

    cb(allData);
  });
};

exports.readListOfUrls = readListOfUrls;

// return boolean, is item in list?
var isUrlInList = function(item, cb) {
  readListOfUrls(function(allData) {
    var result = allData.indexOf(item) > -1;
    return cb(result);
  });
};

exports.isUrlInList = isUrlInList;

var addUrlToList = function(item, cb) {
  fs.writeFile(paths.list, item, { flag: 'a' }, cb);
};

exports.addUrlToList = addUrlToList;

var isUrlArchived = function(item, cb) {
  fs.readdir(paths.archivedSites, function(err, files) {
    var exists = files.indexOf(item) > -1;
    return cb(exists);
  });
};

exports.isUrlArchived = isUrlArchived;

exports.downloadUrls = function(array) {
  // add array to list?
  var processDownloads = function () {
    _.each(array, function(item) {
      isUrlInList(item, function(exists) {
        if (!exists) {
          addUrlToList(item + '\n', function(err) {
            if (err) {
              throw err;
            }

            readListOfUrls(function(allData) {
              _.each(allData, downloadUnlessArchived);
            });
          });
        }
      });
    });

    // TODO, does this belong here? potential optimization problem...
    // readListOfUrls(function(allData) {
    //   console.log(allData);
    //   _.each(allData, downloadUnlessArchived);
    // });
  };

  var downloadUnlessArchived = function(item) {
    isUrlArchived(item, function(itemExists) {
      if (!itemExists) { download(item); }
    });
  };

  var download = function(item) {
    // TODO: pass a fully-qualified URL to `http.get`
    var pathToItem = 'http://' + item;
    http.get(pathToItem, function(result) {
      var body = '';

      result.on('data', function(data) {
        body += data.toString();
      });

      result.on('end', function() {
        var outputFilePath = path.join(paths.archivedSites, item);
        fs.writeFile(outputFilePath, body, function(err) {
          if (err) { throw err; }
        });
      });
    });
  };

  processDownloads();
};