// Example express application adding the parse-server module to expose Parse
// compatible API routes.

const express = require('express');
const ParseServer = require('parse-server').ParseServer;
const path = require('path');
const args = process.argv || [];
const test = args.some(arg => arg.includes('jasmine'));



const databaseUri = process.env.DATABASE_URI || process.env.MONGODB_URI;
// const databaseUri = 'mongodb+srv://iddonaldson:paddlin1@frweed-g8xtt.mongodb.net/every-strain?retryWrites=true&w=majority';

if (!databaseUri) {
  console.log('DATABASE_URI not specified, falling back to localhost.');
}
const config = {
  databaseURI: databaseUri || 'mongodb://localhost:27017/dev',
  cloud: process.env.CLOUD_CODE_MAIN || __dirname + '/cloud/main.js',
  appId: process.env.APP_ID || 'bbNs1kCdo2wnsS6UTuHVxHqoBlqyTqlMOmshu1e7',
  masterKey: process.env.MASTER_KEY || 'qgNY0LcDzFEKmnTr64M97KeSsp4AqGdxbcTyU1jN', //Add your master key here. Keep it secret!
  serverURL: process.env.SERVER_URL || 'http://localhost:1337/server', // Don't forget to change to https if needed
  liveQuery: {
    classNames: ['Posts', 'Comments'], // List of classes to support for query subscriptions
  },
};
// Client-keys like the javascript key or the .NET key are not necessary with parse-server
// If you wish you require them, you can set them as options in the initialization above:
// javascriptKey, restAPIKey, dotNetKey, clientKey

/*---------------------------------------------------------------------------
//                              Parse Dashboard
/---------------------------------------------------------------------------*/
const ParseDashboard = require('parse-dashboard');
var options = { allowInsecureHTTP: false };
var dashboard = new ParseDashboard({
  'apps': [
    {
      'serverURL': 'http://localhost:1337/server',
      'appId': 'bbNs1kCdo2wnsS6UTuHVxHqoBlqyTqlMOmshu1e7',
      'masterKey': 'qgNY0LcDzFEKmnTr64M97KeSsp4AqGdxbcTyU1jN',
      'readOnlyMasterKey': 'cY5b03iRY2rFcmAwIX2JoBxiMrVnznXW',
      'appName': 'Server: DNG Jewelery',
      'production': false,
      "supportedPushLocales": ["en"],
      'primaryBackgroundColor': '#382039',
      'secondaryBackgroundColor': '#5a3d5c'
    }
  ],
  'users': [
    {
      'user': 'iddonaldson',
      'pass': '$2y$12$o5EmjwMiCxevh35trVeUFey2aMDiCu.zvtG8vhHrV50UBMk27Ii32'
    },
    {
      'user': 'shellynoreen',
      'pass': '$2y$12$hVo6W4hV5DuR8Uk5tGEWrOlS1oqCeod6zCm1T8XdYXsZwdUnP4mT.'
    },
    {
      'user': 'restricted1',
      'pass': '$2y$12$NHFCfuBAMFPiApZiTQIRbeLMD6c3IvKd7.6ev76wrtMVSJEVhr582',
      'readOnly': true,
      'apps': [{'appId': 'com.frweedllc.frweed'}]
    }
  ],
  "useEncryptedPasswords": true,
  "iconsFolder": "icons",
  "trustProxy": 1
}, options);











const app = express();


// app.use(cors());


/*
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  
  next();
});
*/

// NEW - Add CORS headers - see https://enable-cors.org/server_expressjs.html
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:4200");
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});



//-----------------------------------------------------------------------
//
//
//-----------------------------------------------------------------------




//-----------------------------------------------------------------------
//
//
//-----------------------------------------------------------------------

const axios = require("axios");
var cors = require("cors");

app.use(
  cors({
    origin: "http://localhost:4200", // restrict calls to those this address
    methods: "GET" // only allow GET requests
  })
);

const CLIENT_ID = "331f11ff9e22015e7c8e";
const CLIENT_SECRET = "3aff7ac01579b82209d64db46f45082fd29a5243";
const GITHUB_URL = "https://github.com/login/oauth/access_token";

