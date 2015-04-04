var Repository = require("../lib/repository"),
  assert = require("assert"),
  os = require("os")
  fs = require('fs');

describe('Repository', function() {

  var path = "zeke/queriac-commands",
    repo = new Repository(path);

  it('should know its tarball url', function() {
    assert.equal(repo.downloadUrl(), "https://github.com/" + path + "/archive/master.zip");
  });

  it("should download the repo to a temp dir", function(done) {
    repo.download(function(err, dir) {
      assert(!err, err);
      assert.equal(dir, os.tmpdir() + path);
      fs.readdir(dir, function(err, files) {
        assert(!err, err);
        assert(files.length > 0, "Repository was not downloaded to " + dir)
        done();
      });
    });
  });

  it("should expand the repo", function(done) {
    repo.download(function(err, dir) {
      assert(!err, err);
      repo.expand(function(err, dir) {
        assert(!err, err);
        fs.readdir(dir, function(err, files) {
          assert(files.length > 1, "Repository was not unpacked to " + dir)
          done();
        });
      });
    });
  });

  it("should get the repo contents", function(done) {
    repo.files(function(err, contents) {
      assert(!err, err);
      var files = fs.readdirSync("test/fixtures/files");
      files.forEach(function(file) {
        var fileContents = contents[file];
        assert(fileContents, file + " was not included");
        assert.equal(fs.readFileSync("test/fixtures/files/" + file), fileContents, file + " contents were not returned");
      });
      done();
    });
  });

});
