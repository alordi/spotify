/**
 * This is an example of a basic node.js script that performs
 * the Authorization Code oAuth2 flow to authenticate against
 * the Spotify Accounts.
 *
 * For more information, read
 * https://developer.spotify.com/web-api/authorization-guide/#authorization_code_flow
 */

var express = require('express'); // Express web server framework
var request = require('request'); // "Request" library
var cors = require('cors');
var querystring = require('querystring');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
var https = require('https')
var fs = require('fs')

var client_id = process.env.ID1; // Your client id
var client_secret = process.env.ID2; // Your secret
var redirect_uri = "https://" + process.env.DOMAIN + "/callback"; // Your redirect uri
//var redirect_uri = 'http://localhost:8888/callback';
var cert_dir = "/certs";  
const spotify_url = 'https://api.spotify.com/v1/me'; //spotify url

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
var generateRandomString = function(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

var stateKey = 'spotify_auth_state';

var app = express();

app.use(express.static(__dirname + '/client/dist'))
   .use(cors())
   .use(cookieSession({
    name: 'session',
    keys: ['key1'],
    // Cookie Options
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }))
   .use(cookieParser());

app.get("/", (req, res, next) => {
  res.sendFile("index.html", { root: '/client/dist'})
});

app.get('/login', function(req, res) {

  var state = generateRandomString(16);
  res.cookie(stateKey, state);

  // your application requests authorization
  var scope = 'user-read-private user-read-email user-top-read';
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    }));
});

app.get('/me', function(req, res) {
  var options = {
    url: 'https://api.spotify.com/v1/me',
    headers: { 'Authorization': 'Bearer ' + req.session.access_token },
    json: true
  };

  // use the access token to access the Spotify Web API
  request.get(options, function(error, response, body) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(body));
  });

});

app.get('/songs', function(req, res) {
  var options = {
    url: spotify_url + '/top/tracks?limit=' + req.query.limit + '&time_range=' + req.query.time,
    headers: { 'Authorization': 'Bearer ' + req.session.access_token },
    json: true
  };

  // use the access token to access the Spotify Web API
  request.get(options, function(error, response, body) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(body));
  });

});

app.get('/artists', function(req, res) {
  var options = {
    url: spotify_url + '/top/artists?limit=' + req.query.limit + '&time_range=' + req.query.time,
    headers: { 'Authorization': 'Bearer ' + req.session.access_token },
    json: true
  };

  // use the access token to access the Spotify Web API
  request.get(options, function(error, response, body) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(body));
  });

});

app.get('/features', function(req, res) {
  var options = {
    url: 'https://api.spotify.com/v1/audio-features/?ids=' + req.query.songIds.join(),
    headers: { 'Authorization': 'Bearer ' + req.session.access_token },
    json: true
  };

  // use the access token to access the Spotify Web API
  request.get(options, function(error, response, body) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(body));
  });

});

app.get('/callback', function(req, res) {

  // your application requests refresh and access tokens
  // after checking the state parameter

  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
  } else {
    res.clearCookie(stateKey);
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
      },
      json: true
    };

    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {

        var access_token = body.access_token,
            refresh_token = body.refresh_token;

        req.session.access_token = access_token;
        req.session.logged_in = true;



        var options = {
          url: 'https://api.spotify.com/v1/me',
          headers: { 'Authorization': 'Bearer ' + access_token },
          json: true
        };

        // use the access token to access the Spotify Web API
        request.get(options, function(error, response, body) {
          console.log(body);
        });

        // we can also pass the token to the browser to make requests from there
        res.redirect('/?' +
          querystring.stringify({
            status: "ok"
          }));
      } else {
        res.redirect('/#' +
          querystring.stringify({
            error: 'invalid_token'
          }));
      }
    });
  }
});

app.get('/refresh_token', function(req, res) {

  // requesting access token from refresh token
  var refresh_token = req.query.refresh_token;
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    json: true
  };

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      var access_token = body.access_token;
      res.send({
        'access_token': access_token
      });
    }
  });
});

https.createServer({
  // key: fs.readFileSync(cert_dir + '/privkey.pem', 'utf8'),
  // cert: fs.readFileSync(cert_dir + '/cert.pem', 'utf8'),
  // ca: fs.readFileSync(cert_dir + '/chain.pem', 'utf8')
  }, app).listen(8080, function () {
  console.log('Listening on 8080');
});


