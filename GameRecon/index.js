const argv = require('yargs').argv;

let request = require('request');

let apiKey = '6555be6ec19063c1220468a8d083d81b';
let city = argv.c || 'portland';
let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`

request(url, function (err, response, body) {
  if(err){
    console.log('error:', error);
  } else {
	let weather = JSON.parse(body);
	let message = `It's ${weather.main.temp}F degrees  in ${weather.name}!`;
    //console.log('body:', body);
	console.log(message);
  }
});