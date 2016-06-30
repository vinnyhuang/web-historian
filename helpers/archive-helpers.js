var fs = require('fs');
var path = require('path');
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
exports.readListOfUrls = function(cb) {
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
    if (data.length !== 0) {
      allData.push(entry);
    }

    cb(allData);
  });
};

exports.isUrlInList = function() {
};

exports.addUrlToList = function() {
};

exports.isUrlArchived = function() {
  // look at 'sites/' directory
};

exports.downloadUrls = function() {
  // have the worker compare 'sites/' contents to the sites.txt file
  // if present in sites, then do not download
  // if not present in sites, then worker downloads
};
