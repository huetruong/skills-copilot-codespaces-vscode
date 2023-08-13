// Create web server application
// Comments are stored in a JSON file
// This file is part of the NodeJS course at https://www.linkedin.com/learning/node-js-essential-training-3

// Import modules
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const qs = require('querystring');

// Server port
const port = 3000;

// Array of comments
let comments = [];

// Create server
const server = http.createServer((req, res) => {

  // Get URL
  const urlObj = url.parse(req.url, true);
  const urlPath = urlObj.pathname;
  const urlQuery = urlObj.query;

  // Check URL
  if (urlPath === '/') {
    // Home page
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write('<h1>Welcome to the JSON comment server</h1>');
    res.end();
  } else if (urlPath === '/comments') {
    // Comments page
    if (req.method === 'GET') {
      // GET request
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.write(JSON.stringify(comments));
      res.end();
    } else if (req.method === 'POST') {
      // POST request
      let data = '';
      req.on('data', chunk => {
        data += chunk;
      });
      req.on('end', () => {
        const comment = qs.parse(data);
        comments.push(comment);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify(comments));
        res.end();
      });
    }
  } else if (urlPath === '/form') {
    // Form page
    const formPath = path.join(__dirname, 'public', 'form.html');
    fs.readFile(formPath, 'utf8', (err, data) => {
      if (err) throw err;
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.write(data);
      res.end();
    });
  } else {
    // Not found
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.write('<h1>404 Not Found</h1>');
    res.end();
  }

});

// Start server
server.listen(port, () => {
  console.log(`
