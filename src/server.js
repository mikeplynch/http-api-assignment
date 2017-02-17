const http = require('http');
const url = require('url');
const htmlHandler = require('./htmlResponses.js');
const responseHandler = require('./codeResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const responses = { // struct of all possible urls and corresponding functions
  '/': htmlHandler.getIndex,
  '/style.css': htmlHandler.getCSS,
  '/success': responseHandler.success,
  '/badRequest': responseHandler.badRequest,
  '/unauthorized': responseHandler.unauthorized,
  '/forbidden': responseHandler.forbidden,
  '/internal': responseHandler.internal,
  '/notImplemented': responseHandler.notImplemented,
};

const onRequest = (request, response) => {
  const type = request.headers.accept.split(',');
  console.dir(type);

  const isXML = type.length > 0 && type[0] === 'text/xml';
  const requestUrl = url.parse(request.url, true);
  const path = responses[requestUrl.pathname];

  if (path) {
    path(request, response, isXML, requestUrl.query);
  } else {
    responseHandler.notFound(request, response, isXML, requestUrl.query);
  }
};

http.createServer(onRequest).listen(port);
console.log(`Listening on 127.0.0.1:${port}`);
