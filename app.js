const scrapperArray = require('./index');
const express = require('express')
const app = express()
const port = 3000

app.set('view engine', 'pug')

app.get('/', (req, res) => {
  let options = {
    dotfiles: "ignore"
    }

  res.sendFile(__dirname + '/backlinks-status.txt', options, function(err) {
    if (err) {
      res.send('<p>Data scrapping is pending...</p>')
    }
  })}
  );
app.listen(port, () => console.log(`Backlinks life checker works at http://localhost:${port} with basic info \nHTML version of output is placed at http://localhost:${port}/backlinks-status`));

app.get('/backlinks-status', function (req, res) {

    res.render(__dirname + '/index', { title: 'Hey', message: 'Your backlinks anchor texts!', arrOfUrls: scrapperArray.result }, function(err,html) {
      if(err) {
        res.send('<p>Data scrapping is pending...</p>');
      } else {
        res.send(html);
      }
    });
    console.log(scrapperArray.result);
  });