/*
app.get("/oauth/redirect", (req, res) => {
  axios({
    method: "POST",
    url: `${GITHUB_URL}?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&code=${req.query.code}`,
    headers: {
      Accept: "application/json",
    },
  }).then((response) => {
    res.redirect(
      `http://localhost:3000?access_token=${response.data.access_token}`
    );
  });
});
*/

// SUPER IMPORTANT!!!! Github token!!!!
// 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

// make the Parse Dashboard available at /dashboard
app.use('/dashboard', dashboard);

// Serve static assets from the /public folder
app.use('/public', express.static(path.join(__dirname, '/public')));

// Serve the Parse API on the /parse URL prefix
const mountPath = process.env.PARSE_MOUNT || '/server';
if (!test) {
  const api = new ParseServer(config);
  app.use(mountPath, api);
}


const _apiAddress = "http://localhost:4200/";


var auth_token;

app.get('/api/skews', function (req, res) {
  axios.get('https://frweed-llc.commercelayer.io/api/skus', {
      headers: {
          'Accept': 'application/vnd.api+json',
          'Authorization': req.session.token
      }
  }).then((results) => {
    res.status(200).send(auth_token);
  })
  
  
  
 
});





app.get('/session/customer/status', function (req, res) {
  res.status(200).send('I dream of being a website.  Please star the parse-server repo on GitHub!');
})


app.post('/oauth/token', function (req, res) {
  let state=req.headers['x-xsrf-token'];
  axios({
  url:'https://github.com/login/oauth/access_token?client_id='+CLIENT_ID+'&client_secret='+CLIENT_SECRET+'&redirect_uri='+GITHUB_URL+'&state='+state,
  method:'POST',
  headers:{'Accept':'application/json'}
  
}).then(function(resp) {
  if (resp.data.access_token) {
    req.session.token=resp.data.access_token;
    auth_token = req.session.token;

    const organization = 'wcxlSpxupqOSIZH8tbNtw3jOKpuDuDhjHB6vbppnLV0'
    const accessToken = resp.data.access_token;
  
    const cl = commercelayer({ organization, accessToken })
    
    cl.skus.list().then(console.log);

  }
  res.send(resp.data);

}).catch(function(err){
  res.send(err);
  
})})

/*
app.get('/getUserDetails',function(req,res){
  if (req.session.token) {
    axios({
      url:'https://api.github.com/user',
      method:'GET',
      headers:{'Authorization':'token'+" "+req.session.token}
    
    }).then(function(resp){
      res.cookie('login',resp.data.login,{httpOnly:true});
      res.send(resp.data);
    
    }).catch(function(err){
      res.send(err);
    })
  } else{
    res.status(401).send();
  }
  })
  */


app.post('/oauth/token1',function(req,res) {
  let state=req.headers["x-xsrf-token"];
  mod.axios({
    url:'https://github.com/login/oauth/access_token?client_id='+CLIENT_ID+'&client_secret='+CLIENT_SECRET+'&redirect_uri='+GITHUB_URL+'&state='+state,
    method:'POST',
    headers:{
      'Accept':'application/json',
      'Access-Control-Allow-Origin': 'http://localhost:4200',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT'
  }
  }).then(function(resp) {
    if(resp.data.access_token){
      req.session.token=resp.data.access_token;
    }
    res.send(resp.data);
  
  }).catch(function(err) {
  res.send(err);
  });
});





app.post('/payment', function(req,res) {
  post('/payment', createPayment);
  // we need to redirect the sitemap request directly to the backend
  const options = {
    url: _apiAddress + req.url,
    headers: {
      'Accept': 'application/xml'
    }
  };
  request(options).pipe(res);
});


// Parse Server plays nicely with the rest of your web routes
app.get('/', function (req, res) {
  res.status(200).send('I dream of being a website.  Please star the parse-server repo on GitHub!');
});

// There will be a test page available on the /test path of your server url
// Remove this before launching your app
app.get('/test', function (req, res) {
  res.sendFile(path.join(__dirname, '/public/test.html'));
});

const port = process.env.PORT || 1337;
if (!test) {
  const httpServer = require('http').createServer(app);
  httpServer.listen(port, function () {
    console.log('parse-server-example running on port ' + port + '.');
  });
  // This will enable the Live Query real-time server
  ParseServer.createLiveQueryServer(httpServer);
}

module.exports = {
  app,
  config,
};
