const http = require('https');

const options = {
  hostname: 'opentdb.com',
  path: '/api.php?amount=3',
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  },
};

const getPosts = () => {
  let data = '';

  const request = http.request(options, (response) => {
    response.setEncoding('utf8');
    response.on('data', (chunk) => {
      data += chunk;
    });

    response.on('end', () => {
      console.log(data);
    });
  });

  request.on('error', (error) => {
    console.error(error);
  });

  request.end();
};

getPosts();