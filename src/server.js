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

if (app.get('env') === 'development') {
  app.locals.pretty = true;
}


app.post('/', function (req, res) {
  let appID = req.body.gameID;
  let url_PlayerCount = `https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?key=<apiKey>&appid=` + appID;
  let url_GameDetails = `https://store.steampowered.com/api/appdetails?appids=${appID}&format=json`;
  let url_GameReviews = `http://store.steampowered.com/appreviews/${appID}?json=1&start_offset=20` ;
  let url_concurrentPlayers = 'https://steamdb.info/embed/?appid=' + appID;
  let playerCountText = "";
  
  let reviewScoreDescText = "";
  let totalPositiveText = "";
  let totalNegativeText = "";
  let totalReviewsText = "";     
  //Here we get the Player Count information then display it
  request(url_PlayerCount, function (err, response, body) {
    if(err){
	  console.log("error", error);
    } else {
		 
		  let playerCount = JSON.parse(body);
		  if(playerCount.response.player_count == undefined){
		      res.render('index', {playerCount: null, error: 'Error: Inputted game name is incorrect or game does not exist.'});
          }else {
		      playerCountText = "Players Online: " + playerCount.response.player_count;
              
          }
      }
  });
  
  
  request(url_GameReviews, function (err, response, body) {
	if(err){
	  console.log("error", error);
    } else {
		 
		gameReviews = JSON.parse(body);
		reviewScoreDescText = "Game Raiting: " + gameReviews.query_summary.review_score_desc;
		totalPositiveText = "Total positive reviews: " + gameReviews.query_summary.total_positive;
		totalNegativeText = "Total negative reviews: " + gameReviews.query_summary.total_negative;
		totalReviewsText = "Total number of reviews: " + gameReviews.query_summary.total_reviews;  

		}
			
      
	});

 
  
  //Here we get the Game details then display it
  request(url_GameDetails, function(err,response,body){
      if(err){
          console.log("error", error);
      }
	  else{
          let gameDetails = JSON.parse(body);
          let gameNameText = "Game Name: " + gameDetails[appID].data.name;
          let gameDescriptionText = gameDetails[appID].data.detailed_description;
		  let gameTypeText = "Game Type: " + gameDetails[appID].data.type;
		  let parentWarningText =  gameDetails[appID].data.content_descriptors.notes;
		  let gameScoreText =   gameDetails[appID].data.metacritic.score;
		  let URLforReview =  gameDetails[appID]. data.metacritic.url;
          res.render('index', {
			  gameDescription: gameDescriptionText,
			  playerCount: playerCountText, 
			  gameName: gameNameText, 
			  gameWarning: parentWarningText, 
			  gameType: gameTypeText, 
			  
			  ReviewURL: URLforReview, 
			  gameScore: gameScoreText,
			  ID: appID, 
			  reviewDesc: reviewScoreDescText, 
			  totalPositive: totalPositiveText, 
			  totalNegative: totalNegativeText,
			  totalReviews: totalReviewsText,
			  error: null});
			 
		}


    });
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
