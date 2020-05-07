const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express()

//const apiKey = '6555be6ec19063c1220468a8d083d81b'; //Weather API key
const apiKey = '35DD1F8971E5FF2184D4DEE678AC44D5';

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs')

app.get('/', function (req, res) {
  res.render('index');
})

app.post('/', function (req, res) {
  let appID = req.body.gameID;
  let url_PlayerCount = `https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?key=<apiKey>&appid=` + appID;
  let url_GameDetails = `https://store.steampowered.com/api/appdetails?appids=${appID}&format=json`;
  let url_concurrentPlayers = 'https://steamdb.info/embed/?appid=' + appID;
  let playerCountText = "";
  //Here we get the Player Count information then display it
  request(url_PlayerCount, function (err, response, body) {
    if(err){
	  console.log("error", error);
    } else {
		  let ID = req.body.gameID;
		  let playerCount = JSON.parse(body);
		  if(playerCount.response.player_count == undefined){
		      res.render('index', {playerCount: null, error: 'Error: Inputted game name is incorrect or game does not exist.'});
          }else {
		      playerCountText = "Players Online: " + playerCount.response.player_count;
              //console.log(playerCount[appID].data.name);
              //res.render('index', {playerCount: playerCountText, error: null});
          }
      }
  });
  //Here we get the Game details then display it
  request(url_GameDetails, function(err,response,body){
      if(err){
          console.log("error", error);
      }else {
          let gameDetails = JSON.parse(body);
          let gameNameText = "App Name: " + gameDetails[appID].data.name;
          let gameDescriptionText = "App Description: " + gameDetails[appID].data.detailed_description;
		  let gameTypeText = "App Type: " + gameDetails[appID].data.type;
          res.render('index', {playerCount: playerCountText, gameName: gameNameText,gameType: gameTypeText, gameDescription: gameDescriptionText, ID: appID, error: null});

      }


    });
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
