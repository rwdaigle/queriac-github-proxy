var request = require('request'),
  fs = require('fs'),
  os = require("os"),
  unzip = require("unzip"),
  mkdirp = require('mkdirp'),
  fstream = require("fstream");

var version = JSON.parse(fs.readFileSync('package.json', 'utf8')).version;

var Repository = module.exports = function Repository(path) {
  this.path = path;
}

Repository.prototype.files = function(callback) {
  var repo = this;
  repo.download(function(err, dir) {
    if(err) {
      callback(err);
    } else {
      repo.expand(function(err, dir) {
        if(err) {
          callback(err);
        } else {
          repo.collectFiles(callback);
        }
      });
    }
  })
};

Repository.prototype.downloadUrl = function() {
  return "https://github.com/" + this.path + "/archive/master.zip";
};

Repository.prototype.downloadDir = function() {
  return require("path").normalize(os.tmpdir() + "/" + this.path);
};

Repository.prototype.downloadFile = function() {
  return this.downloadDir() + "/download.zip";
};

Repository.prototype.contentsDir = function() {
  var contentDir = this.path.substring(this.path.indexOf("/"));
  return this.downloadDir() + "/" + contentDir + "-master";
};

Repository.prototype.collectFiles = function(callback) {
  var repo = this;
  var contents = {};
  fs.readdir(repo.contentsDir(), function(err, files) {
    if(err) {
      callback(err);
    } else {
      files.map(function(file) {
        if(file.substr(-3) === ".js") {
          fileContents = fs.readFileSync(repo.contentsDir() + "/" + file, { "encoding": "utf-8" });
          contents[file] = fileContents;
        }
      });
      callback(null, contents);
    }
  });
};

Repository.prototype.download = function(callback) {

  var repo = this;
  var url = repo.downloadUrl(),
    dir = repo.downloadDir(),
    file = repo.downloadFile();

  mkdirp(dir, function(err) {
    if(err) {
      callback(err);
    } else {
      request(url)
        .pipe(fs.createWriteStream(file))
        // .pipe(unzip.Parse())
        // .pipe(tar.extract(loc))
        .on("finish", function() { callback(null, dir) })
        .on("error", callback);
    }
  });
};

Repository.prototype.expand = function(callback) {

  var rs = fs.createReadStream(this.downloadFile()),
    dir = this.downloadDir(),
    ws = fstream.Writer(dir);

  rs.pipe(unzip.Parse())
    .pipe(ws)
    .on("close", function() { callback(null, dir) })
    .on("error", callback);
};
