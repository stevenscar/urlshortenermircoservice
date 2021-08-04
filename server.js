require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dns  = require('dns'); 
const app = express();
app.use(bodyParser());

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

var shortUrlList = {};
var i = 0;

app.post('/api/shorturl', (req, res) => {    
  const originalURL = req.body.url;  
  const httpRegex = /^(http|https)(:\/\/)/;
  const invalidURL = (res) => {
    res.json({ error: 'invalid url' });
  }

  if(!httpRegex.test(req.body.url)) {  
    invalidURL(res)
  } 
  dns.lookup(new URL(req.body.url).hostname, (error) => {
    if(error) {
      originalURL(res)
    } else {
      i++;
      shortUrlList[i] = originalURL;
      res.json({ original_url : originalURL,
                  short_url : i});
    }
  }) 
})

app.get('/api/shorturl/:id', function(req, res) {
  res.redirect(shortUrlList[req.params.id]);
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
