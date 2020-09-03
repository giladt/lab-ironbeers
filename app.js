const express = require('express');

const hbs = require('hbs');
const path = require('path');
const PunkAPIWrapper = require('punkapi-javascript-wrapper');
const { handlebars } = require('hbs');

const app = express();
const punkAPI = new PunkAPIWrapper();

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

// Register the location for handlebars partials here:

hbs.registerPartials(__dirname + "/views/partials");

// Add the route handlers here:

app.get('/', (req, res) => {
  page = {
    home:true,
    beer:false,
    rand:false
  };
  res.render('index', {page});
});

app.get('/beers/:beer?', (req, res) => {

  const beer_id = req.params.beer;
  page = {
    home:false,
    beer:true,
    rand:false
  };

  const beers_req = (beer_id) ? punkAPI.getBeer(beer_id) : punkAPI.getBeers();
  beers_req
    .then(beersFromApi => res.render('beers', {beersFromApi, page}))
    .catch(error => console.log(error));
});

app.get('/random-beer', (req, res) => {
  page = {
    home:false,
    beer:false,
    rand:true
  };
  punkAPI
    .getRandom()
    .then(randomBeerFromApi => {
      const beer = randomBeerFromApi[0];
      res.render('random-beer', {beer, page});
    })
    .catch(error => console.log(error));
});

app.listen(3000, () => console.log('🏃‍ on port 3000'));
