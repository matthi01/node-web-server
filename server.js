const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

const port = process.env.port || 3000;

let app = express();

hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear() 
});
hbs.registerHelper('screamIt', (text) => {
  return text.toUpperCase();
});

hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs')

// 'next()' indicates when the middleware is done
// add middleware to log any requests that are made, with a timestamp + write these to a log file
app.use((req, res, next) => {
  let now = new Date().toString();
  let log = `${now}: ${req.method} ${req.url}`;
  console.log(log);
  fs.appendFile('server.log', log + '\n', (err) => console.log('Unable to append to server.log'));
  next();
});

// middleware to display maintenance page - not calling next() here
// app.use((req, res, next) => {
//   res.render('maintenance.hbs');
// });

// use .use to register express middleware
app.use(express.static(__dirname + '/public'));

//handler for http get request (takes url and function to run)
app.get('/', (req, res) => {
  res.render('home.hbs', {
    pageTitle: 'Home Page',
    welcomeMessage: 'This is some dynamic welcome message'
  });
});

app.get('/about', (req, res) => {
  res.render('about.hbs', {
    pageTitle: 'About Page'
  });
});

app.get('/bad', (req, res) => {
  res.send({errorMessage: '<h1>something went wrong</h1>'});
});

app.listen(port, () => console.log(`Server is up on port ${port}`));
