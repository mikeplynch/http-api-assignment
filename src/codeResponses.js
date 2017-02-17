// returns the XML as an object to be delivered in the response
const xmlResponse = (content) => {
  let returnXML = Object.keys(content).reduce((prev, key) => `${prev}<${key}>${content[key]}</${key}>`, '<response>');
  returnXML += '</response>';
  return returnXML;
};

// sends either an XML or JSON response, defaults to JSON
const sendResponse = (request, response, isXML, statusCode, content) => {
  if (isXML) {
    response.writeHead(statusCode, {
      'Content-Type': 'text/xml',
    });
    response.write(xmlResponse(content));
  } else {
    response.writeHead(statusCode, {
      'Content-Type': 'application/json',
    });
    response.write(JSON.stringify(content));
  }
  response.end();
};


// returns a 200 success code
const success = (request, response, isXML) => {
  const content = {
    message: 'This is a successful response.',
  };

  sendResponse(request, response, isXML, 200, content);
};

// returns a 200 if query has valid=true else returns a 400
const badRequest = (request, response, isXML, query) => {
  const content = (query.valid ? {
    message: 'This request had the required parameters.',
  } : {
    message: 'Missing valid query parameter set to true.',
    id: 'badRequest',
  });

  sendResponse(request, response, isXML, query.valid ? 200 : 400, content);
};

// returns a 200 if query has loggedIn=yes else returns 401
const unauthorized = (request, response, isXML, query) => {
  const content = (query.loggedIn === 'yes' ? {
    message: 'This request had the required parameters.',
  } : {
    message: 'Missing loggedIn query parameter set to yes.',
    id: 'unauthorized',
  });

  sendResponse(request, response, isXML, query.valid ? 200 : 401, content);
};

// returns 403 forbidden
const forbidden = (request, response, isXML) => {
  const content = {
    message: 'You do not have access to this content.',
    id: 'forbidden',
  };

  sendResponse(request, response, isXML, 403, content);
};

// returns 500 internal server error
const internal = (request, response, isXML) => {
  const content = {
    message: 'Internal Server Error. Something went wrong.',
    id: 'internalError',
  };

  sendResponse(request, response, isXML, 500, content);
};

// returns 501 not implemented
const notImplemented = (request, response, isXML) => {
  const content = {
    message: 'A get request for this page has not been implemented yet. Check again later for updated content.',
    id: 'notImplemented',
  };

  sendResponse(request, response, isXML, 501, content);
};

// returns 404 not found
const notFound = (request, response, isXML) => {
  const content = {
    message: 'The requested page could not be found.',
    id: 'notFound',
  };

  sendResponse(request, response, isXML, 404, content);
};

module.exports = {
  success,
  badRequest,
  unauthorized,
  forbidden,
  internal,
  notImplemented,
  notFound,
};
