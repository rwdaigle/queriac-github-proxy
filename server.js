var restify = require('restify'),
  Repository = require("./lib/repository");

var port = Number(process.env.PORT || process.argv[2] || 8080)

var server = restify.createServer();

server.use(restify.CORS());
server.use(restify.fullResponse());

server.get('/v1/:user/:repo', function(req, res, next) {
  var path = req.params.user + "/" + req.params.repo;
  var repository = new Repository(path);
  repository.files(function(err, contents) {
    output = err ? { "error": err } : contents
    res.send(output);
    next();
  });
});

server.listen(port, function() {
  console.log("%s listening at %s", server.name, server.url);
});
